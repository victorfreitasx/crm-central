// Integração Instagram Graph API (Meta) — OAuth, publicação e sync de métricas.
//
// Fluxo de conexão (gestor):
//   /api/meta/oauth/start → dialog OAuth do Facebook → callback troca code por
//   token de usuário longo → lista páginas FB → importa contas IG business
//   vinculadas, com o token de página criptografado (AES-GCM) no D1.
//
// Publicação: container de mídia (imagem única, STORIES ou carrossel) →
//   media_publish. As artes saem do KV via URL pública /media/<key>.
//
// Sync (cron 30 min): insights por mídia → post_metrics; seguidores → pages +
//   page_metrics_daily; recalcula mediana/IDP; transição analisando→publicado.
import type { Env, PageRow, PostRow } from './types';
import { DAY } from './types';
import { decrypt, encrypt, hmac, timingSafeEqual } from './lib/crypto';
import { invalidateAgg, recomputeIdp } from './lib/agg';
import { json } from './lib/util';

const GRAPH = 'https://graph.facebook.com/v23.0';
const OAUTH_SCOPES = [
  'instagram_basic',
  'instagram_content_publish',
  'instagram_manage_insights',
  'instagram_manage_comments',
  'pages_show_list',
  'pages_read_engagement',
  'business_management',
].join(',');

export function metaConfigured(env: Env): boolean {
  return !!(env.META_APP_ID && env.META_APP_SECRET && env.SESSION_SECRET);
}

function redirectUri(env: Env): string {
  return `${env.APP_URL.replace(/\/$/, '')}/api/meta/oauth/callback`;
}

export async function oauthStartUrl(env: Env, userId: string): Promise<string> {
  const state = `${userId}.${Date.now()}`;
  const sig = await hmac(env.SESSION_SECRET!, state);
  const u = new URL('https://www.facebook.com/v23.0/dialog/oauth');
  u.searchParams.set('client_id', env.META_APP_ID!);
  u.searchParams.set('redirect_uri', redirectUri(env));
  u.searchParams.set('scope', OAUTH_SCOPES);
  u.searchParams.set('response_type', 'code');
  u.searchParams.set('state', `${state}.${sig}`);
  return u.toString();
}

export async function verifyState(env: Env, state: string): Promise<boolean> {
  const i = state.lastIndexOf('.');
  if (i < 0) return false;
  const payload = state.slice(0, i);
  const sig = state.slice(i + 1);
  const expect = await hmac(env.SESSION_SECRET!, payload);
  if (!timingSafeEqual(sig, expect)) return false;
  const ts = Number(payload.split('.')[1] || 0);
  return Date.now() - ts < 15 * 60e3;
}

async function graph<T>(path: string, params: Record<string, string>): Promise<T> {
  const u = new URL(`${GRAPH}${path}`);
  for (const [k, v] of Object.entries(params)) u.searchParams.set(k, v);
  const res = await fetch(u.toString());
  const body = (await res.json()) as T & { error?: { message: string; code: number } };
  if (!res.ok || body.error) throw new Error(`graph ${path}: ${body.error?.message || res.status}`);
  return body;
}

async function graphPost<T>(path: string, params: Record<string, string>): Promise<T> {
  const u = new URL(`${GRAPH}${path}`);
  const form = new URLSearchParams(params);
  const res = await fetch(u.toString(), { method: 'POST', body: form });
  const body = (await res.json()) as T & { error?: { message: string; code: number } };
  if (!res.ok || body.error) throw new Error(`graph ${path}: ${body.error?.message || res.status}`);
  return body;
}

