// API do placar. — todas as rotas /api/* e /media/*.
import { Hono } from 'hono';
import type { Env, Fmt, MetricsRow, PageRow, Perms, PostRow, SessionUser, UserRow } from './types';
import { DAY } from './types';
import {
  createMagicToken,
  createSession,
  consumeMagicToken,
  destroySession,
  requireAuth,
  requireGestor,
  resolveLoginUser,
  userByEmail,
} from './lib/auth';
import { computeAgg, invalidateAgg, weekStart } from './lib/agg';
import { demoSync } from './lib/demo';
import { handleOauthCallback, metaConfigured, oauthStartUrl, publishToInstagram, verifyState } from './meta';
import { isEmail, json, token, uid } from './lib/util';

type App = { Bindings: Env; Variables: { user: SessionUser } };
export const app = new Hono<App>();

// ---------------- helpers ----------------

async function getPerms(env: Env): Promise<Perms> {
  const row = await env.DB.prepare("SELECT value FROM settings WHERE key = 'perms'").first<{ value: string }>();
  return json<Perms>(row?.value, { criar: true, agendar: true, metricas: false, exportar: false });
}

async function getMetaSemanal(env: Env): Promise<number> {
  const row = await env.DB.prepare("SELECT value FROM settings WHERE key = 'meta_semanal'").first<{ value: string }>();
  const n = Number(row?.value ?? 6);
  return Number.isFinite(n) ? Math.max(1, Math.min(12, n)) : 6;
}

function audit(env: Env, userId: string | null, action: string, detail = ''): Promise<unknown> {
  return env.DB.prepare('INSERT INTO audit_log (ts, user_id, action, detail) VALUES (?, ?, ?, ?)')
    .bind(Date.now(), userId, action, detail)
    .run();
}

interface PostOut {
  id: string;
  cap: string;
  page_id: string;
  author_id: string;
  fmt: Fmt;
  status: string;
  ts: number;
  tile_bg: string;
  tile_fg: string;
  idp: number | null;
  er: number | null;
  m: { re: number; im: number; li: number; co: number; sh: number; sa: number; cl: number; nf: number } | null;
}

function postOut(p: PostRow & Partial<MetricsRow>): PostOut {
  const has = p.re != null;
  return {
    id: p.id,
    cap: p.cap,
    page_id: p.page_id,
    author_id: p.author_id,
    fmt: p.fmt,
    status: p.status,
    ts: p.ts,
    tile_bg: p.tile_bg,
    tile_fg: p.tile_fg,
    idp: p.idp,
    er: p.er,
    m: has
      ? { re: p.re!, im: p.im ?? 0, li: p.li ?? 0, co: p.co ?? 0, sh: p.sh ?? 0, sa: p.sa ?? 0, cl: p.cl ?? 0, nf: p.nf ?? 0 }
      : null,
  };
}

const POST_JOIN = `SELECT p.*, m.re, m.im, m.li, m.co, m.sh, m.sa, m.cl, m.nf FROM posts p LEFT JOIN post_metrics m ON m.post_id = p.id`;

async function postsByIds(env: Env, ids: string[]): Promise<PostOut[]> {
  if (!ids.length) return [];
  const marks = ids.map(() => '?').join(',');
  const rows = await env.DB.prepare(`${POST_JOIN} WHERE p.id IN (${marks})`)
    .bind(...ids)
    .all<PostRow & MetricsRow>();
  const by = new Map(rows.results.map((r) => [r.id, postOut(r)]));
  return ids.map((id) => by.get(id)).filter((x): x is PostOut => !!x);
}

function canSeePost(u: SessionUser, p: { author_id: string }): boolean {
  return u.role === 'gestor' || p.author_id === u.id;
}

// ---------------- auth ----------------

app.post('/api/auth/request-link', async (c) => {
  const body = await c.req.json<{ email?: string }>().catch(() => ({}) as { email?: string });
  const email = (body.email || '').trim().toLowerCase();
  if (!isEmail(email)) return c.json({ error: 'email inválido' }, 400);
  const user = await resolveLoginUser(c.env, email);
  // resposta idêntica p/ email desconhecido — não vaza quem é membro
  if (!user || user.status === 'suspenso') return c.json({ sent: true });
  const t = await createMagicToken(c.env, email);
  const link = `${new URL(c.req.url).origin}/api/auth/verify?token=${t}`;
  await audit(c.env, user.id, 'magic_link_requested');
  if (c.env.AUTH_MODE === 'dev') {
    // modo dev: devolve o link direto (sem provedor de email configurado)
    return c.json({ sent: true, link });
  }
  // produção: pendura aqui seu provedor (Resend/Postmark/SES). Por ora registra no log.
  console.log('magic link para', email, link);
  return c.json({ sent: true });
});

app.get('/api/auth/verify', async (c) => {
  const t = c.req.query('token') || '';
  const email = t ? await consumeMagicToken(c.env, t) : null;
  if (!email) return c.redirect('/#/login?erro=link-invalido');
  const user = await userByEmail(c.env, email);
  if (!user || user.status === 'suspenso') return c.redirect('/#/login?erro=sem-acesso');
  await createSession(c as never, user.id);
  await audit(c.env, user.id, 'login');
  return c.redirect('/');
});

