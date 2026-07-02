#!/usr/bin/env node
// Gera migrations/seed-demo.sql — dados de demonstração determinísticos,
// porte fiel do gerador do protótipo (Placar Painel MIRA.dc.html).
// Uso: npm run gen:seed   (re-gera ancorado na data corrente)

const NOW = anchorNow();
const DAY = 864e5;

function anchorNow() {
  // Âncora: hoje às 14:00 locais — igual ao protótipo (NOW fixo de referência).
  const d = new Date();
  d.setHours(14, 0, 0, 0);
  return d.getTime();
}

// RNG determinístico (mulberry32-like, mesmo do protótipo, seed 77)
function rng(s) {
  let t = s >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
const r = rng(77);

const pages = [
  { id: 'pg1', handle: '@mira.noticias', nome: 'MIRA Notícias', color: '#151210', fg: '#FBF4E9', seg: 1840000, vert: 'noticias' },
  { id: 'pg2', handle: '@mira.pop', nome: 'MIRA Pop', color: '#FF2E7E', fg: '#FFFFFF', seg: 1120000, vert: 'pop' },
  { id: 'pg3', handle: '@mira.esportes', nome: 'MIRA Esportes', color: '#CBFB45', fg: '#151210', seg: 894000, vert: 'esportes' },
  { id: 'pg4', handle: '@mira.memes', nome: 'MIRA Memes', color: '#FF6B2C', fg: '#FFFFFF', seg: 2310000, vert: 'memes' },
  { id: 'pg5', handle: '@mira.grana', nome: 'MIRA Grana', color: '#7A4DFF', fg: '#FFFFFF', seg: 412000, vert: 'grana' },
];

const users = [
  { id: 'u1', nome: 'Ana Beatriz Souza', cargo: 'designer sr', email: 'ana@mira.co', pages: ['pg2', 'pg4'], skill: 1.3, vol: 26, cor: '#FFC9DF' },
  { id: 'u2', nome: 'Caio Duarte', cargo: 'editor de vídeo', email: 'caio@mira.co', pages: ['pg3', 'pg1'], skill: 1.02, vol: 19, cor: '#ECFFB8' },
  { id: 'u3', nome: 'Duda Ferraz', cargo: 'social designer', email: 'duda@mira.co', pages: ['pg4', 'pg2'], skill: 1.45, vol: 23, cor: '#D9CCFF' },
  { id: 'u4', nome: 'Felipe Rocha', cargo: 'redator', email: 'felipe@mira.co', pages: ['pg1', 'pg5'], skill: 0.88, vol: 15, cor: '#FFD7C2' },
  { id: 'u5', nome: 'Iara Mendes', cargo: 'designer', email: 'iara@mira.co', pages: ['pg5', 'pg2'], skill: 1.1, vol: 21, cor: '#FFE6EF' },
  { id: 'u6', nome: 'Léo Martins', cargo: 'editor', email: 'leo@mira.co', pages: ['pg3', 'pg4'], skill: 0.76, vol: 13, cor: '#F4E9D6' },
  { id: 'u7', nome: 'Sofia Prado', cargo: 'motion designer', email: 'sofia@mira.co', pages: ['pg2', 'pg1'], skill: 1.18, vol: 20, cor: '#D2F4E2' },
];
const admin = { id: 'u0', nome: 'Marcos Vila', cargo: 'gestor', email: 'marcos@mira.co', cor: '#CBFB45' };

const caps = {
  noticias: ['Urgente: nova linha de metrô aprovada em SP', 'Eleições 2026: o que muda no seu voto', 'Alerta de chuva forte no Sudeste', 'Congresso vota marco da IA nesta semana', 'Dólar fecha em queda pela 3ª semana', 'Censo 2026: Brasil passa de 215 mi', 'Vacina da dengue chega ao SUS', 'Rodízio de água: veja seu bairro', 'Enem 2026: inscrições abertas', 'Reforma tributária: guia rápido'],
  pop: ['O retorno da banda que marcou os anos 2000', 'Festival de inverno anuncia line-up', 'Novela das 9: teoria dos fãs viraliza', 'Bastidores do clipe mais caro do ano', 'Quiz: qual diva você seria?', 'Red carpet: os looks que quebraram a internet', 'Turnê mundial 2027 confirmada', 'Reality: o resumo da semana em 10 memes', 'O documentário que todo mundo comenta', 'Top 10 hits do momento'],
  esportes: ['Rodada do Brasileirão: o que esperar', 'Craque da base assina com clube europeu', 'Copa América: convocação completa', 'Recorde histórico na São Silvestre', 'Análise tática: o novo 4-3-3', 'Mercado da bola: 5 rumores quentes', 'Vôlei: Brasil garante vaga na final', 'F1 em Interlagos: guia do GP', 'Skate BR domina o pódio', 'Basquete: NBB define os playoffs'],
  memes: ['POV: segunda-feira chegou de novo', 'Ninguém: … eu às 3h da manhã:', 'Quando o café acaba no escritório', 'Eu fingindo que li o contrato', 'Modo férias ativado (mentira)', 'A planilha me olhando às 17h58', 'Tradutor de reunião corporativa', 'Meu bolso depois do delivery', 'Expectativa vs realidade: academia', 'O grupo da família às 6h'],
  grana: ['Selic caiu: e agora, renda fixa?', '5 gastos invisíveis que drenam seu salário', 'CDB ou Tesouro? guia sem economês', '13º antecipado: vale a pena?', 'Como sair do rotativo em 90 dias', 'Pix parcelado: entenda a taxa', 'Aposentadoria aos 40: utopia?', 'Fundos imobiliários pra iniciantes', 'Tarifas de banco: o comparativo', 'Meta de reserva: 6 meses de custo'],
};

const fmtByCargo = (c) =>
  c.includes('vídeo') || c.includes('motion')
    ? ['reels', 'reels', 'reels', 'feed', 'carrossel', 'story', 'story']
    : c === 'redator'
      ? ['carrossel', 'carrossel', 'carrossel', 'feed', 'feed', 'reels', 'story']
      : ['feed', 'feed', 'carrossel', 'carrossel', 'carrossel', 'reels', 'story'];
const fmtMult = { feed: 1, carrossel: 1.15, reels: 2.0, story: 0.42 };
const cityBase = [['São Paulo', 31], ['Rio de Janeiro', 18], ['Belo Horizonte', 9], ['Curitiba', 7], ['Porto Alegre', 6], ['Recife', 6], ['Fortaleza', 6], ['Salvador', 6], ['Brasília', 5], ['Goiânia', 3]];
const lightBgs = ['#CBFB45', '#FBF4E9', '#F4E9D6', '#FFC9DF', '#ECFFB8'];

const posts = [];
let n = 0;
const day0 = new Date(NOW); day0.setHours(0, 0, 0, 0);
const D0 = day0.getTime();

for (const u of users) {
  const fmts = fmtByCargo(u.cargo);
  for (let i = 0; i < u.vol; i++) {
    const day = Math.floor(r() * 60);
    const hour = 8 + Math.floor(r() * 14);
    const ts = D0 - day * DAY + hour * 36e5 + Math.floor(r() * 50) * 6e4;
    if (ts > NOW) continue;
    const pid = u.pages[r() < 0.7 ? 0 : 1];
    const pg = pages.find((p) => p.id === pid);
    const fmt = fmts[Math.floor(r() * fmts.length)];
    let re = pg.seg * fmtMult[fmt] * u.skill * (0.05 + Math.pow(r(), 2.2) * 0.5);
    if (fmt === 'reels' && r() < 0.12) re *= 2 + r() * 3;
    re = Math.round(re);
    const li = Math.round(re * (0.04 + r() * 0.05) * Math.sqrt(u.skill));
    const co = Math.round(li * (0.05 + r() * 0.07));
    const sh = Math.round(li * (pg.vert === 'memes' ? 0.22 : 0.09) * (fmt === 'reels' ? 1.5 : 1) * (0.6 + r() * 0.8));
    const sa = Math.round(li * (pg.vert === 'grana' ? 0.55 : fmt === 'carrossel' ? 0.4 : 0.16) * (0.6 + r() * 0.8));
    const cl = Math.round(re * (0.005 + r() * 0.02) * (pg.vert === 'grana' || pg.vert === 'noticias' ? 1.6 : 1));
    const nf = Math.round(re * (0.0008 + r() * 0.0035));
    const capArr = caps[pg.vert];
    const cap = capArr[Math.floor(r() * capArr.length)];
    const tb = r() < 0.5 ? pg.color : r() < 0.5 ? '#151210' : ['#FF2E7E', '#CBFB45', '#7A4DFF', '#FF6B2C', '#FBF4E9'][Math.floor(r() * 5)];
    const cts = cityBase.map((c) => [c[0], c[1] * (0.5 + r())]).sort((a, b) => b[1] - a[1]).slice(0, 4);
    const tot = cts.reduce((s, c) => s + c[1], 0);
    // curva 48h (sigmoide) — mesmo formato do protótipo
    const rr = rng(Math.floor(r() * 1e6) + 11);
    const mu = 8 + rr() * 16, sg = 4 + rr() * 6;
    const curve = Array.from({ length: 15 }, (_, i) => {
      const h = (i / 14) * 48;
      return +(1 / (1 + Math.exp(-(h - mu) / sg))).toFixed(4);
    });
    posts.push({
      id: 'p' + n++, cap, page: pg.id, author: u.id, fmt, ts,
      status: NOW - ts < 48 * 36e5 ? 'analisando' : 'publicado',
      tb, tf: lightBgs.includes(tb) ? '#151210' : '#FBF4E9',
      m: { re, im: Math.round(re * (1.05 + r() * 0.35)), li, co, sh, sa, cl, nf },
      cities: cts.map((c) => ({ n: c[0], p: Math.round((c[1] / tot) * 100) })),
      curve,
    });
  }
}

// agendados (futuro próximo)
const slots = [9, 11, 14, 18, 20];
for (let i = 0; i < 17; i++) {
  const u = users[i % 7];
  const pg = pages.find((p) => p.id === u.pages[i % 2]);
  const day = Math.floor(r() * 12);
  let hour = slots[Math.floor(r() * 5)];
  if (day === 0 && hour < 15) hour = 18;
  const ts = D0 + day * DAY + hour * 36e5;
  const capArr = caps[pg.vert];
  posts.push({
    id: 'p' + n++, cap: capArr[Math.floor(r() * capArr.length)], page: pg.id, author: u.id,
    fmt: ['feed', 'carrossel', 'reels'][Math.floor(r() * 3)], ts, status: 'agendado',
    tb: pg.color, tf: pg.fg, m: null, cities: null, curve: null,
  });
}

// rascunhos
for (let i = 0; i < 6; i++) {
  const u = users[(i * 2 + 1) % 7];
  const pg = pages.find((p) => p.id === u.pages[0]);
  posts.push({
    id: 'p' + n++, cap: caps[pg.vert][(i * 3) % 10], page: pg.id, author: u.id, fmt: 'feed',
    ts: NOW - (1 + Math.floor(r() * 9)) * DAY, status: 'rascunho',
    tb: '#F4E9D6', tf: '#151210', m: null, cities: null, curve: null,
  });
}

// mediana de engajamento por página + IDP por post (mesma fórmula do painel)
for (const pg of pages) {
  const ers = posts
    .filter((p) => p.page === pg.id && p.m)
    .map((p) => (p.m.li + p.m.co + p.m.sh + p.m.sa) / p.m.re)
    .sort((a, b) => a - b);
  pg.medEng = ers.length ? ers[Math.floor(ers.length / 2)] : 0.06;
}
for (const p of posts) {
  if (!p.m) continue;
  const pg = pages.find((g) => g.id === p.page);
  p.er = (p.m.li + p.m.co + p.m.sh + p.m.sa) / p.m.re;
  p.idp = Math.max(24, Math.min(320, Math.round((p.er / pg.medEng) * 100)));
}

// histórico diário de seguidores (últimos 60 dias, crescimento suave)
const daily = [];
for (const pg of pages) {
  let seg = pg.seg;
  const rows = [];
  for (let d = 0; d < 60; d++) {
    const day = new Date(D0 - d * DAY);
    const key = day.toISOString().slice(0, 10);
    rows.push([key, Math.round(seg)]);
    seg *= 1 - (0.0006 + r() * 0.0008); // andando pra trás: menos seguidores no passado
  }
  for (const [key, s] of rows) daily.push({ page: pg.id, day: key, seguidores: s });
}

// ---------- SQL ----------
const q = (s) => (s == null ? 'NULL' : `'${String(s).replace(/'/g, "''")}'`);
const out = [];
out.push('-- seed de demonstração (gerado por scripts/gen-seed.mjs — não editar na mão)');
out.push('-- Remove antes de conectar páginas reais: POST /api/admin/wipe-demo');
out.push('DELETE FROM post_metrics; DELETE FROM posts; DELETE FROM page_members;');
out.push('DELETE FROM page_metrics_daily; DELETE FROM pages; DELETE FROM users WHERE id LIKE \'u%\';');

out.push(`INSERT INTO users (id, email, nome, cargo, role, cor, status, last_seen_at) VALUES
  (${q(admin.id)}, ${q(admin.email)}, ${q(admin.nome)}, 'gestor', 'gestor', ${q(admin.cor)}, 'ativo', ${NOW});`);
for (const u of users) {
  const seen = NOW - Math.floor(r() * 6) * 36e5;
  out.push(`INSERT INTO users (id, email, nome, cargo, role, cor, status, last_seen_at) VALUES
  (${q(u.id)}, ${q(u.email)}, ${q(u.nome)}, ${q(u.cargo)}, 'equipe', ${q(u.cor)}, 'ativo', ${seen});`);
}
for (const pg of pages) {
  out.push(`INSERT INTO pages (id, handle, nome, color, fg, vert, seguidores, med_eng) VALUES
  (${q(pg.id)}, ${q(pg.handle)}, ${q(pg.nome)}, ${q(pg.color)}, ${q(pg.fg)}, ${q(pg.vert)}, ${pg.seg}, ${pg.medEng});`);
}
for (const u of users) for (const pid of u.pages) out.push(`INSERT INTO page_members (page_id, user_id) VALUES (${q(pid)}, ${q(u.id)});`);

for (const p of posts) {
  out.push(`INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  (${q(p.id)}, ${q(p.page)}, ${q(p.author)}, ${q(p.cap)}, ${q(p.fmt)}, ${q(p.status)}, ${p.ts}, ${q(p.tb)}, ${q(p.tf)}, ${q(p.cap + ' — link na bio. #redemira')}, ${p.er ?? 'NULL'}, ${p.idp ?? 'NULL'}, ${p.ts}, ${p.ts});`);
  if (p.m) {
    out.push(`INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  (${q(p.id)}, ${p.m.re}, ${p.m.im}, ${p.m.li}, ${p.m.co}, ${p.m.sh}, ${p.m.sa}, ${p.m.cl}, ${p.m.nf}, ${q(JSON.stringify(p.cities))}, ${q(JSON.stringify(p.curve))}, ${NOW});`);
  }
}
for (const d of daily) {
  out.push(`INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES (${q(d.page)}, ${q(d.day)}, ${d.seguidores});`);
}

process.stdout.write(out.join('\n') + '\n');
