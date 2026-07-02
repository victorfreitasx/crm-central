// Modo demo: para páginas ainda NÃO conectadas à Graph API (sem ig_user_id),
// o cron simula o ciclo de vida real — publica agendados vencidos, cria métricas
// iniciais e as faz crescer numa curva sigmoide determinística até 48h.
// Assim o produto inteiro funciona de ponta a ponta antes do OAuth da Meta.
import type { Env, Fmt, PostRow } from '../types';
import { DAY } from '../types';
import { fnv1a, rng } from './util';

const FMT_MULT: Record<Fmt, number> = { feed: 1, carrossel: 1.15, reels: 2.0, story: 0.42 };
const CITY_BASE: [string, number][] = [
  ['São Paulo', 31], ['Rio de Janeiro', 18], ['Belo Horizonte', 9], ['Curitiba', 7],
  ['Porto Alegre', 6], ['Recife', 6], ['Fortaleza', 6], ['Salvador', 6], ['Brasília', 5], ['Goiânia', 3],
];

interface Target {
  re: number; im: number; li: number; co: number; sh: number; sa: number; cl: number; nf: number;
  cities: { n: string; p: number }[];
  curve: number[];
  mu: number;
  sg: number;
}

/** Métricas finais determinísticas por post (mesma família de fórmulas do seed). */
function targetFor(post: PostRow, pageSeg: number, vert: string): Target {
  const r = rng(fnv1a(post.id));
  const skill = 0.8 + r() * 0.6;
  let re = pageSeg * (FMT_MULT[post.fmt] ?? 1) * skill * (0.05 + Math.pow(r(), 2.2) * 0.5);
  if (post.fmt === 'reels' && r() < 0.12) re *= 2 + r() * 3;
  re = Math.round(Math.max(200, re));
  const li = Math.round(re * (0.04 + r() * 0.05) * Math.sqrt(skill));
  const co = Math.round(li * (0.05 + r() * 0.07));
  const sh = Math.round(li * (vert === 'memes' ? 0.22 : 0.09) * (post.fmt === 'reels' ? 1.5 : 1) * (0.6 + r() * 0.8));
  const sa = Math.round(li * (vert === 'grana' ? 0.55 : post.fmt === 'carrossel' ? 0.4 : 0.16) * (0.6 + r() * 0.8));
  const cl = Math.round(re * (0.005 + r() * 0.02) * (vert === 'grana' || vert === 'noticias' ? 1.6 : 1));
  const nf = Math.round(re * (0.0008 + r() * 0.0035));
  const cts = CITY_BASE.map((c) => [c[0], (c[1] as number) * (0.5 + r())] as [string, number])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);
  const tot = cts.reduce((s, c) => s + c[1], 0);
  const mu = 8 + r() * 16;
  const sg = 4 + r() * 6;
  const curve = Array.from({ length: 15 }, (_, i) => {
    const h = (i / 14) * 48;
    return +(1 / (1 + Math.exp(-(h - mu) / sg))).toFixed(4);
  });
  return {
    re, im: Math.round(re * (1.05 + r() * 0.35)), li, co, sh, sa, cl, nf,
    cities: cts.map((c) => ({ n: c[0], p: Math.round((c[1] / tot) * 100) })),
    curve, mu, sg,
  };
}

export async function demoSync(env: Env): Promise<number> {
  const NOW = Date.now();
  let touched = 0;

  // 1) publica agendados vencidos de páginas não conectadas
  const due = (
    await env.DB.prepare(
      `SELECT p.* FROM posts p JOIN pages g ON g.id = p.page_id
        WHERE p.status = 'agendado' AND p.ts <= ? AND g.ig_user_id IS NULL`,
    )
      .bind(NOW)
      .all<PostRow>()
  ).results;
  for (const p of due) {
    await env.DB.prepare("UPDATE posts SET status = 'analisando', updated_at = ? WHERE id = ?").bind(NOW, p.id).run();
    touched++;
  }

  // 2) métricas simuladas crescem na sigmoide até 48h
  const analising = (
    await env.DB.prepare(
      `SELECT p.*, g.seguidores AS _seg, g.vert AS _vert FROM posts p JOIN pages g ON g.id = p.page_id
        WHERE p.status = 'analisando' AND g.ig_user_id IS NULL`,
    ).all<PostRow & { _seg: number; _vert: string }>()
  ).results;

  for (const p of analising) {
    const t = targetFor(p, p._seg, p._vert);
    const ageH = Math.max(0.2, (NOW - p.ts) / 36e5);
    const frac = Math.min(1, 1 / (1 + Math.exp(-(ageH - t.mu) / t.sg)) / (1 / (1 + Math.exp(-(48 - t.mu) / t.sg))));
    const scale = (v: number) => Math.round(v * frac);
    await env.DB.prepare(
      `INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(post_id) DO UPDATE SET re=excluded.re, im=excluded.im, li=excluded.li, co=excluded.co,
         sh=excluded.sh, sa=excluded.sa, cl=excluded.cl, nf=excluded.nf, cities=excluded.cities,
         curve=excluded.curve, synced_at=excluded.synced_at`,
    )
      .bind(
        p.id, scale(t.re), scale(t.im), scale(t.li), scale(t.co), scale(t.sh), scale(t.sa),
        scale(t.cl), scale(t.nf), JSON.stringify(t.cities), JSON.stringify(t.curve), NOW,
      )
      .run();
    touched++;
  }

  // 3) 48h de análise → publicado (todas as páginas)
  const flipped = await env.DB.prepare(
    "UPDATE posts SET status = 'publicado', updated_at = ? WHERE status = 'analisando' AND ts <= ?",
  )
    .bind(NOW, NOW - 48 * 36e5)
    .run();
  touched += flipped.meta.changes ?? 0;

  // 4) seguidores do dia (páginas demo: leve crescimento determinístico)
  const today = new Date(NOW).toISOString().slice(0, 10);
  const pages = (
    await env.DB.prepare('SELECT id, seguidores FROM pages WHERE ig_user_id IS NULL').all<{ id: string; seguidores: number }>()
  ).results;
  for (const g of pages) {
    const r = rng(fnv1a(g.id + today));
    const seg = Math.round(g.seguidores * (1 + 0.0002 + r() * 0.0006));
    await env.DB.prepare('UPDATE pages SET seguidores = ? WHERE id = ?').bind(seg, g.id).run();
    await env.DB.prepare(
      'INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES (?, ?, ?) ON CONFLICT(page_id, day) DO UPDATE SET seguidores = excluded.seguidores',
    )
      .bind(g.id, today, seg)
      .run();
  }

  return touched;
}
