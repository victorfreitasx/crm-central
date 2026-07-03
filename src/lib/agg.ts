// Agregados do placar — mesma matemática do protótipo, sobre dados reais do D1.
// IDP = engajamento do post ÷ mediana 90d da própria página × 100 (clamp 24..320).
// Cache no KV por 3 min; invalidado em qualquer escrita de post/sync.
import type { Env, Fmt } from '../types';
import { DAY } from '../types';
import { DEFAULT_TZ, localParts, weekStartTz } from './tz';

export interface PubPost {
  id: string;
  page_id: string;
  author_id: string;
  fmt: Fmt;
  ts: number;
  status: string;
  idp: number | null;
  er: number | null;
  re: number;
  li: number;
  co: number;
  sh: number;
  sa: number;
  cl: number;
  nf: number;
}

export interface UserStats {
  posts30: number;
  re: number;
  inter: number;
  cl: number;
  ctr: number;
  nf: number;
  sa: number;
  idpAvg: number;
  delta: number;
  spark: number[];
  fmtMix: Record<Fmt, number>;
  week: number;
  bestId: string | null;
  rank: number;
}

export interface PageStats {
  posts30: number;
  re: number;
  eng: number;
  nf: number;
  spark: number[];
  topFmt: Fmt;
}

export interface Agg {
  computedAt: number;
  week0: number;
  U: Record<string, UserStats>;
  P: Record<string, PageStats>;
  G: {
    posts30: number;
    re: number;
    inter: number;
    ctr: number;
    nf: number;
    sPosts: number[];
    sRe: number[];
    sInter: number[];
    sCtr: number[];
    sNf: number[];
    week: number;
    heat: number[][];
    bestDay: number;
    bestSlot: number;
    fmtCount: Record<Fmt, number>;
    fmtRe: Record<Fmt, number>;
  };
  viralIds: string[];
  radar: { agendados: number; rascunhos: number; analise: number };
  order: string[]; // user ids por idpAvg desc
}

const CACHE_KEY = 'agg:v1';
const CACHE_TTL = 180;

export async function invalidateAgg(env: Env): Promise<void> {
  await env.CACHE.delete(CACHE_KEY);
}

/** Segunda-feira 00:00 local (fuso da marca) da semana de `now`. */
export function weekStart(now: number, tz: string = DEFAULT_TZ): number {
  return weekStartTz(now, tz);
}

export async function loadPublished(env: Env, sinceDays = 90): Promise<PubPost[]> {
  const since = Date.now() - sinceDays * DAY;
  const rows = await env.DB.prepare(
    `SELECT p.id, p.page_id, p.author_id, p.fmt, p.ts, p.status, p.idp, p.er,
            m.re, m.li, m.co, m.sh, m.sa, m.cl, m.nf
       FROM posts p JOIN post_metrics m ON m.post_id = p.id
      WHERE p.status IN ('publicado','analisando') AND p.ts >= ?
      ORDER BY p.ts DESC`,
  )
    .bind(since)
    .all<PubPost>();
  return rows.results;
}

