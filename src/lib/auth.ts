// Autenticação: sessões no KV (cookie httpOnly) + dois provedores:
//   dev   — magic link próprio (o link volta na resposta; em produção plugue um provedor de email)
//   clerk — valida o JWT de sessão do Clerk (terceiro) via JWKS e mapeia por email
import type { Context, MiddlewareHandler } from 'hono';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import type { Env, SessionUser, UserRow } from '../types';
import { token, uid, isEmail } from './util';

const SESSION_TTL = 30 * 86400; // 30 dias
const MAGIC_TTL = 900; // 15 min

type Vars = { user: SessionUser };
export type AppContext = Context<{ Bindings: Env; Variables: Vars }>;

async function loadUserPages(env: Env, u: UserRow): Promise<string[]> {
  if (u.role === 'gestor') {
    const all = await env.DB.prepare('SELECT id FROM pages').all<{ id: string }>();
    return all.results.map((p) => p.id);
  }
  const rows = await env.DB.prepare('SELECT page_id FROM page_members WHERE user_id = ?').bind(u.id).all<{ page_id: string }>();
  return rows.results.map((p) => p.page_id);
}

export async function userByEmail(env: Env, email: string): Promise<UserRow | null> {
  return env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email.trim().toLowerCase()).first<UserRow>();
}

/** Primeiro acesso do ADMIN_EMAIL cria o gestor (bootstrap sem seed). */
export async function resolveLoginUser(env: Env, email: string): Promise<UserRow | null> {
  const norm = email.trim().toLowerCase();
  const existing = await userByEmail(env, norm);
  if (existing) return existing;
  if (norm === (env.ADMIN_EMAIL || '').trim().toLowerCase()) {
    const id = uid('u');
    await env.DB.prepare(
      "INSERT INTO users (id, email, nome, cargo, role, cor, status) VALUES (?, ?, ?, 'gestor', 'gestor', '#CBFB45', 'ativo')",
    )
      .bind(id, norm, norm.split('@')[0])
      .run();
    return userByEmail(env, norm);
  }
  return null;
}

// Retorna o token (na URL) e um nonce (guardado em cookie httpOnly no navegador
// que pediu o link). O /verify exige os dois, então um link vazado não pode ser
// resgatado em outro navegador — fecha o CSRF/fixação de sessão via magic link.
export async function createMagicToken(env: Env, email: string, bindNonce = true): Promise<{ token: string; nonce: string }> {
  const t = token(24);
  // login vincula ao navegador (nonce); convite NÃO vincula (abre no navegador do convidado)
  const nonce = bindNonce ? token(16) : '';
  await env.SESSIONS.put(`magic:${t}`, JSON.stringify(bindNonce ? { email, nonce } : { email }), { expirationTtl: MAGIC_TTL });
  return { token: t, nonce };
}

export async function consumeMagicToken(env: Env, t: string, nonce: string | undefined): Promise<string | null> {
  const raw = await env.SESSIONS.get(`magic:${t}`);
  if (!raw) return null;
  try {
    const rec = JSON.parse(raw) as { email: string; nonce?: string };
    // só consome (e invalida) o token se o nonce do cookie bater
    if (rec.nonce && rec.nonce !== nonce) return null;
    await env.SESSIONS.delete(`magic:${t}`);
    return rec.email;
  } catch {
    await env.SESSIONS.delete(`magic:${t}`);
    return null;
  }
}

export async function createSession(c: AppContext, userId: string): Promise<void> {
  const sid = token(32);
  await c.env.SESSIONS.put(`sess:${sid}`, JSON.stringify({ uid: userId }), { expirationTtl: SESSION_TTL });
  setCookie(c, 'sid', sid, {
    httpOnly: true,
    secure: new URL(c.req.url).protocol === 'https:',
    sameSite: 'Lax',
    path: '/',
    maxAge: SESSION_TTL,
  });
}

export async function destroySession(c: AppContext): Promise<void> {
  const sid = getCookie(c, 'sid');
  if (sid) await c.env.SESSIONS.delete(`sess:${sid}`);
  deleteCookie(c, 'sid', { path: '/' });
}

// ---------------- Clerk (JWT RS256 via JWKS) ----------------

interface Jwk {
  kid: string;
  kty: string;
  n: string;
  e: string;
}

async function clerkJwks(env: Env): Promise<Jwk[]> {
  const cached = await env.CACHE.get('clerk:jwks');
  if (cached) return JSON.parse(cached) as Jwk[];
  if (!env.CLERK_JWKS_URL) return [];
  const res = await fetch(env.CLERK_JWKS_URL);
  if (!res.ok) return [];
  const body = (await res.json()) as { keys: Jwk[] };
  await env.CACHE.put('clerk:jwks', JSON.stringify(body.keys), { expirationTtl: 12 * 3600 });
  return body.keys;
}