app.post('/api/auth/logout', requireAuth, async (c) => {
  await destroySession(c as never);
  return c.json({ ok: true });
});

// ---------------- bootstrap ----------------

app.get('/api/bootstrap', requireAuth, async (c) => {
  const u = c.get('user');
  const pages = (await c.env.DB.prepare('SELECT * FROM pages ORDER BY seguidores DESC').all<PageRow>()).results;
  const users = (
    await c.env.DB.prepare("SELECT id, nome, cargo, cor, role, status FROM users WHERE status != 'convidado' ORDER BY nome").all<
      Pick<UserRow, 'id' | 'nome' | 'cargo' | 'cor' | 'role' | 'status'>
    >()
  ).results;
  const members = (await c.env.DB.prepare('SELECT page_id, user_id FROM page_members').all<{ page_id: string; user_id: string }>())
    .results;
  const pagesByUser: Record<string, string[]> = {};
  for (const m of members) (pagesByUser[m.user_id] ||= []).push(m.page_id);

  return c.json({
    me: { id: u.id, nome: u.nome, email: u.email, cargo: u.cargo, role: u.role, cor: u.cor, pages: u.pages },
    pages: pages.map((p) => ({
      id: p.id,
      handle: p.handle,
      nome: p.nome,
      color: p.color,
      fg: p.fg,
      vert: p.vert,
      seguidores: p.seguidores,
      connected: !!p.ig_user_id,
    })),
    users: users.map((x) => ({ ...x, pages: pagesByUser[x.id] || [] })),
    perms: await getPerms(c.env),
    metaSemanal: await getMetaSemanal(c.env),
    authMode: c.env.AUTH_MODE,
    demoMode: c.env.DEMO_MODE === '1',
    metaConfigured: metaConfigured(c.env),
    weekStart: weekStart(Date.now()),
  });
});

// ---------------- dashboard (gestor) ----------------

app.get('/api/dashboard', requireAuth, requireGestor, async (c) => {
  const agg = await computeAgg(c.env);
  const recentRows = await c.env.DB.prepare(`${POST_JOIN} WHERE p.status != 'rascunho' ORDER BY p.ts DESC LIMIT 8`).all<
    PostRow & MetricsRow
  >();
  const totais = await c.env.DB.prepare("SELECT COUNT(*) AS c FROM posts WHERE status IN ('publicado','analisando')").first<{
    c: number;
  }>();
  const lastSync = await c.env.CACHE.get('sync:last');
  return c.json({
    G: agg.G,
    U: agg.U,
    order: agg.order,
    radar: agg.radar,
    viral: await postsByIds(c.env, agg.viralIds),
    pagePerf: Object.entries(agg.P).map(([page_id, s]) => ({ page_id, re: s.re })),
    recent: recentRows.results.map(postOut),
    postsTotais: totais?.c ?? 0,
    metaSemanal: await getMetaSemanal(c.env),
    lastSync: lastSync ? Number(lastSync) : null,
  });
});

// ---------------- equipe (gestor) ----------------

app.get('/api/team', requireAuth, requireGestor, async (c) => {
  const agg = await computeAgg(c.env);
  const users = (
    await c.env.DB.prepare("SELECT id, nome, cargo, cor FROM users WHERE role = 'equipe' AND status != 'suspenso'").all<
      Pick<UserRow, 'id' | 'nome' | 'cargo' | 'cor'>
    >()
  ).results;
  const by = new Map(users.map((x) => [x.id, x]));
  return c.json({
    rows: agg.order
      .filter((id) => by.has(id))
      .map((id) => ({ user: by.get(id), stats: agg.U[id] })),
    metaSemanal: await getMetaSemanal(c.env),
  });
});

// ---------------- perfil ----------------