export async function computeAgg(env: Env): Promise<Agg> {
  const cached = await env.CACHE.get(CACHE_KEY);
  if (cached) {
    try {
      const agg = JSON.parse(cached) as Agg;
      if (Date.now() - agg.computedAt < CACHE_TTL * 1000) return agg;
    } catch {
      /* recomputa */
    }
  }

  const NOW = Date.now();
  const tzRow = await env.DB.prepare("SELECT value FROM settings WHERE key = 'tz'").first<{ value: string }>();
  const TZ = tzRow?.value || DEFAULT_TZ;
  const W0 = weekStart(NOW, TZ);
  const pub = await loadPublished(env);
  const in30 = (p: PubPost) => p.ts >= NOW - 30 * DAY;

  const users = (await env.DB.prepare("SELECT id FROM users WHERE role = 'equipe' AND status != 'suspenso'").all<{ id: string }>()).results;
  const pages = (await env.DB.prepare('SELECT id FROM pages').all<{ id: string }>()).results;

  // contagens da semana (agendado/analisando/publicado contam pra meta; 'erro' e
  // 'rascunho' não — publicação que falhou não deve bater a meta semanal)
  const weekRows = (
    await env.DB.prepare(
      "SELECT author_id, COUNT(*) AS c FROM posts WHERE ts >= ? AND ts < ? AND status IN ('agendado','analisando','publicado') GROUP BY author_id",
    )
      .bind(W0, W0 + 7 * DAY)
      .all<{ author_id: string; c: number }>()
  ).results;
  const weekBy: Record<string, number> = {};
  for (const w of weekRows) weekBy[w.author_id] = w.c;

  const emptyMix = (): Record<Fmt, number> => ({ feed: 0, carrossel: 0, reels: 0, story: 0 });

  const U: Record<string, UserStats> = {};
  for (const { id } of users) {
    const mine = pub.filter((p) => p.author_id === id);
    const p30 = mine.filter(in30);
    const sum = (k: 're' | 'li' | 'co' | 'sh' | 'sa' | 'cl' | 'nf') => p30.reduce((s, p) => s + p[k], 0);
    const re = sum('re');
    const cl = sum('cl');
    const idps = p30.map((p) => p.idp ?? 100);
    const idpAvg = idps.length ? Math.round(idps.reduce((a, b) => a + b, 0) / idps.length) : 100;
    const avg = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : idpAvg);
    const d15 = avg(mine.filter((p) => p.ts >= NOW - 15 * DAY).map((p) => p.idp ?? 100));
    const dPrev = avg(mine.filter((p) => p.ts < NOW - 15 * DAY && p.ts >= NOW - 30 * DAY).map((p) => p.idp ?? 100));
    const spark = Array.from({ length: 8 }, (_, i) => {
      const a = NOW - (8 - i) * 7.5 * DAY;
      const b = NOW - (7 - i) * 7.5 * DAY;
      return mine.filter((p) => p.ts >= a && p.ts < b).reduce((s, p) => s + p.re, 0);
    });
    const mx = Math.max(...spark, 1);
    const fmtMix = emptyMix();
    for (const p of p30) fmtMix[p.fmt]++;
    const best = p30.slice().sort((a, b) => (b.idp ?? 0) - (a.idp ?? 0))[0] || null;
    U[id] = {
      posts30: p30.length,
      re,
      inter: sum('li') + sum('co') + sum('sh') + sum('sa'),
      cl,
      ctr: re ? cl / re : 0,
      nf: sum('nf'),
      sa: sum('sa'),
      idpAvg,
      delta: Math.round(d15 - dPrev),
      spark: spark.map((v) => v / mx),
      fmtMix,
      week: weekBy[id] || 0,
      bestId: best ? best.id : null,
      rank: 0,
    };
  }
  const order = users
    .map((u) => u.id)
    .sort((a, b) => (U[b]?.idpAvg ?? 0) - (U[a]?.idpAvg ?? 0));
  order.forEach((uid, i) => {
    const s = U[uid];
    if (s) s.rank = i + 1;
  });

  const P: Record<string, PageStats> = {};
  for (const { id } of pages) {
    const mine = pub.filter((p) => p.page_id === id);
    const p30 = mine.filter(in30);
    const re = p30.reduce((s, p) => s + p.re, 0);
    const spark = Array.from({ length: 8 }, (_, i) => {
      const a = NOW - (8 - i) * 7.5 * DAY;
      const b = NOW - (7 - i) * 7.5 * DAY;
      return mine.filter((p) => p.ts >= a && p.ts < b).reduce((s, p) => s + p.re, 0);
    });
    const mx = Math.max(...spark, 1);
    const fre: Record<Fmt, number> = { feed: 0, carrossel: 0, reels: 0, story: 0 };
    for (const p of p30) fre[p.fmt] += p.re;
    P[id] = {
      posts30: p30.length,
      re,
      eng: p30.length ? p30.reduce((s, p) => s + (p.er ?? 0), 0) / p30.length : 0,
      nf: p30.reduce((s, p) => s + p.nf, 0),
      spark: spark.map((v) => v / mx),
      topFmt: (Object.keys(fre) as Fmt[]).sort((a, b) => fre[b] - fre[a])[0] as Fmt,
    };
  }

  const g30 = pub.filter(in30);
  const gre = g30.reduce((s, p) => s + p.re, 0);
  const gcl = g30.reduce((s, p) => s + p.cl, 0);
  const dayOf = (p: PubPost) => Math.floor((NOW - p.ts) / DAY);
  const series = (f: (dp: PubPost[]) => number) =>
    Array.from({ length: 14 }, (_, i) => {
      const d = 13 - i;
      return f(pub.filter((p) => dayOf(p) === d));
    });

  const weekTotal = await env.DB.prepare(
    "SELECT COUNT(*) AS c FROM posts WHERE ts >= ? AND ts < ? AND status IN ('agendado','analisando','publicado')",
  )
    .bind(W0, W0 + 7 * DAY)
    .first<{ c: number }>();

  // heat 7 dias × 5 faixas (média de engajamento, 60d) — janela ótima de postagem.
  // Dia e hora no fuso da marca (não UTC do runtime).
  const heat: number[][] = Array.from({ length: 7 }, () => [0, 0, 0, 0, 0]);
  const hc: number[][] = Array.from({ length: 7 }, () => [0, 0, 0, 0, 0]);
  for (const p of pub.filter((x) => x.ts >= NOW - 60 * DAY)) {
    const lp = localParts(p.ts, TZ);
    const d = (lp.dow + 6) % 7;
    const h = lp.hour;
    const s = h < 11 ? 0 : h < 14 ? 1 : h < 17 ? 2 : h < 20 ? 3 : 4;
    const hrow = heat[d] as number[];
    const crow = hc[d] as number[];
    hrow[s] = (hrow[s] ?? 0) + (p.er ?? 0);
    crow[s] = (crow[s] ?? 0) + 1;
  }
  let hmax = 0,
    hd = 3,
    hs = 3;
  for (let d = 0; d < 7; d++)
    for (let s = 0; s < 5; s++) {
      const row = heat[d] as number[];
      const cnt = (hc[d] as number[])[s] as number;
      row[s] = cnt ? (row[s] as number) / cnt : 0;
      if ((row[s] as number) > hmax) {
        hmax = row[s] as number;
        hd = d;
        hs = s;
      }
    }

  const fmtCount: Record<Fmt, number> = { feed: 0, carrossel: 0, reels: 0, story: 0 };
  const fmtRe: Record<Fmt, number> = { feed: 0, carrossel: 0, reels: 0, story: 0 };
  for (const p of g30) {
    fmtCount[p.fmt] = (fmtCount[p.fmt] ?? 0) + 1;
    fmtRe[p.fmt] = (fmtRe[p.fmt] ?? 0) + p.re;
  }

  const G: Agg['G'] = {
    posts30: g30.length,
    re: gre,
    inter: g30.reduce((s, p) => s + p.li + p.co + p.sh + p.sa, 0),
    ctr: gre ? gcl / gre : 0,
    nf: g30.reduce((s, p) => s + p.nf, 0),
    sPosts: series((a) => a.length),
    sRe: series((a) => a.reduce((s, p) => s + p.re, 0)),
    sInter: series((a) => a.reduce((s, p) => s + p.li + p.co + p.sh + p.sa, 0)),
    sCtr: series((a) => {
      const r0 = a.reduce((s, p) => s + p.re, 0);
      return r0 ? a.reduce((s, p) => s + p.cl, 0) / r0 : 0;
    }),
    sNf: series((a) => a.reduce((s, p) => s + p.nf, 0)),
    week: weekTotal?.c ?? 0,
    heat: heat.map((row) => row.map((v) => (hmax ? v / hmax : 0))),
    bestDay: hd,
    bestSlot: hs,
    fmtCount,
    fmtRe,
  };

  const viralIds = pub
    .filter((p) => p.ts >= NOW - 14 * DAY && (p.idp ?? 0) >= 150)
    .sort((a, b) => (b.idp ?? 0) - (a.idp ?? 0))
    .slice(0, 3)
    .map((p) => p.id);

  const radarRow = await env.DB.prepare(
    `SELECT
      (SELECT COUNT(*) FROM posts WHERE status = 'agendado' AND ts < ?) AS agendados,
      (SELECT COUNT(*) FROM posts WHERE status = 'rascunho' AND ts < ?) AS rascunhos,
      (SELECT COUNT(*) FROM posts WHERE status = 'analisando') AS analise`,
  )
    .bind(NOW + 7 * DAY, NOW - 4 * DAY)
    .first<{ agendados: number; rascunhos: number; analise: number }>();

  const agg: Agg = {
    computedAt: NOW,
    week0: W0,
    U,
    P,
    G,
    viralIds,
    radar: radarRow ?? { agendados: 0, rascunhos: 0, analise: 0 },
    order,
  };
  await env.CACHE.put(CACHE_KEY, JSON.stringify(agg), { expirationTtl: CACHE_TTL });
  return agg;
}