/** Callback do OAuth: importa/atualiza páginas com conta IG business vinculada. */
export async function handleOauthCallback(env: Env, code: string): Promise<{ imported: string[] }> {
  const tok = await graph<{ access_token: string }>('/oauth/access_token', {
    client_id: env.META_APP_ID!,
    client_secret: env.META_APP_SECRET!,
    redirect_uri: redirectUri(env),
    code,
  });
  // token curto → longo (60 dias; tokens de página derivados não expiram enquanto válido)
  const long = await graph<{ access_token: string }>('/oauth/access_token', {
    grant_type: 'fb_exchange_token',
    client_id: env.META_APP_ID!,
    client_secret: env.META_APP_SECRET!,
    fb_exchange_token: tok.access_token,
  });

  const accounts = await graph<{
    data: {
      id: string;
      name: string;
      access_token: string;
      instagram_business_account?: { id: string; username: string; followers_count?: number };
    }[];
  }>('/me/accounts', {
    fields: 'id,name,access_token,instagram_business_account{id,username,followers_count}',
    access_token: long.access_token,
    limit: '50',
  });

  const imported: string[] = [];
  const NOW = Date.now();
  for (const acc of accounts.data) {
    const ig = acc.instagram_business_account;
    if (!ig) continue;
    const enc = await encrypt(env.SESSION_SECRET!, acc.access_token);
    const handle = '@' + ig.username;
    const existing = await env.DB.prepare('SELECT id FROM pages WHERE ig_user_id = ? OR handle = ?')
      .bind(ig.id, handle)
      .first<{ id: string }>();
    if (existing) {
      await env.DB.prepare(
        `UPDATE pages SET ig_user_id = ?, ig_username = ?, fb_page_id = ?, access_token_enc = ?,
                connected_at = ?, seguidores = COALESCE(?, seguidores), nome = ? WHERE id = ?`,
      )
        .bind(ig.id, ig.username, acc.id, enc, NOW, ig.followers_count ?? null, acc.name, existing.id)
        .run();
      imported.push(handle);
    } else {
      const id = 'pg_' + ig.id;
      await env.DB.prepare(
        `INSERT INTO pages (id, handle, nome, color, fg, vert, seguidores, ig_user_id, ig_username, fb_page_id, access_token_enc, connected_at)
         VALUES (?, ?, ?, '#151210', '#FBF4E9', 'geral', ?, ?, ?, ?, ?, ?)`,
      )
        .bind(id, handle, acc.name, ig.followers_count ?? 0, ig.id, ig.username, acc.id, enc, NOW)
        .run();
      imported.push(handle);
    }
  }
  await invalidateAgg(env);
  return { imported };
}

async function pageToken(env: Env, page: PageRow): Promise<string> {
  if (!page.access_token_enc) throw new Error(`página ${page.handle} sem token — conecte via OAuth`);
  return decrypt(env.SESSION_SECRET!, page.access_token_enc);
}

function mediaUrls(env: Env, post: PostRow): string[] {
  const slides = json<{ frame: string; media: string[]; art?: string }[]>(post.slides, []);
  const base = env.APP_URL.replace(/\/$/, '');
  // prioriza a arte final renderizada do estúdio; senão usa as imagens cruas da grade
  return slides.flatMap((s) => (s.art ? [s.art] : s.media || []).map((k) => `${base}/media/${k}`));
}

/** Publica um post no Instagram. Lança erro com mensagem legível se algo falhar. */
export async function publishToInstagram(env: Env, page: PageRow, post: PostRow): Promise<string> {
  const token = await pageToken(env, page);
  const igId = page.ig_user_id!;
  const urls = mediaUrls(env, post);
  if (urls.length === 0) throw new Error('post sem artes — gere as imagens no estúdio antes de publicar');
  if (post.fmt === 'reels') throw new Error('reels exige vídeo — publique manualmente por enquanto');

  let creationId: string;
  if (post.fmt === 'carrossel' && urls.length > 1) {
    const children: string[] = [];
    for (const u of urls.slice(0, 10)) {
      const child = await graphPost<{ id: string }>(`/${igId}/media`, {
        image_url: u,
        is_carousel_item: 'true',
        access_token: token,
      });
      children.push(child.id);
    }
    const container = await graphPost<{ id: string }>(`/${igId}/media`, {
      media_type: 'CAROUSEL',
      children: children.join(','),
      caption: post.caption || post.cap,
      access_token: token,
    });
    creationId = container.id;
  } else {
    const params: Record<string, string> = {
      image_url: urls[0]!,
      caption: post.caption || post.cap,
      access_token: token,
    };
    if (post.fmt === 'story') params.media_type = 'STORIES';
    const container = await graphPost<{ id: string }>(`/${igId}/media`, params);
    creationId = container.id;
  }

  const published = await graphPost<{ id: string }>(`/${igId}/media_publish`, {
    creation_id: creationId,
    access_token: token,
  });

  // comentário da marca — só é possível via API na própria página que publicou
  if (post.comment_on && post.comment_text) {
    if (!post.comment_page_id || post.comment_page_id === page.id) {
      try {
        await graphPost(`/${published.id}/comments`, { message: post.comment_text, access_token: token });
      } catch (e) {
        await env.DB.prepare('INSERT INTO audit_log (ts, user_id, action, detail) VALUES (?, ?, ?, ?)')
          .bind(Date.now(), post.author_id, 'comment_failed', String(e))
          .run();
      }
    } else {
      await env.DB.prepare('INSERT INTO audit_log (ts, user_id, action, detail) VALUES (?, ?, ?, ?)')
        .bind(Date.now(), post.author_id, 'comment_manual', `comentário de outra página (${post.comment_page_id}) precisa ser feito manualmente — limitação da Graph API`)
        .run();
    }
  }
  return published.id;
}

