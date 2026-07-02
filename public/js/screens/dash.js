// visão geral (gestor) — produção e desempenho social da equipe, num placar só.
// porte fiel da tela "Visão geral" do protótipo Placar Painel MIRA.
import {
  h, api, go, page, user,
  K, pc, fn, ini, tierOf, tierCss, fmtL, FMT_COLORS,
  sparkBars, postCells, cardCss, pageHeader, emptyBox,
  ACC, DIAS, SLOTS,
} from '../core.js';
import { section } from '../shell.js';

export async function dashScreen(params, query) {
  let d;
  try {
    d = await api.get('/api/dashboard');
  } catch (e) {
    return section('Visão geral',
      pageHeader('★ visão geral', 'central de conteúdo', 'produção e desempenho social da equipe, num placar só.'),
      h('div', { style: cardCss }, emptyBox('não deu pra carregar o placar', e.message)),
    );
  }

  const G = d.G || {};
  const U = d.U || {};
  const order = d.order || [];
  const radarD = d.radar || { agendados: 0, rascunhos: 0, analise: 0 };
  const viral = d.viral || [];
  const pagePerfD = d.pagePerf || [];
  const recent = d.recent || [];

  const bw = (DIAS[G.bestDay] || '—') + ' · ' + (SLOTS[G.bestSlot] || '—');

  // ---------- cabeçalho ----------
  const headRight = h('div', { style: 'display:flex;gap:8px;align-items:center;flex-wrap:wrap' },
    h('span', { style: 'display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 10px;background:var(--lime-500);border:2px solid var(--ink-900);border-radius:6px;font-family:var(--font-mono);font-size:11px;font-weight:700;letter-spacing:0.04em;box-shadow:2px 2px 0 0 var(--ink-900)' }, 'melhor janela: ' + bw),
    h('span', { style: 'display:inline-flex;align-items:center;height:28px;padding:0 10px;background:var(--paper-0);border:2px solid var(--ink-900);border-radius:6px;font-family:var(--font-mono);font-size:11px;font-weight:700' }, (d.postsTotais ?? 0) + ' posts no ar'),
  );

  // ---------- kpis ----------
  const kpis = [
    { label: 'posts · 30d', val: String(G.posts30 ?? 0), sub: '+' + (G.week ?? 0) + ' nesta semana', spark: G.sPosts || [] },
    { label: 'alcance · 30d', val: K(G.re), sub: 'contas alcançadas', spark: G.sRe || [] },
    { label: 'interações · 30d', val: K(G.inter), sub: 'likes + coment. + comp. + salvos', spark: G.sInter || [] },
    { label: 'ctr médio', val: pc(G.ctr), sub: 'cliques no link ÷ alcance', spark: G.sCtr || [] },
    { label: 'seguidores +', val: '+' + K(G.nf), sub: 'atribuídos aos posts · 30d', spark: G.sNf || [] },
  ];
  const kpiGrid = h('div', { style: 'display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:14px' },
    kpis.map((k) => h('div', { style: cardCss + ';padding:16px;display:flex;flex-direction:column;gap:7px;min-width:0' },
      h('span', { style: 'font-family:var(--font-mono);font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-500)' }, k.label),
      h('span', { style: 'font-family:var(--font-display);font-weight:800;font-size:33px;letter-spacing:-0.02em;line-height:0.9' }, k.val),
      h('div', { style: 'display:flex;align-items:flex-end;gap:3px;height:28px;overflow:hidden' }, sparkBars(k.spark)),
      h('span', { style: 'font-size:11px;color:var(--ink-500)' }, k.sub),
    )),
  );

  // ---------- placar da equipe — top 5 ----------
  const medalBg = [ACC, '#7A4DFF', '#CBFB45'];
  const medalFg = ['#FFFFFF', '#FFFFFF', '#151210'];
  const leaderRows = order.slice(0, 5).map((uid, i) => {
    const s = U[uid] || {};
    const u = user(uid);
    const idpAvg = s.idpAvg ?? 0;
    const delta = s.delta ?? 0;
    const t = tierOf(idpAvg);
    const posCss = {
      width: '32px', height: '26px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: '700',
      background: i < 3 ? medalBg[i] : 'transparent', color: i < 3 ? medalFg[i] : 'var(--ink-300)',
      border: i < 3 ? '2px solid var(--ink-900)' : '2px solid transparent', flex: 'none',
    };
    const iniCss = {
      width: '26px', height: '26px', borderRadius: '999px', border: '2px solid var(--ink-900)', background: u.cor,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '10px', flex: 'none',
    };
    return h('div', {
      style: 'display:grid;grid-template-columns:32px 26px 1fr 34px minmax(60px,1fr) 48px 48px;gap:10px;align-items:center;padding:9px 0;border-top:2px solid var(--paper-200);cursor:pointer',
      onclick: () => go('/perfil/' + uid),
    },
      h('span', { style: posCss }, String(i + 1).padStart(2, '0')),
      h('span', { style: iniCss }, ini(u.nome)),
      h('div', { style: 'display:flex;flex-direction:column;min-width:0' },
        h('span', { style: 'font-weight:700;font-size:13.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis' }, u.nome),
        h('span', { style: 'font-family:var(--font-mono);font-size:10px;color:var(--ink-500)' }, u.cargo),
      ),
      h('span', { style: tierCss(t, 26) }, t),
      h('div', { style: 'height:12px;background:var(--paper-100);border:2px solid var(--ink-900);border-radius:4px;overflow:hidden' },
        h('span', { style: { display: 'block', width: Math.min(100, idpAvg / 130 * 100) + '%', height: '100%', background: i === 0 ? ACC : 'var(--ink-900)' } }),
      ),
      h('span', { style: 'font-family:var(--font-mono);font-size:13px;font-weight:700;text-align:right' }, String(idpAvg)),
      h('span', { style: { fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: '700', textAlign: 'right', color: delta >= 0 ? 'var(--green-500)' : 'var(--red-500)' } }, (delta >= 0 ? '+' : '') + delta),
    );
  });
  const leaderCard = h('div', { style: cardCss + ';padding:18px;display:flex;flex-direction:column;gap:4px' },
    h('div', { style: 'display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;padding-bottom:8px' },
      h('span', { style: 'font-family:var(--font-mono);font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;white-space:nowrap' }, '★ placar da equipe — top 5'),
      h('span', { style: 'font-family:var(--font-mono);font-size:11px;font-weight:700;color:var(--ink-500);cursor:pointer;text-decoration:underline;white-space:nowrap', onclick: () => go('/equipe') }, 'ver equipe completa ›'),
    ),
    leaderRows.length ? leaderRows : emptyBox('sem placar ainda', 'os números da equipe aparecem depois da primeira sync.'),
    h('span', { style: 'font-size:11px;color:var(--ink-500);padding-top:8px' }, 'IDP = engajamento do post ÷ mediana da própria página × 100. páginas pequenas competem de igual pra igual.'),
  );

  // ---------- radar da semana ----------
  const radarItems = [
    { num: String(radarD.agendados ?? 0), txt: 'posts agendados nos próximos 7 dias', go: () => go('/agenda') },
    { num: String(radarD.rascunhos ?? 0), txt: 'rascunhos parados há mais de 4 dias', go: () => go('/posts?status=rascunho') },
    { num: String(radarD.analise ?? 0), txt: 'posts na janela de análise (48h)', go: () => go('/posts?status=analisando') },
    { num: '★', txt: 'melhor janela da semana: ' + bw, go: () => go('/agenda') },
  ];
  const radarCard = h('div', { style: cardCss + ';padding:18px;display:flex;flex-direction:column' },
    h('span', { style: 'font-family:var(--font-mono);font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;padding-bottom:6px' }, '★ radar da semana'),
    radarItems.map((it) => h('div', { style: 'display:flex;align-items:center;gap:10px;padding:9px 0;border-top:2px solid var(--paper-200);cursor:pointer', onclick: it.go },
      h('span', { style: 'min-width:30px;height:24px;display:inline-flex;align-items:center;justify-content:center;background:var(--ink-900);color:var(--paper-50);border-radius:6px;font-family:var(--font-mono);font-size:12px;font-weight:700;padding:0 6px' }, it.num),
      h('span', { style: 'font-size:13px;font-weight:500;flex:1' }, it.txt),
      h('span', { style: 'color:var(--ink-300);font-weight:700' }, '›'),
    )),
  );

  // ---------- em alta agora ----------
  const viralCard = viral.length
    ? h('div', { style: 'background:var(--ink-900);color:var(--paper-50);border:2px solid var(--ink-900);border-radius:16px;box-shadow:3px 3px 0 0 ' + ACC + ';padding:18px;display:flex;flex-direction:column' },
      h('span', { style: 'font-family:var(--font-mono);font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--lime-500);padding-bottom:6px' }, '★ em alta agora'),
      viral.map((p) => {
        const c = postCells(p);
        c.tile.style.width = '38px';
        c.tile.style.height = '38px';
        c.tile.style.border = '2px solid var(--paper-50)';
        return h('div', { style: 'display:flex;align-items:center;gap:10px;padding:8px 0;border-top:2px solid var(--ink-700);cursor:pointer', onclick: () => go('/post/' + p.id) },
          c.tile,
          h('div', { style: 'display:flex;flex-direction:column;gap:2px;min-width:0;flex:1' },
            h('span', { style: 'font-weight:700;font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis' }, p.cap),
            h('span', { style: 'font-family:var(--font-mono);font-size:10px;color:var(--ink-300)' }, c.pg.handle + ' · ' + fn(c.au.nome)),
          ),
          c.idpEl,
        );
      }),
    )
    : null;

  // ---------- alcance por página · 30d ----------
  const perf = pagePerfD.slice().sort((a, b) => (b.re || 0) - (a.re || 0));
  const mxRe = Math.max(...perf.map((x) => x.re || 0), 1);
  const pagePerfCard = h('div', { style: cardCss + ';padding:18px;display:flex;flex-direction:column' },
    h('span', { style: 'font-family:var(--font-mono);font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;padding-bottom:6px' }, 'alcance por página · 30d'),
    perf.length
      ? perf.map((pp) => {
        const pg = page(pp.page_id);
        return h('div', { style: 'display:grid;grid-template-columns:128px 1fr 76px;gap:10px;align-items:center;padding:8px 0;border-top:2px solid var(--paper-200)' },
          h('span', { style: 'font-family:var(--font-mono);font-size:11px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis' }, pg.handle),
          h('div', { style: 'height:14px;background:var(--paper-100);border:2px solid var(--ink-900);border-radius:4px;overflow:hidden' },
            h('span', { style: { display: 'block', width: Math.max(3, (pp.re || 0) / mxRe * 100) + '%', height: '100%', background: pg.color } }),
          ),
          h('span', { style: 'font-family:var(--font-mono);font-size:12px;font-weight:700;text-align:right' }, K(pp.re)),
        );
      })
      : emptyBox('sem alcance ainda', 'os números por página chegam com a sync de métricas.'),
  );

  // ---------- formatos · 30d ----------
  const fCount = G.fmtCount || {};
  const fRe = G.fmtRe || {};
  const fmtKeys = Object.keys(fCount).sort((a, b) => (fCount[b] || 0) - (fCount[a] || 0));
  const mxF = Math.max(...fmtKeys.map((k) => fCount[k] || 0), 1);
  const avgOf = (k) => (fCount[k] ? (fRe[k] || 0) / fCount[k] : 0);
  const bestFmt = fmtKeys.slice().sort((a, b) => avgOf(b) - avgOf(a))[0];
  const fmtCard = h('div', { style: cardCss + ';padding:18px;display:flex;flex-direction:column' },
    h('span', { style: 'font-family:var(--font-mono);font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;padding-bottom:6px' }, 'formatos · 30d'),
    fmtKeys.length
      ? fmtKeys.map((k) => h('div', { style: 'display:grid;grid-template-columns:64px 1fr 90px;gap:10px;align-items:center;padding:8px 0;border-top:2px solid var(--paper-200)' },
        h('span', { style: 'font-family:var(--font-mono);font-size:11px;font-weight:700' }, fmtL(k)),
        h('div', { style: 'height:14px;background:var(--paper-100);border:2px solid var(--ink-900);border-radius:4px;overflow:hidden' },
          h('span', { style: { display: 'block', width: Math.max(3, (fCount[k] || 0) / mxF * 100) + '%', height: '100%', background: FMT_COLORS[k] } }),
        ),
        h('span', { style: 'font-family:var(--font-mono);font-size:11px;text-align:right' }, (fCount[k] || 0) + ' posts'),
      ))
      : emptyBox('sem formatos ainda', 'publica os primeiros posts pra ver a mistura.'),
    bestFmt
      ? h('span', { style: 'font-size:12px;font-weight:500;padding-top:10px;color:var(--ink-700)' }, fmtL(bestFmt).toLowerCase() + ' lidera em alcance médio: ' + K(avgOf(bestFmt)) + ' por post.')
      : null,
  );

  // ---------- últimos posts ----------
  const GRID = '46px minmax(200px,1.7fr) 108px 52px 62px 92px 74px 66px 58px 52px 18px';
  const recentCard = h('div', { style: cardCss + ';display:flex;flex-direction:column;overflow-x:auto' },
    h('div', { style: 'display:flex;align-items:center;justify-content:space-between;padding:16px 16px 10px' },
      h('span', { style: 'font-family:var(--font-mono);font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase' }, 'últimos posts'),
      h('span', { style: 'font-family:var(--font-mono);font-size:11px;font-weight:700;color:var(--ink-500);cursor:pointer;text-decoration:underline', onclick: () => go('/posts') }, 'ver todos ›'),
    ),
    h('div', { style: 'display:grid;grid-template-columns:' + GRID + ';min-width:900px;gap:10px;align-items:center;padding:4px 16px 8px;font-family:var(--font-mono);font-size:9px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-300)' },
      h('span'), h('span', null, 'post'), h('span', null, 'autor'), h('span', null, 'fmt'), h('span', null, 'data'), h('span', null, 'status'),
      h('span', { style: 'text-align:right' }, 'alcance'), h('span', { style: 'text-align:right' }, 'likes'), h('span', { style: 'text-align:right' }, 'ctr'),
      h('span', null, 'idp'), h('span'),
    ),
    recent.length
      ? recent.slice(0, 8).map((p) => {
        const c = postCells(p);
        return h('div', {
          class: 'pl-hover-row',
          style: 'display:grid;grid-template-columns:' + GRID + ';min-width:900px;gap:10px;align-items:center;padding:8px 16px;border-top:2px solid var(--paper-200);cursor:pointer',
          onclick: () => go('/post/' + p.id),
        },
          c.tile,
          h('div', { style: 'display:flex;flex-direction:column;gap:2px;min-width:0' },
            h('span', { style: 'font-weight:700;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis' }, p.cap),
            h('span', { style: 'font-family:var(--font-mono);font-size:10px;color:var(--ink-500)' }, c.pg.handle),
          ),
          h('div', { style: 'display:flex;align-items:center;gap:6px;min-width:0' },
            c.auAv,
            h('span', { style: 'font-size:12px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis' }, fn(c.au.nome)),
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
      })
      : emptyBox('nenhum post no ar ainda', 'cria o primeiro no estúdio — ele aparece aqui.'),
  );

  // ---------- composição ----------
  return section('Visão geral',
    pageHeader('★ visão geral', 'central de conteúdo', 'produção e desempenho social da equipe, num placar só.', headRight),
    kpiGrid,
    h('div', { style: 'display:grid;grid-template-columns:repeat(auto-fit,minmax(330px,1fr));gap:14px;align-items:start' },
      leaderCard,
      h('div', { style: 'display:flex;flex-direction:column;gap:14px' }, radarCard, viralCard),
    ),
    h('div', { style: 'display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:14px;align-items:start' },
      pagePerfCard,
      fmtCard,
    ),
    recentCard,
  );
}