app.get('/api/profile/:uid', requireAuth, async (c) => {
  const u = c.get('user');
  const uidParam = c.req.param('uid') === 'me' ? u.id : c.req.param('uid');
  const perms = await getPerms(c.env);
  if (u.role !== 'gestor' && uidParam !== u.id && !perms.metricas) {
    return c.json({ error: 'sem permissão pra ver o placar dos colegas' }, 403);
  }
  const target = await c.env.DB.prepare('SELECT id, nome, cargo, cor, role FROM users WHERE id = ?')
    .bind(uidParam)
    .first<Pick<UserRow, 'id' | 'nome' | 'cargo' | 'cor' | 'role'>>();
  if (!target) return c.json({ error: 'colaborador não encontrado' }, 404);

  const agg = await computeAgg(c.env);
  const stats = agg.U[uidParam] ?? null;
  const memberPages = (
    await c.env.DB.prepare('SELECT page_id FROM page_members WHERE user_id = ?').bind(uidParam).all<{ page_id: string }>()
  ).results.map((x) => x.page_id);

  const NOW = Date.now();
  const perPage = (
    await c.env.DB.prepare(
      `SELECT p.page_id, COUNT(*) AS posts, COALESCE(SUM(m.re), 0) AS re
         FROM posts p JOIN post_metrics m ON m.post_id = p.id
        WHERE p.author_id = ? AND p.status IN ('publicado','analisando') AND p.ts >= ?
        GROUP BY p.page_id`,
    )
      .bind(uidParam, NOW - 30 * DAY)
      .all<{ page_id: string; posts: number; re: number }>()
  ).results;

  const mine = await c.env.DB.prepare(`${POST_JOIN} WHERE p.author_id = ? ORDER BY p.ts DESC LIMIT 15`)
    .bind(uidParam)
    .all<PostRow & MetricsRow>();
  const total = await c.env.DB.prepare('SELECT COUNT(*) AS c FROM posts WHERE author_id = ?').bind(uidParam).first<{ c: number }>();
  const teamCount = await c.env.DB.prepare("SELECT COUNT(*) AS c FROM users WHERE role = 'equipe' AND status != 'suspenso'").first<{
    c: number;
  }>();

  return c.json({
    user: { ...target, pages: memberPages },
    stats,
    perPage,
    best: stats?.bestId ? (await postsByIds(c.env, [stats.bestId]))[0] ?? null : null,
    posts: mine.results.map(postOut),
    postsTotal: total?.c ?? 0,
    teamCount: teamCount?.c ?? 0,
    metaSemanal: await getMetaSemanal(c.env),
  });
});

// ---------------- posts ----------------

app.get('/api/posts', requireAuth, async (c) => {
  const u = c.get('user');
  const q = c.req.query();
  const wheres: string[] = [];
  const binds: unknown[] = [];

  if (u.role !== 'gestor') {
    wheres.push('p.author_id = ?');
    binds.push(u.id);
  } else if (q.author && q.author !== 'all') {
    wheres.push('p.author_id = ?');
    binds.push(q.author);
  }
  if (q.q) {
    wheres.push('p.cap LIKE ?');
    binds.push(`%${q.q}%`);
  }
  if (q.page && q.page !== 'all') {
    wheres.push('p.page_id = ?');
    binds.push(q.page);
  }
  if (q.fmt && q.fmt !== 'all') {
    wheres.push('p.fmt = ?');
    binds.push(q.fmt);
  }
  if (q.status && q.status !== 'all') {
    wheres.push('p.status = ?');
    binds.push(q.status);
  }
  const where = wheres.length ? `WHERE ${wheres.join(' AND ')}` : '';
  const order =
    q.sort === 'alcance'
      ? 'ORDER BY COALESCE(m.re, -1) DESC'
      : q.sort === 'idp'
        ? 'ORDER BY COALESCE(p.idp, -1) DESC'
        : 'ORDER BY p.ts DESC';
  const limit = Math.min(120, Math.max(1, Number(q.limit) || 30));
  const offset = Math.max(0, Number(q.offset) || 0);

  const rows = await c.env.DB.prepare(`${POST_JOIN} ${where} ${order} LIMIT ? OFFSET ?`)
    .bind(...binds, limit, offset)
    .all<PostRow & MetricsRow>();
  const total = await c.env.DB.prepare(`SELECT COUNT(*) AS c FROM posts p ${where}`)
    .bind(...binds)
    .first<{ c: number }>();

  return c.json({ total: total?.c ?? 0, rows: rows.results.map(postOut) });
});

app.get('/api/posts/:id', requireAuth, async (c) => {
  const u = c.get('user');
  const row = await c.env.DB.prepare(
    `SELECT p.*, m.re, m.im, m.li, m.co, m.sh, m.sa, m.cl, m.nf, m.cities, m.curve, m.synced_at
       FROM posts p LEFT JOIN post_metrics m ON m.post_id = p.id WHERE p.id = ?`,
  )
    .bind(c.req.param('id'))
    .first<PostRow & MetricsRow>();
  if (!row) return c.json({ error: 'post não encontrado' }, 404);
  if (!canSeePost(u, row)) return c.json({ error: 'sem acesso a esse post' }, 403);
  const page = await c.env.DB.prepare('SELECT med_eng FROM pages WHERE id = ?').bind(row.page_id).first<{ med_eng: number | null }>();
  return c.json({
    post: {
      ...postOut(row),
      title: row.title,
      text: row.text,
      caption: row.caption,
      comment_on: row.comment_on,
      comment_page_id: row.comment_page_id,
      comment_text: row.comment_text,
      slides: json(row.slides, [] as { frame: string; media: string[] }[]),
      ig_media_id: row.ig_media_id,
      publish_error: row.publish_error,
      cities: json(row.cities, null),
      curve: json(row.curve, null),
      synced_at: row.synced_at ?? null,
    },
    medEng: page?.med_eng ?? null,
  });
});

interface PostBody {
  page_id?: string;
  fmt?: Fmt;
  title?: string;
  text?: string;
  caption?: string;
  comment_on?: boolean;
  comment_page_id?: string;
  comment_text?: string;
  slides?: { frame: string; media: string[]; art?: string }[];
  tile_bg?: string;
  tile_fg?: string;
}

const FRAMES = new Set(['1', '2h', '2v', '3']);