function b64urlToBytes(s: string): Uint8Array {
  const pad = s.length % 4 === 0 ? '' : '='.repeat(4 - (s.length % 4));
  const raw = atob(s.replace(/-/g, '+').replace(/_/g, '/') + pad);
  const b = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) b[i] = raw.charCodeAt(i);
  return b;
}

/** Valida assinatura+expiração de um JWT do Clerk e devolve o payload. */
export async function verifyClerkJwt(env: Env, jwt: string): Promise<Record<string, unknown> | null> {
  const parts = jwt.split('.');
  if (parts.length !== 3) return null;
  const [h, p, s] = parts as [string, string, string];
  let header: { alg: string; kid?: string };
  let payload: Record<string, unknown>;
  try {
    header = JSON.parse(new TextDecoder().decode(b64urlToBytes(h)));
    payload = JSON.parse(new TextDecoder().decode(b64urlToBytes(p)));
  } catch {
    return null;
  }
  if (header.alg !== 'RS256') return null;
  const keys = await clerkJwks(env);
  // exige match exato de kid — sem fallback pra keys[0] (evita aceitar token de kid desconhecido)
  const jwk = keys.find((k) => k.kid === header.kid);
  if (!jwk) return null;
  const key = await crypto.subtle.importKey(
    'jwk',
    { kty: jwk.kty, n: jwk.n, e: jwk.e },
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['verify'],
  );
  const ok = await crypto.subtle.verify(
    'RSASSA-PKCS1-v1_5',
    key,
    b64urlToBytes(s) as unknown as BufferSource,
    new TextEncoder().encode(`${h}.${p}`),
  );
  if (!ok) return null;
  const now = Math.floor(Date.now() / 1000);
  if (typeof payload.exp === 'number' && payload.exp < now - 30) return null;
  if (typeof payload.nbf === 'number' && payload.nbf > now + 30) return null;
  // issuer: rejeita tokens de outra instância do Clerk
  if (env.CLERK_ISSUER && payload.iss !== env.CLERK_ISSUER) return null;
  // authorized party: garante que veio de uma origem de front-end permitida
  // (também rejeita tokens de template JWT, que não têm azp)
  if (env.CLERK_AUTHORIZED_PARTIES) {
    const allowed = env.CLERK_AUTHORIZED_PARTIES.split(',').map((s) => s.trim()).filter(Boolean);
    if (!payload.azp || !allowed.includes(payload.azp as string)) return null;
  }
  return payload;
}

// ---------------- Middleware ----------------

async function currentUser(c: AppContext): Promise<SessionUser | null> {
  const env = c.env;
  let row: UserRow | null = null;

  const sid = getCookie(c, 'sid');
  if (sid) {
    const raw = await env.SESSIONS.get(`sess:${sid}`);
    if (raw) {
      const { uid: userId } = JSON.parse(raw) as { uid: string };
      row = await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(userId).first<UserRow>();
    }
  }

  if (!row && env.AUTH_MODE === 'clerk') {
    const authz = c.req.header('Authorization') || '';
    const jwt = authz.startsWith('Bearer ') ? authz.slice(7) : getCookie(c, '__session') || '';
    if (jwt) {
      const payload = await verifyClerkJwt(env, jwt);
      const email = (payload?.email as string) || '';
      if (email && isEmail(email)) row = await resolveLoginUser(env, email);
    }
  }

  if (!row || row.status === 'suspenso') return null;

  // convidado que entrou vira ativo
  if (row.status === 'convidado') {
    await env.DB.prepare("UPDATE users SET status = 'ativo' WHERE id = ?").bind(row.id).run();
    row.status = 'ativo';
  }
  // presença (throttle de 5 min pra não escrever a cada request)
  const now = Date.now();
  if (!row.last_seen_at || now - row.last_seen_at > 5 * 60e3) {
    await env.DB.prepare('UPDATE users SET last_seen_at = ? WHERE id = ?').bind(now, row.id).run();
    row.last_seen_at = now;
  }

  const pages = await loadUserPages(env, row);
  return { ...row, pages };
}

export const requireAuth: MiddlewareHandler<{ Bindings: Env; Variables: Vars }> = async (c, next) => {
  const u = await currentUser(c as AppContext);
  if (!u) return c.json({ error: 'não autenticado' }, 401);
  c.set('user', u);
  await next();
};

export const requireGestor: MiddlewareHandler<{ Bindings: Env; Variables: Vars }> = async (c, next) => {
  const u = c.get('user');
  if (!u || u.role !== 'gestor') return c.json({ error: 'apenas gestores' }, 403);
  await next();
};