/** Publica agendados vencidos de páginas conectadas. */
export async function publishDue(env: Env): Promise<void> {
  const NOW = Date.now();
  const due = (
    await env.DB.prepare(
      `SELECT p.* FROM posts p JOIN pages g ON g.id = p.page_id
        WHERE p.status = 'agendado' AND p.ts <= ? AND g.ig_user_id IS NOT NULL`,
    )
      .bind(NOW)
      .all<PostRow>()
  ).results;

  for (const post of due) {
    const page = await env.DB.prepare('SELECT * FROM pages WHERE id = ?').bind(post.page_id).first<PageRow>();
    if (!page) continue;
    try {
      const mediaId = await publishToInstagram(env, page, post);
      await env.DB.prepare(
        "UPDATE posts SET status = 'analisando', ig_media_id = ?, ts = ?, publish_error = NULL, updated_at = ? WHERE id = ?",
      )
        .bind(mediaId, NOW, NOW, post.id)
        .run();
    } catch (e) {
      await env.DB.prepare("UPDATE posts SET status = 'erro', publish_error = ?, updated_at = ? WHERE id = ?")
        .bind(String(e).slice(0, 500), NOW, post.id)
        .run();
    }
  }
}

interface InsightValue {
  name: string;
  values: { value: number | Record<string, number> }[];
}

/** Sincroniza métricas das páginas conectadas (limitado por execução p/ caber no orçamento de subrequests). */
export async function syncConnectedPages(env: Env): Promise<void> {
  const NOW = Date.now();
  const pages = (
    await env.DB.prepare('SELECT * FROM pages WHERE ig_user_id IS NOT NULL AND access_token_enc IS NOT NULL').all<PageRow>()
  ).results;

  for (const page of pages) {
    let token: string;
    try {
      token = await pageToken(env, page);
    } catch {
      continue;
    }

    // seguidores + snapshot diário
    try {
      const info = await graph<{ followers_count?: number }>(`/${page.ig_user_id}`, {
        fields: 'followers_count',
        access_token: token,
      });
      if (typeof info.followers_count === 'number') {
        const today = new Date(NOW).toISOString().slice(0, 10);
        await env.DB.prepare('UPDATE pages SET seguidores = ? WHERE id = ?').bind(info.followers_count, page.id).run();
        await env.DB.prepare(
          'INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES (?, ?, ?) ON CONFLICT(page_id, day) DO UPDATE SET seguidores = excluded.seguidores',
        )
          .bind(page.id, today, info.followers_count)
          .run();
      }
    } catch (e) {
      console.warn('sync followers falhou', page.handle, e);
    }

    // posts com ig_media_id publicados nos últimos 90d — os mais novos primeiro, até 20 por rodada
    const posts = (
      await env.DB.prepare(
        `SELECT * FROM posts WHERE page_id = ? AND ig_media_id IS NOT NULL
          AND status IN ('analisando','publicado') AND ts >= ? ORDER BY ts DESC LIMIT 20`,
      )
        .bind(page.id, NOW - 90 * DAY)
        .all<PostRow>()
    ).results;

    for (const post of posts) {
      try {
        const media = await graph<{ like_count?: number; comments_count?: number }>(`/${post.ig_media_id}`, {
          fields: 'like_count,comments_count',
          access_token: token,
        });
        const ins = await graph<{ data: InsightValue[] }>(`/${post.ig_media_id}/insights`, {
          metric: 'reach,views,saved,shares,profile_activity,follows',
          access_token: token,
        });
        const get = (name: string): number => {
          const m = ins.data.find((d) => d.name === name);
          const v = m?.values?.[0]?.value;
          if (typeof v === 'number') return v;
          if (v && typeof v === 'object') return Object.values(v).reduce((a, b) => a + b, 0);
          return 0;
        };
        const re = get('reach');
        await env.DB.prepare(
          `INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, synced_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(post_id) DO UPDATE SET re=excluded.re, im=excluded.im, li=excluded.li, co=excluded.co,
             sh=excluded.sh, sa=excluded.sa, cl=excluded.cl, nf=excluded.nf, synced_at=excluded.synced_at`,
        )
          .bind(
            post.id,
            re,
            get('views'),
            media.like_count ?? 0,
            media.comments_count ?? 0,
            get('shares'),
            get('saved'),
            get('profile_activity'),
            get('follows'),
            NOW,
          )
          .run();
      } catch (e) {
        console.warn('sync insights falhou', post.id, e);
      }
    }
  }
}

export async function fullSync(env: Env): Promise<void> {
  await publishDue(env);
  await syncConnectedPages(env);
  await recomputeIdp(env);
  await env.CACHE.put('sync:last', String(Date.now()));
}