function validSlides(slides: PostBody['slides']): { frame: string; media: string[]; art?: string }[] {
  if (!Array.isArray(slides)) return [{ frame: '1', media: [] }];
  return slides.slice(0, 10).map((s) => ({
    frame: FRAMES.has(s?.frame) ? s.frame : '1',
    media: Array.isArray(s?.media) ? s.media.filter((m) => typeof m === 'string').slice(0, 4) : [],
    ...(typeof s?.art === 'string' ? { art: s.art } : {}),
  }));
}

function capFrom(b: PostBody): string {
  return (b.title || '').trim() || (b.text || '').split('\n')[0]?.trim() || 'novo post';
}

app.post('/api/posts', requireAuth, async (c) => {
  const u = c.get('user');
  const perms = await getPerms(c.env);
  if (u.role !== 'gestor' && !perms.criar) return c.json({ error: 'criação de posts desativada pelo gestor' }, 403);
  const b = await c.req.json<PostBody>().catch(() => null);
  if (!b?.page_id) return c.json({ error: 'page_id obrigatório' }, 400);
  if (u.role !== 'gestor' && !u.pages.includes(b.page_id)) return c.json({ error: 'você não tem acesso a essa página' }, 403);
  const page = await c.env.DB.prepare('SELECT id FROM pages WHERE id = ?').bind(b.page_id).first();
  if (!page) return c.json({ error: 'página não existe' }, 404);

  const fmt: Fmt = b.fmt === 'carrossel' ? 'carrossel' : b.fmt === 'story' ? 'story' : 'feed';
  const id = uid('p');
  const NOW = Date.now();
  await c.env.DB.prepare(
    `INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, title, text, caption,
       comment_on, comment_page_id, comment_text, slides, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 'rascunho', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      id,
      b.page_id,
      u.id,
      capFrom(b),
      fmt,
      NOW,
      b.tile_bg || '#FFFFFF',
      b.tile_fg || '#151210',
      b.title || '',
      b.text || '',
      b.caption || '',
      b.comment_on ? 1 : 0,
      b.comment_page_id || null,
      b.comment_text || '',
      JSON.stringify(validSlides(b.slides)),
      NOW,
      NOW,
    )
    .run();
  await invalidateAgg(c.env);
  await audit(c.env, u.id, 'post_created', id);
  return c.json({ id }, 201);
});

app.put('/api/posts/:id', requireAuth, async (c) => {
  const u = c.get('user');
  const post = await c.env.DB.prepare('SELECT * FROM posts WHERE id = ?').bind(c.req.param('id')).first<PostRow>();
  if (!post) return c.json({ error: 'post não encontrado' }, 404);
  if (!canSeePost(u, post)) return c.json({ error: 'sem acesso' }, 403);
  if (post.status !== 'rascunho' && post.status !== 'erro') return c.json({ error: 'só rascunhos podem ser editados' }, 409);
  const b = await c.req.json<PostBody>().catch(() => null);
  if (!b) return c.json({ error: 'body inválido' }, 400);
  if (b.page_id && u.role !== 'gestor' && !u.pages.includes(b.page_id)) return c.json({ error: 'sem acesso a essa página' }, 403);

  const fmt: Fmt = b.fmt === 'carrossel' ? 'carrossel' : b.fmt === 'story' ? 'story' : 'feed';
  await c.env.DB.prepare(
    `UPDATE posts SET page_id = ?, cap = ?, fmt = ?, tile_bg = ?, tile_fg = ?, title = ?, text = ?, caption = ?,
       comment_on = ?, comment_page_id = ?, comment_text = ?, slides = ?, updated_at = ? WHERE id = ?`,
  )
    .bind(
      b.page_id || post.page_id,
      capFrom({ ...b, title: b.title ?? post.title, text: b.text ?? post.text }),
      fmt,
      b.tile_bg || post.tile_bg,
      b.tile_fg || post.tile_fg,
      b.title ?? post.title,
      b.text ?? post.text,
      b.caption ?? post.caption,
      b.comment_on != null ? (b.comment_on ? 1 : 0) : post.comment_on,
      b.comment_page_id !== undefined ? b.comment_page_id : post.comment_page_id,
      b.comment_text ?? post.comment_text,
      b.slides ? JSON.stringify(validSlides(b.slides)) : post.slides,
      Date.now(),
      post.id,
    )
    .run();
  return c.json({ ok: true });
});

app.delete('/api/posts/:id', requireAuth, async (c) => {
  const u = c.get('user');
  const post = await c.env.DB.prepare('SELECT * FROM posts WHERE id = ?').bind(c.req.param('id')).first<PostRow>();
  if (!post) return c.json({ error: 'post não encontrado' }, 404);
  if (!canSeePost(u, post)) return c.json({ error: 'sem acesso' }, 403);
  if (!['rascunho', 'agendado', 'erro'].includes(post.status)) return c.json({ error: 'post publicado não pode ser apagado daqui' }, 409);
  await c.env.DB.prepare('DELETE FROM posts WHERE id = ?').bind(post.id).run();
  await invalidateAgg(c.env);
  await audit(c.env, u.id, 'post_deleted', post.id);
  return c.json({ ok: true });
});

// upload da arte (PNG do canvas do estúdio) → KV, servida em /media/<key>
app.post('/api/posts/:id/media', requireAuth, async (c) => {
  const u = c.get('user');
  const post = await c.env.DB.prepare('SELECT * FROM posts WHERE id = ?').bind(c.req.param('id')).first<PostRow>();
  if (!post) return c.json({ error: 'post não encontrado' }, 404);
  if (!canSeePost(u, post)) return c.json({ error: 'sem acesso' }, 403);
  const slide = Math.max(0, Number(c.req.query('slide')) || 0);
  const cellParam = c.req.query('cell') || '0'; // índice da célula ou 'art' (arte final renderizada)
  const ct = c.req.header('Content-Type') || '';
  if (!/^image\/(png|jpeg|webp)$/.test(ct)) return c.json({ error: 'envie image/png, jpeg ou webp' }, 415);
  const buf = await c.req.arrayBuffer();
  if (buf.byteLength > 8 * 1024 * 1024) return c.json({ error: 'imagem acima de 8 MB' }, 413);

  const ext = ct.split('/')[1];
  const key = `${post.id}/${slide}-${cellParam}-${token(4)}.${ext}`;
  await c.env.CACHE.put(`media:${key}`, buf, { metadata: { ct } });

  const slides = validSlides(json(post.slides, []));
  while (slides.length <= slide) slides.push({ frame: '1', media: [] });
  const sl = slides[slide]!;
  if (cellParam === 'art') sl.art = key;
  else sl.media[Math.max(0, Number(cellParam) || 0)] = key;
  await c.env.DB.prepare('UPDATE posts SET slides = ?, updated_at = ? WHERE id = ?')
    .bind(JSON.stringify(slides), Date.now(), post.id)
    .run();
  return c.json({ key, url: `/media/${key}` }, 201);
});

// agendar / publicar agora
app.post('/api/posts/:id/schedule', requireAuth, async (c) => {
  const u = c.get('user');
  const perms = await getPerms(c.env);
  const post = await c.env.DB.prepare('SELECT * FROM posts WHERE id = ?').bind(c.req.param('id')).first<PostRow>();
  if (!post) return c.json({ error: 'post não encontrado' }, 404);
  if (!canSeePost(u, post)) return c.json({ error: 'sem acesso' }, 403);
  if (!['rascunho', 'agendado', 'erro'].includes(post.status)) return c.json({ error: 'esse post já saiu do rascunho' }, 409);
  if (u.role !== 'gestor' && !perms.agendar) {
    return c.json({ error: 'agendamento sem aprovação está desligado — peça pro gestor revisar seu rascunho' }, 403);
  }

  const b = await c.req.json<{ ts?: number; page_id?: string; now?: boolean }>().catch(() => ({}) as { ts?: number; page_id?: string; now?: boolean });
  const NOW = Date.now();
  let ts = b.now ? NOW : Number(b.ts);
  if (!Number.isFinite(ts)) return c.json({ error: 'data/hora inválida' }, 400);
  const pageId = b.page_id || post.page_id;
  if (u.role !== 'gestor' && !u.pages.includes(pageId)) return c.json({ error: 'sem acesso a essa página' }, 403);
  const page = await c.env.DB.prepare('SELECT * FROM pages WHERE id = ?').bind(pageId).first<PageRow>();
  if (!page) return c.json({ error: 'página não existe' }, 404);

  if (ts <= NOW + 60e3) {
    // publica agora
    ts = NOW;
    if (page.ig_user_id && metaConfigured(c.env)) {
      try {
        const mediaId = await publishToInstagram(c.env, page, { ...post, page_id: pageId });
        await c.env.DB.prepare(
          "UPDATE posts SET status = 'analisando', page_id = ?, ts = ?, ig_media_id = ?, publish_error = NULL, updated_at = ? WHERE id = ?",
        )
          .bind(pageId, ts, mediaId, NOW, post.id)
          .run();
      } catch (e) {
        await c.env.DB.prepare("UPDATE posts SET status = 'erro', publish_error = ?, updated_at = ? WHERE id = ?")
          .bind(String(e).slice(0, 500), NOW, post.id)
          .run();
        return c.json({ error: `falha ao publicar: ${String(e)}` }, 502);
      }
    } else if (c.env.DEMO_MODE === '1') {
      // demo: entra em análise e o sync simulado preenche as métricas
      await c.env.DB.prepare("UPDATE posts SET status = 'analisando', page_id = ?, ts = ?, updated_at = ? WHERE id = ?")
        .bind(pageId, ts, NOW, post.id)
        .run();
      c.executionCtx.waitUntil(demoSync(c.env).then(() => invalidateAgg(c.env)));
    } else {
      return c.json({ error: 'página não conectada ao Instagram — conecte em páginas › conectar' }, 409);
    }
  } else {
    await c.env.DB.prepare("UPDATE posts SET status = 'agendado', page_id = ?, ts = ?, updated_at = ? WHERE id = ?")
      .bind(pageId, ts, NOW, post.id)
      .run();
  }
  await invalidateAgg(c.env);
  await audit(c.env, u.id, ts === NOW ? 'post_published' : 'post_scheduled', post.id);
  const updated = await c.env.DB.prepare('SELECT status, ts FROM posts WHERE id = ?').bind(post.id).first();
  return c.json({ ok: true, ...updated });
});

// ---------------- agenda ----------------

app.get('/api/agenda', requireAuth, async (c) => {
  const u = c.get('user');
  const NOW = Date.now();
  const y = Number(c.req.query('y')) || new Date(NOW).getFullYear();
  const mq = Number(c.req.query('m'));
  const m = Number.isFinite(mq) ? mq : new Date(NOW).getMonth();
  const start = new Date(y, m, 1).getTime();
  const end = new Date(y, m + 1, 1).getTime();

  const inMonth = await c.env.DB.prepare(`${POST_JOIN} WHERE p.ts >= ? AND p.ts < ? AND p.status != 'rascunho' ORDER BY p.ts`)
    .bind(start, end)
    .all<PostRow & MetricsRow>();
  const fila = await c.env.DB.prepare(`${POST_JOIN} WHERE p.status = 'agendado' AND p.ts >= ? ORDER BY p.ts LIMIT 7`)
    .bind(NOW - 36e5)
    .all<PostRow & MetricsRow>();
  const draftsQ =
    u.role === 'gestor'
      ? c.env.DB.prepare(`${POST_JOIN} WHERE p.status = 'rascunho' ORDER BY p.ts`)
      : c.env.DB.prepare(`${POST_JOIN} WHERE p.status = 'rascunho' AND p.author_id = ? ORDER BY p.ts`).bind(u.id);
  const drafts = await draftsQ.all<PostRow & MetricsRow>();
  const agg = await computeAgg(c.env);

  return c.json({
    month: inMonth.results.map(postOut),
    fila: fila.results.map(postOut),
    drafts: drafts.results.map(postOut),
    heat: agg.G.heat,
    bestDay: agg.G.bestDay,
    bestSlot: agg.G.bestSlot,
  });
});

// ---------------- páginas ----------------

app.get('/api/pages', requireAuth, async (c) => {
  const agg = await computeAgg(c.env);
  const pages = (await c.env.DB.prepare('SELECT * FROM pages ORDER BY seguidores DESC').all<PageRow>()).results;
  const members = (await c.env.DB.prepare('SELECT page_id, user_id FROM page_members').all<{ page_id: string; user_id: string }>())
    .results;
  const teamBy: Record<string, string[]> = {};
  for (const m of members) (teamBy[m.page_id] ||= []).push(m.user_id);
  return c.json({
    cards: pages.map((p) => ({
      id: p.id,
      handle: p.handle,
      nome: p.nome,
      color: p.color,
      fg: p.fg,
      vert: p.vert,
      seguidores: p.seguidores,
      connected: !!p.ig_user_id,
      stats: agg.P[p.id] ?? null,
      team: teamBy[p.id] || [],
    })),
  });
});

// ---------------- config (gestor) ----------------

app.get('/api/config', requireAuth, requireGestor, async (c) => {
  const users = (await c.env.DB.prepare('SELECT * FROM users ORDER BY role DESC, nome').all<UserRow>()).results;
  const members = (await c.env.DB.prepare('SELECT page_id, user_id FROM page_members').all<{ page_id: string; user_id: string }>())
    .results;
  const pagesBy: Record<string, string[]> = {};
  for (const m of members) (pagesBy[m.user_id] ||= []).push(m.page_id);
  const counts = await c.env.DB.prepare(
    'SELECT (SELECT COUNT(*) FROM posts) AS posts, (SELECT COUNT(*) FROM post_metrics) AS metrics, (SELECT COUNT(*) FROM pages) AS pages',
  ).first<{ posts: number; metrics: number; pages: number }>();
  const lastSync = await c.env.CACHE.get('sync:last');
  return c.json({
    members: users.map((x) => ({
      id: x.id,
      nome: x.nome,
      email: x.email,
      cargo: x.cargo,
      role: x.role,
      cor: x.cor,
      status: x.status,
      last_seen_at: x.last_seen_at,
      pages: pagesBy[x.id] || [],
    })),
    perms: await getPerms(c.env),
    metaSemanal: await getMetaSemanal(c.env),
    infra: {
      posts: counts?.posts ?? 0,
      metrics: counts?.metrics ?? 0,
      pages: counts?.pages ?? 0,
      lastSync: lastSync ? Number(lastSync) : null,
      demoMode: c.env.DEMO_MODE === '1',
      metaConfigured: metaConfigured(c.env),
      authMode: c.env.AUTH_MODE,
    },
  });
});

app.post('/api/invites', requireAuth, requireGestor, async (c) => {
  const b = await c.req.json<{ email?: string; cargo?: string }>().catch(() => ({}) as { email?: string; cargo?: string });
  const email = (b.email || '').trim().toLowerCase();
  if (!isEmail(email)) return c.json({ error: 'escreve um email válido primeiro' }, 400);
  const exists = await userByEmail(c.env, email);
  if (exists) return c.json({ error: 'esse email já é membro' }, 409);
  const id = uid('u');
  const nome = email.split('@')[0]!.replace(/[._]/g, ' ');
  const cores = ['#FFC9DF', '#ECFFB8', '#D9CCFF', '#FFD7C2', '#FFE6EF', '#D2F4E2', '#F4E9D6'];
  await c.env.DB.prepare(
    "INSERT INTO users (id, email, nome, cargo, role, cor, status) VALUES (?, ?, ?, ?, 'equipe', ?, 'convidado')",
  )
    .bind(id, email, nome, b.cargo || 'editor', cores[Math.floor(Math.random() * cores.length)])
    .run();
  await audit(c.env, c.get('user').id, 'invite_sent', email);
  const t = await createMagicToken(c.env, email);
  const link = `${new URL(c.req.url).origin}/api/auth/verify?token=${t}`;
  // dev: devolve o link pro gestor repassar; produção: enviaria por email
  return c.json({ ok: true, id, link: c.env.AUTH_MODE === 'dev' ? link : undefined }, 201);
});

app.patch('/api/members/:id', requireAuth, requireGestor, async (c) => {
  const me = c.get('user');
  const target = await c.env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(c.req.param('id')).first<UserRow>();
  if (!target) return c.json({ error: 'membro não encontrado' }, 404);
  const b = await c.req.json<{ cargo?: string; role?: string }>().catch(() => ({}) as { cargo?: string; role?: string });
  if (b.cargo) {
    await c.env.DB.prepare('UPDATE users SET cargo = ? WHERE id = ?').bind(String(b.cargo).slice(0, 40), target.id).run();
  }
  if (b.role === 'gestor' || b.role === 'equipe') {
    if (target.id === me.id && b.role === 'equipe') {
      const gestores = await c.env.DB.prepare("SELECT COUNT(*) AS c FROM users WHERE role = 'gestor' AND status = 'ativo'").first<{
        c: number;
      }>();
      if ((gestores?.c ?? 0) <= 1) return c.json({ error: 'você é o único gestor — promova alguém antes' }, 409);
    }
    await c.env.DB.prepare('UPDATE users SET role = ? WHERE id = ?').bind(b.role, target.id).run();
  }
  await audit(c.env, me.id, 'member_updated', `${target.id} ${JSON.stringify(b)}`);
  return c.json({ ok: true });
});

app.post('/api/members/:id/suspend', requireAuth, requireGestor, async (c) => {
  const me = c.get('user');
  const target = await c.env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(c.req.param('id')).first<UserRow>();
  if (!target) return c.json({ error: 'membro não encontrado' }, 404);
  if (target.id === me.id) return c.json({ error: 'você não pode suspender a si mesmo' }, 409);
  const to = target.status === 'suspenso' ? 'ativo' : 'suspenso';
  await c.env.DB.prepare('UPDATE users SET status = ? WHERE id = ?').bind(to, target.id).run();
  await invalidateAgg(c.env);
  await audit(c.env, me.id, to === 'suspenso' ? 'member_suspended' : 'member_reactivated', target.id);
  return c.json({ ok: true, status: to });
});

app.put('/api/members/:id/pages', requireAuth, requireGestor, async (c) => {
  const target = await c.env.DB.prepare('SELECT id FROM users WHERE id = ?').bind(c.req.param('id')).first<{ id: string }>();
  if (!target) return c.json({ error: 'membro não encontrado' }, 404);
  const b = await c.req.json<{ page_ids?: string[] }>().catch(() => ({}) as { page_ids?: string[] });
  const ids = Array.isArray(b.page_ids) ? b.page_ids.slice(0, 50) : [];
  const stmts = [c.env.DB.prepare('DELETE FROM page_members WHERE user_id = ?').bind(target.id)];
  for (const pid of ids) stmts.push(c.env.DB.prepare('INSERT OR IGNORE INTO page_members (page_id, user_id) VALUES (?, ?)').bind(pid, target.id));
  await c.env.DB.batch(stmts);
  return c.json({ ok: true });
});

app.put('/api/perms', requireAuth, requireGestor, async (c) => {
  const cur = await getPerms(c.env);
  const b = await c.req.json<Partial<Perms>>().catch(() => ({}) as Partial<Perms>);
  const next: Perms = {
    criar: typeof b.criar === 'boolean' ? b.criar : cur.criar,
    agendar: typeof b.agendar === 'boolean' ? b.agendar : cur.agendar,
    metricas: typeof b.metricas === 'boolean' ? b.metricas : cur.metricas,
    exportar: typeof b.exportar === 'boolean' ? b.exportar : cur.exportar,
  };
  await c.env.DB.prepare("INSERT INTO settings (key, value) VALUES ('perms', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value")
    .bind(JSON.stringify(next))
    .run();
  return c.json({ ok: true, perms: next });
});

app.put('/api/settings/meta-semanal', requireAuth, requireGestor, async (c) => {
  const b = await c.req.json<{ metaSemanal?: number }>().catch(() => ({}) as { metaSemanal?: number });
  const n = Math.max(1, Math.min(12, Number(b.metaSemanal) || 6));
  await c.env.DB.prepare(
    "INSERT INTO settings (key, value) VALUES ('meta_semanal', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
  )
    .bind(String(n))
    .run();
  return c.json({ ok: true, metaSemanal: n });
});

// ---------------- exportação ----------------

app.get('/api/export/posts.csv', requireAuth, async (c) => {
  const u = c.get('user');
  const perms = await getPerms(c.env);
  if (u.role !== 'gestor' && !perms.exportar) return c.json({ error: 'exportação desativada pelo gestor' }, 403);
  const rows = await c.env.DB.prepare(
    `SELECT p.id, p.cap, g.handle, us.nome AS autor, p.fmt, p.status, p.ts, p.idp, p.er,
            m.re, m.im, m.li, m.co, m.sh, m.sa, m.cl, m.nf
       FROM posts p
       JOIN pages g ON g.id = p.page_id
       JOIN users us ON us.id = p.author_id
       LEFT JOIN post_metrics m ON m.post_id = p.id
      ORDER BY p.ts DESC LIMIT 5000`,
  ).all<Record<string, string | number | null>>();
  const cols = ['id', 'cap', 'handle', 'autor', 'fmt', 'status', 'ts', 'idp', 'er', 're', 'im', 'li', 'co', 'sh', 'sa', 'cl', 'nf'];
  const esc = (v: unknown) => (v == null ? '' : /[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
  const csv = [cols.join(','), ...rows.results.map((r) => cols.map((k) => esc(r[k])).join(','))].join('\n');
  return c.body(csv, 200, {
    'Content-Type': 'text/csv; charset=utf-8',
    'Content-Disposition': 'attachment; filename="placar-posts.csv"',
  });
});

// ---------------- Meta OAuth ----------------

app.get('/api/meta/oauth/start', requireAuth, requireGestor, async (c) => {
  if (!metaConfigured(c.env)) {
    return c.json({ error: 'configure META_APP_ID / META_APP_SECRET / SESSION_SECRET primeiro (wrangler secret put)' }, 409);
  }
  return c.redirect(await oauthStartUrl(c.env, c.get('user').id));
});

app.get('/api/meta/oauth/callback', async (c) => {
  const code = c.req.query('code');
  const state = c.req.query('state') || '';
  if (!code || !metaConfigured(c.env)) return c.redirect('/#/paginas?erro=oauth');
  if (!(await verifyState(c.env, state))) return c.redirect('/#/paginas?erro=state');
  try {
    const { imported } = await handleOauthCallback(c.env, code);
    return c.redirect(`/#/paginas?conectadas=${imported.length}`);
  } catch (e) {
    console.error('oauth callback', e);
    return c.redirect('/#/paginas?erro=graph');
  }
});

