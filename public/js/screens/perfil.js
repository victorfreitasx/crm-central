// tela perfil — placar individual do colaborador (30 dias).
import { h, api, go, state, page, isGestor, K, pc, dt, ini, tierOf, tierCss, idpChip, fmtL, FMT_COLORS, segsOf, postCells, cardCss, emptyBox, ACC } from '../core.js';
import { section } from '../shell.js';

const GRID = '46px minmax(200px,1.9fr) 52px 62px 92px 74px 66px 58px 52px 18px';
const HERO_LBL = 'font-family:var(--font-mono);font-size:9px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--ink-300)';
const STAT_LBL = 'font-family:var(--font-mono);font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-500)';
const CARD_TITLE = 'font-family:var(--font-mono);font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase';

export async function perfilScreen(params, query) {
  let data;
  try {
    data = await api.get('/api/profile/' + params.uid);
  } catch (e) {
    return section('Perfil do colaborador',
      h('div', { style: cardCss }, emptyBox('não deu pra carregar o perfil', e.message)),
    );
  }

  const u = data.user || { id: params.uid, nome: '—', cargo: '', cor: '#F4E9D6', pages: [] };
  const s = data.stats || {
    posts30: 0, re: 0, inter: 0, cl: 0, ctr: 0, nf: 0, sa: 0,
    idpAvg: 100, delta: 0, spark: [], fmtMix: { feed: 0, carrossel: 0, reels: 0, story: 0 },
    week: 0, bestId: null, rank: 0,
  };
  const isMe = params.uid === state.me?.id;
  const target = data.metaSemanal || state.metaSemanal || 6;
  const teamCount = data.teamCount || state.users.length || 1;

  // ---------- voltar (gestor olhando perfil alheio) ----------
  const back = isGestor() && !isMe
    ? h('span', {
        style: 'font-family:var(--font-mono);font-size:11px;font-weight:700;color:var(--ink-500);cursor:pointer;text-decoration:underline;width:fit-content',
        onclick: () => go('/equipe'),
      }, '‹ voltar pra equipe')
    : null;

  // ---------- hero ----------
  const uIniCss = {
    width: '64px', height: '64px', borderRadius: '999px', border: '3px solid var(--paper-50)',
    background: u.cor, color: 'var(--ink-900)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '22px', flex: 'none',
    boxShadow: '3px 3px 0 0 ' + ACC,
  };
  const delta = s.delta || 0;
  const uDeltaCss = { fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: '700', color: delta >= 0 ? 'var(--lime-500)' : '#FF8A80' };
  const tier = tierOf(s.idpAvg);
  const sp = (s.spark && s.spark.length) ? s.spark : [0, 0, 0, 0, 0, 0, 0, 0];
  const sparkEls = sp.map((v, i) => h('span', {
    style: {
      width: '9px', height: Math.max(3, v * 32) + 'px',
      background: i === sp.length - 1 ? ACC : 'var(--paper-50)',
      opacity: i === sp.length - 1 ? '1' : '0.4',
      borderRadius: '2px', flex: 'none',
    },
  }));

  const hero = h('div', { style: 'background:var(--ink-900);color:var(--paper-50);border:2px solid var(--ink-900);border-radius:16px;box-shadow:5px 5px 0 0 ' + ACC + ';padding:22px;display:flex;align-items:center;gap:22px;flex-wrap:wrap' },
    h('div', { style: 'display:flex;align-items:center;gap:14px;min-width:240px' },
      h('span', { style: uIniCss }, ini(u.nome)),
      h('div', { style: 'display:flex;flex-direction:column;gap:5px' },
        h('span', { style: 'font-family:var(--font-mono);font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--ink-300)' },
          isMe ? '★ meu placar · 30 dias' : '★ perfil do colaborador · 30 dias'),
        h('span', { style: 'font-family:var(--font-display);font-weight:800;font-size:28px;letter-spacing:-0.02em;line-height:0.94' }, u.nome),
        h('div', { style: 'display:flex;gap:6px;flex-wrap:wrap;align-items:center' },
          h('span', { style: 'font-family:var(--font-mono);font-size:10px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:var(--lime-500)' }, u.cargo || ''),
          (u.pages || []).map((pid) =>
            h('span', { style: 'font-family:var(--font-mono);font-size:10px;border:1px solid var(--ink-700);border-radius:5px;padding:2px 6px;color:var(--paper-50)' }, page(pid).handle)),
        ),
      ),
    ),
    h('div', { style: 'flex:1' }),
    h('div', { style: 'display:flex;align-items:center;gap:26px;flex-wrap:wrap' },
      h('div', { style: 'display:flex;flex-direction:column;gap:2px' },
        h('span', { style: HERO_LBL }, 'idp médio · 30d'),
        h('div', { style: 'display:flex;align-items:baseline;gap:8px' },
          h('span', { style: 'font-family:var(--font-display);font-weight:800;font-size:54px;letter-spacing:-0.02em;line-height:0.9;color:' + ACC }, String(s.idpAvg)),
          h('span', { style: uDeltaCss }, (delta >= 0 ? '+' : '') + delta + ' vs 15d'),
        ),
      ),
      h('div', { style: 'display:flex;flex-direction:column;gap:4px;align-items:center' },
        h('span', { style: HERO_LBL }, 'tier'),
        h('span', { style: tierCss(tier, 44) }, tier),
      ),
      h('div', { style: 'display:flex;flex-direction:column;gap:4px' },
        h('span', { style: HERO_LBL }, 'rank'),
        h('span', { style: 'font-family:var(--font-display);font-weight:800;font-size:30px;line-height:1' }, '#' + (s.rank || '—') + '/' + teamCount),
      ),
      h('div', { style: 'display:flex;flex-direction:column;gap:6px;min-width:150px' },
        h('span', { style: HERO_LBL }, 'meta semanal · ' + s.week + '/' + target),
        h('div', { style: 'display:flex;gap:4px' },
          segsOf(Math.min(s.week, target), target, 'var(--lime-500)', 'var(--ink-700)')),
        h('span', { style: 'font-size:11px;color:var(--ink-300)' },
          s.week >= target ? 'meta batida — segura o ritmo' : (target - s.week) + ' posts pra fechar a semana'),
      ),
      h('div', { style: 'display:flex;flex-direction:column;gap:6px' },
        h('span', { style: HERO_LBL }, 'alcance · 8 semanas'),
        h('div', { style: 'display:flex;align-items:flex-end;gap:4px;height:34px' }, sparkEls),
      ),
    ),
  );

  // ---------- mini stats ----------
  const stat = (label, value) =>
    h('div', { style: 'background:var(--paper-0);border:2px solid var(--ink-900);border-radius:12px;box-shadow:2px 2px 0 0 var(--ink-900);padding:14px;display:flex;flex-direction:column;gap:4px' },
      h('span', { style: STAT_LBL }, label),
      h('span', { style: 'font-family:var(--font-display);font-weight:800;font-size:24px;letter-spacing:-0.02em' }, value),
    );
  const miniStats = h('div', { style: 'display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px' },
    stat('alcance', K(s.re)),
    stat('interações', K(s.inter)),
    stat('cliques', K(s.cl)),
    stat('ctr médio', pc(s.ctr)),
    stat('seguidores +', '+' + K(s.nf)),
    stat('salvos', K(s.sa)),
  );

  // ---------- formatos · 30d ----------
  const fmtMix = s.fmtMix || { feed: 0, carrossel: 0, reels: 0, story: 0 };
  const fKeys = Object.keys(fmtMix).sort((a, b) => fmtMix[b] - fmtMix[a]);
  const mxF = Math.max(...fKeys.map((k) => fmtMix[k]), 1);
  const fmtCard = h('div', { style: cardCss + ';padding:18px;display:flex;flex-direction:column' },
    h('span', { style: CARD_TITLE + ';padding-bottom:6px' }, 'formatos · 30d'),
    fKeys.map((k) =>
      h('div', { style: 'display:grid;grid-template-columns:60px 1fr 60px;gap:10px;align-items:center;padding:8px 0;border-top:2px solid var(--paper-200)' },
        h('span', { style: 'font-family:var(--font-mono);font-size:11px;font-weight:700' }, fmtL(k)),
        h('div', { style: 'height:12px;background:var(--paper-100);border:2px solid var(--ink-900);border-radius:4px;overflow:hidden' },
          h('span', { style: { display: 'block', width: Math.max(3, fmtMix[k] / mxF * 100) + '%', height: '100%', background: FMT_COLORS[k] } })),
        h('span', { style: 'font-family:var(--font-mono);font-size:11px;text-align:right' }, String(fmtMix[k])),
      )),
  );

  // ---------- páginas em que publica ----------
  const perPage = data.perPage || [];
  const pgsCard = h('div', { style: cardCss + ';padding:18px;display:flex;flex-direction:column' },
    h('span', { style: CARD_TITLE + ';padding-bottom:6px' }, 'páginas em que publica'),
    perPage.map((g) =>
      h('div', { style: 'display:grid;grid-template-columns:1fr 60px 70px;gap:10px;align-items:center;padding:9px 0;border-top:2px solid var(--paper-200)' },
        h('span', { style: 'font-family:var(--font-mono);font-size:11px;font-weight:700' }, page(g.page_id).handle),
        h('span', { style: 'font-family:var(--font-mono);font-size:11px;text-align:right;color:var(--ink-500)' }, g.posts + ' posts'),
        h('span', { style: 'font-family:var(--font-mono);font-size:11px;font-weight:700;text-align:right' }, K(g.re)),
      )),
  );

  // ---------- melhor post · 30d ----------
  const best = data.best || null;
  let bestCard = null;
  if (best) {
    const bm = best.m || { re: 0, li: 0 };
    const bestTileCss = {
      width: '56px', height: '56px', borderRadius: '8px', border: '2px solid var(--ink-900)',
      background: best.tile_bg, color: best.tile_fg, fontFamily: 'var(--font-display)', fontWeight: '800',
      fontSize: '8px', lineHeight: '1.08', padding: '4px', overflow: 'hidden', letterSpacing: '-0.01em', flex: 'none',
    };
    bestCard = h('div', {
      style: cardCss + ';padding:18px;display:flex;flex-direction:column;gap:10px;cursor:pointer',
      onclick: () => go('/post/' + best.id),
    },
      h('span', { style: CARD_TITLE }, '★ melhor post · 30d'),
      h('div', { style: 'display:flex;gap:12px;align-items:center' },
        h('div', { style: bestTileCss }, best.cap.length > 34 ? best.cap.slice(0, 34) + '…' : best.cap),
        h('div', { style: 'display:flex;flex-direction:column;gap:4px;min-width:0;flex:1' },
          h('span', { style: 'font-weight:700;font-size:14px;line-height:1.3' }, best.cap),
          h('span', { style: 'font-family:var(--font-mono);font-size:10px;color:var(--ink-500)' },
            page(best.page_id).handle + ' · ' + fmtL(best.fmt) + ' · ' + dt(best.ts)),
        ),
        best.idp ? h('span', { style: idpChip(best.idp) }, String(best.idp)) : null,
      ),
      h('span', { style: 'font-size:12px;color:var(--ink-500)' },
        'alcance ' + K(bm.re) + ' · ' + K(bm.li) + ' likes — toca pra ver o raio-x completo ›'),
    );
  }

  const cardsRow = h('div', { style: 'display:grid;grid-template-columns:repeat(auto-fit,minmax(270px,1fr));gap:14px;align-items:start' },
    fmtCard, pgsCard, bestCard);

  // ---------- tabela de posts ----------
  const posts = data.posts || [];
  const postsTotal = data.postsTotal ?? posts.length;
  const postRows = posts.map((p) => {
    const c = postCells(p);
    return h('div', {
      class: 'pl-hover-row',
      style: 'display:grid;grid-template-columns:' + GRID + ';min-width:790px;gap:10px;align-items:center;padding:8px 16px;border-top:2px solid var(--paper-200);cursor:pointer',
      onclick: () => go('/post/' + p.id),
    },
      c.tile,
      h('div', { style: 'display:flex;flex-direction:column;gap:2px;min-width:0' },
        h('span', { style: 'font-weight:700;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis' }, p.cap),
        h('span', { style: 'font-family:var(--font-mono);font-size:10px;color:var(--ink-500)' }, c.pg.handle),
      ),
      h('span', { style: 'font-family:var(--font-mono);font-size:10px;font-weight:700;color:var(--ink-500)' }, fmtL(p.fmt)),
      h('span', { style: 'font-family:var(--font-mono);font-size:11px' }, c.data),
      c.stEl,
      h('span', { style: 'font-family:var(--font-mono);font-size:12px;font-weight:700;text-align:right' }, c.re),
      h('span', { style: 'font-family:var(--font-mono);font-size:12px;text-align:right' }, c.li),
      h('span', { style: 'font-family:var(--font-mono);font-size:12px;text-align:right' }, c.ctr),
      c.idpEl,
      h('span', { style: 'color:var(--ink-300);font-weight:700' }, '›'),
    );
  });

  const postsTable = h('div', { style: cardCss + ';display:flex;flex-direction:column;overflow-x:auto' },
    h('div', { style: 'display:flex;align-items:center;justify-content:space-between;padding:16px 16px 10px' },
      h('span', { style: CARD_TITLE }, 'posts de ' + (u.nome || '?').split(' ')[0].toLowerCase() + ' · ' + postsTotal + ' no total'),
    ),
    posts.length ? postRows : emptyBox('nenhum post ainda', 'os posts aparecem aqui assim que saírem do estúdio.'),
  );

  return section('Perfil do colaborador', back, hero, miniStats, cardsRow, postsTable);
}