/** Recalcula mediana 90d por página e IDP de cada post publicado — chamado no sync. */
export async function recomputeIdp(env: Env): Promise<void> {
  const since = Date.now() - 90 * DAY;
  const rows = (
    await env.DB.prepare(
      `SELECT p.id, p.page_id, m.re, m.li, m.co, m.sh, m.sa
         FROM posts p JOIN post_metrics m ON m.post_id = p.id
        WHERE p.status IN ('publicado','analisando') AND p.ts >= ? AND m.re > 0`,
    )
      .bind(since)
      .all<{ id: string; page_id: string; re: number; li: number; co: number; sh: number; sa: number }>()
  ).results;

  const byPage = new Map<string, { id: string; er: number }[]>();
  for (const r of rows) {
    const er = (r.li + r.co + r.sh + r.sa) / r.re;
    if (!byPage.has(r.page_id)) byPage.set(r.page_id, []);
    byPage.get(r.page_id)!.push({ id: r.id, er });
  }

  const stmts: D1PreparedStatement[] = [];
  for (const [pageId, list] of byPage) {
    const sorted = list.map((x) => x.er).sort((a, b) => a - b);
    const med = sorted.length ? (sorted[Math.floor(sorted.length / 2)] as number) : 0.06;
    stmts.push(env.DB.prepare('UPDATE pages SET med_eng = ? WHERE id = ?').bind(med, pageId));
    for (const { id, er } of list) {
      const idp = Math.max(24, Math.min(320, Math.round((er / (med || 0.0001)) * 100)));
      stmts.push(env.DB.prepare('UPDATE posts SET er = ?, idp = ?, updated_at = ? WHERE id = ?').bind(er, idp, Date.now(), id));
    }
  }
  // D1 aceita lotes grandes; divide por segurança
  for (let i = 0; i < stmts.length; i += 80) await env.DB.batch(stmts.slice(i, i + 80));
  await invalidateAgg(env);
}