// ---------------- admin (demo) ----------------

app.post('/api/admin/wipe-demo', requireAuth, requireGestor, async (c) => {
  // remove somente linhas do seed (ids curtos padrão u0..u7 / pg1..pg5 / p<n>)
  await c.env.DB.batch([
    c.env.DB.prepare("DELETE FROM post_metrics WHERE post_id IN (SELECT id FROM posts WHERE id GLOB 'p[0-9]*')"),
    c.env.DB.prepare("DELETE FROM posts WHERE id GLOB 'p[0-9]*'"),
    c.env.DB.prepare("DELETE FROM page_members WHERE page_id GLOB 'pg[0-9]' OR user_id GLOB 'u[0-9]'"),
    c.env.DB.prepare("DELETE FROM page_metrics_daily WHERE page_id GLOB 'pg[0-9]'"),
    c.env.DB.prepare("DELETE FROM pages WHERE id GLOB 'pg[0-9]' AND ig_user_id IS NULL"),
    c.env.DB.prepare("DELETE FROM users WHERE id GLOB 'u[0-9]' AND id != ?").bind(c.get('user').id),
  ]);
  await invalidateAgg(c.env);
  await audit(c.env, c.get('user').id, 'demo_wiped');
  return c.json({ ok: true });
});

// dispara o sync manualmente (gestor) — útil pra ver métricas na hora
app.post('/api/admin/sync-now', requireAuth, requireGestor, async (c) => {
  const { fullSync } = await import('./meta');
  if (c.env.DEMO_MODE === '1') await demoSync(c.env);
  await fullSync(c.env);
  await invalidateAgg(c.env);
  return c.json({ ok: true });
});

// ---------------- mídia pública (artes) ----------------

app.get('/media/*', async (c) => {
  const key = c.req.path.replace(/^\/media\//, '');
  const obj = await c.env.CACHE.getWithMetadata(`media:${key}`, 'arrayBuffer');
  if (!obj.value) return c.text('não encontrado', 404);
  const ct = (obj.metadata as { ct?: string } | null)?.ct || 'image/png';
  return c.body(obj.value as ArrayBuffer, 200, {
    'Content-Type': ct,
    'Cache-Control': 'public, max-age=31536000, immutable',
  });
});
