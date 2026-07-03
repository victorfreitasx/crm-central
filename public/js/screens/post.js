// tela detalhe do post — raio-x de desempenho (tile, veredito idp, funil, curva 48h, cidades).
import { h, svgEl, api, go, state, page, user, isGestor, K, pc, dt, dth, agoShort, ini, fmtL, tierOf, tierCss, stChip, cardCss, emptyBox, btn, toast, ACC } from '../core.js';
import { section, openScheduleModal } from '../shell.js';

const CHIP = 'display:inline-flex;align-items:center;height:22px;padding:0 8px;border-radius:6px;border:2px solid var(--ink-900);font-family:var(--font-mono);font-size:10px;font-weight:700;background:var(--paper-100)';
const MINI_LBL = 'font-family:var(--font-mono);font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-500)';
const CARD_TITLE = 'font-family:var(--font-mono);font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase';

export async function postScreen(params, query) {
  let data;
  try {
    data = await api.get('/api/posts/' + params.id);
  } catch (e) {
    return section('Detalhe do post',
      h('div', { style: cardCss }, emptyBox('não deu pra carregar o post', e.message)),
    );
  }

  const p = data.post;
  if (!p) {
    return section('Detalhe do post',
      h('div', { style: cardCss }, emptyBox('post não encontrado', 'volta pra lista e tenta de novo.')),
    );
  }
  const medEng = data.medEng || 0;
  const pg = page(p.page_id);
  const au = user(p.author_id);
  const stc = stChip(p.status);

  // ---------- voltar ----------
  const back = h('span', {
    style: 'font-family:var(--font-mono);font-size:11px;font-weight:700;color:var(--ink-500);cursor:pointer;text-decoration:underline;width:fit-content',
    onclick: () => go('/posts'),
  }, '‹ voltar pra posts');

  // ---------- coluna esquerda: tile + ficha ----------
  const dTileCss = { aspectRatio: '1', background: p.tile_bg, color: p.tile_fg, border: '2px solid var(--ink-900)', borderRadius: '16px', boxShadow: '5px 5px 0 0 var(--ink-900)', padding: '26px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflow: 'hidden' };
  const dTileTxtCss = { fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '31px', letterSpacing: '-0.02em', lineHeight: '0.98', overflowWrap: 'break-word' };
  const tile = h('div', { style: dTileCss },
    h('span', { style: dTileTxtCss }, p.cap),
    h('span', { style: 'font-family:var(--font-mono);font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;opacity:0.85' }, pg.handle),
  );

  const dData = p.status === 'agendado' ? dth(p.ts) : dt(p.ts) + ' · ' + new Date(p.ts).getHours() + 'h';
  const dAuCss = { width: '26px', height: '26px', borderRadius: '999px', border: '2px solid var(--ink-900)', background: au.cor, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '10px', flex: 'none' };
  const canSeeAuthor = isGestor() || p.author_id === state.me?.id;
  const dSync = p.m
    ? 'métricas sincronizadas ' + agoShort(p.synced_at) + ' · graph api → workers → d1'
    : 'sem métricas ainda — post não publicado';

  const ficha = h('div', { style: 'background:var(--paper-0);border:2px solid var(--ink-900);border-radius:16px;box-shadow:3px 3px 0 0 var(--ink-900);padding:16px;display:flex;flex-direction:column;gap:12px' },
    h('span', { style: 'font-size:14.5px;font-weight:500;line-height:1.45' }, p.caption || p.cap),
    h('div', { style: 'display:flex;gap:6px;flex-wrap:wrap' },
      h('span', { style: CHIP }, pg.handle),
      h('span', { style: CHIP }, fmtL(p.fmt)),
      h('span', { style: stc.css }, stc.label),
      h('span', { style: CHIP }, dData),
    ),
    h('div', {
      style: 'display:flex;align-items:center;gap:8px;cursor:' + (canSeeAuthor ? 'pointer' : 'default') + ';padding-top:2px',
      onclick: () => { if (canSeeAuthor) go('/perfil/' + p.author_id); },
    },
      h('span', { style: dAuCss }, ini(au.nome)),
      h('span', { style: 'font-size:13px;font-weight:700;text-decoration:underline' }, au.nome),
      h('span', { style: 'font-family:var(--font-mono);font-size:10px;color:var(--ink-500)' }, '· criou este post'),
    ),
    h('span', { style: 'font-family:var(--font-mono);font-size:10px;color:var(--ink-300)' }, dSync),
  );

  // ---------- ações por status ----------
  const del = async (msg, okMsg) => {
    if (!confirm(msg)) return;
    try {
      await api.del('/api/posts/' + p.id);
      toast(okMsg);
      go('/posts');
    } catch (e) { toast(e.message); }
  };
  const redOpts = { h: 30, style: 'color:var(--red-500);', borderColor: 'var(--red-500)' };
  let actions = null;
  if (p.status === 'agendado') {
    actions = h('div', { style: 'display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap' },
      btn('reagendar', 'ghost', () => openScheduleModal(p, () => { toast('reagendado'); location.reload(); }), { h: 30 }),
      btn('cancelar e apagar', 'ghost', () => del('cancelar o agendamento e apagar este post?', 'post apagado'), redOpts),
    );
  } else if (p.status === 'rascunho') {
    actions = h('div', { style: 'display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap' },
      btn('apagar rascunho', 'ghost', () => del('apagar este rascunho? não dá pra desfazer.', 'rascunho apagado'), redOpts),
    );
  }

  // ---------- coluna direita ----------
  const right = [];
  if (actions) right.push(actions);

  if (p.m) {
    const m = p.m;
    const reBase = m.re || 1;
    const idp = p.idp || 0;
    const t = tierOf(idp);
    const band = idp >= 130 ? ['#151210', '#CBFB45', 'desempenho excepcional']
      : idp >= 108 ? ['#151210', '#FBF4E9', 'acima da mediana']
      : idp >= 92 ? ['#FBF4E9', '#151210', 'na mediana da página']
      : ['#FFD9D6', '#151210', 'abaixo da mediana'];
    const dVerdictCss = { background: band[0], color: band[1], border: '2px solid var(--ink-900)', borderRadius: '16px', boxShadow: '4px 4px 0 0 ' + (idp >= 108 ? ACC : 'var(--ink-900)'), padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' };

    right.push(h('div', { style: dVerdictCss },
      h('div', { style: 'display:flex;flex-direction:column;gap:2px' },
        h('span', { style: 'font-family:var(--font-mono);font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;opacity:0.7' }, 'índice de desempenho do post'),
        h('div', { style: 'display:flex;align-items:baseline;gap:10px' },
          h('span', { style: 'font-family:var(--font-display);font-weight:800;font-size:46px;letter-spacing:-0.02em;line-height:0.9' }, String(idp)),
          h('span', { style: 'font-family:var(--font-display);font-weight:800;font-size:19px' }, band[2]),
        ),
        h('span', { style: 'font-size:12px;opacity:0.75' }, 'engajamento de ' + pc(p.er) + ' vs mediana de ' + pc(medEng) + ' da ' + pg.handle),
      ),
      h('span', { style: tierCss(t, 46) }, t),
    ));

    // grade de métricas
    const mini = (label, value) =>
      h('div', { style: 'background:var(--paper-0);border:2px solid var(--ink-900);border-radius:12px;box-shadow:2px 2px 0 0 var(--ink-900);padding:13px;display:flex;flex-direction:column;gap:3px' },
        h('span', { style: MINI_LBL }, label),
        h('span', { style: 'font-family:var(--font-display);font-weight:800;font-size:23px' }, value),
      );
    right.push(h('div', { style: 'display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px' },
      mini('alcance', K(m.re)),
      mini('impressões', K(m.im)),
      mini('likes', K(m.li)),
      mini('comentários', K(m.co)),
      mini('compartilh.', K(m.sh)),
      mini('salvos', K(m.sa)),
      mini('cliques no link', K(m.cl)),
      mini('ctr', pc(m.cl / reBase)),
      mini('seguidores +', '+' + K(m.nf)),
    ));

    // funil
    const inter = (m.li || 0) + (m.co || 0) + (m.sh || 0) + (m.sa || 0);
    const fun = [
      ['alcance', m.re, 'var(--ink-900)'],
      ['interações', inter, '#7A4DFF'],
      ['cliques no link', m.cl, ACC],
      ['seguidores +', m.nf, 'var(--lime-600)'],
    ];
    right.push(h('div', { style: cardCss + ';padding:18px;display:flex;flex-direction:column;gap:2px' },
      h('span', { style: CARD_TITLE + ';padding-bottom:8px' }, 'funil do post — do alcance ao seguidor'),
      fun.map((f) =>
        h('div', { style: 'display:grid;grid-template-columns:130px 1fr 86px 52px;gap:10px;align-items:center;padding:7px 0;border-top:2px solid var(--paper-200)' },
          h('span', { style: 'font-family:var(--font-mono);font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em' }, f[0]),
          h('div', { style: 'height:16px;background:var(--paper-100);border:2px solid var(--ink-900);border-radius:4px;overflow:hidden' },
            h('span', { style: { display: 'block', width: Math.max(2.5, Math.pow(f[1] / reBase, 0.45) * 100) + '%', height: '100%', background: f[2] } })),
          h('span', { style: 'font-family:var(--font-mono);font-size:12px;font-weight:700;text-align:right' }, K(f[1])),
          h('span', { style: 'font-family:var(--font-mono);font-size:10px;color:var(--ink-500);text-align:right' }, pc(f[1] / reBase)),
        )),
    ));

    // curva 48h
    const curve = Array.isArray(p.curve) && p.curve.length ? p.curve : Array.from({ length: 15 }, () => 0);
    const den = Math.max(curve.length - 1, 1);
    const pts = curve.map((v, i) => [(i / den) * 300, 86 - (v || 0) * 78]);
    const ptsStr = pts.map((q) => q[0].toFixed(1) + ',' + q[1].toFixed(1)).join(' ');
    const areaD = 'M0,90 L' + pts.map((q) => q[0].toFixed(1) + ',' + q[1].toFixed(1)).join(' L') + ' L300,90 Z';
    const curveCard = h('div', { style: cardCss + ';padding:18px;display:flex;flex-direction:column;gap:8px' },
      h('span', { style: CARD_TITLE }, 'alcance acumulado · primeiras 48h'),
      svgEl('svg', { viewBox: '0 0 300 90', preserveAspectRatio: 'none', style: 'width:100%;height:110px;display:block' },
        svgEl('path', { d: areaD, fill: 'var(--lime-200)', stroke: 'none' }),
        svgEl('polyline', { points: ptsStr, fill: 'none', stroke: '#151210', 'stroke-width': '2.5' }),
      ),
      h('div', { style: 'display:flex;justify-content:space-between;font-family:var(--font-mono);font-size:9px;color:var(--ink-300)' },
        h('span', null, '0h'), h('span', null, '12h'), h('span', null, '24h'), h('span', null, '36h'), h('span', null, '48h'),
      ),
    );

    // cidades
    const cities = Array.isArray(p.cities) ? p.cities : [];
    const mxC = Math.max(...cities.map((c) => c.p), 1);
    const cityBg = pg.color === '#CBFB45' ? 'var(--lime-600)' : pg.color;
    const citiesCard = h('div', { style: cardCss + ';padding:18px;display:flex;flex-direction:column' },
      h('span', { style: CARD_TITLE + ';padding-bottom:6px' }, 'alcance por cidade'),
      cities.length
        ? cities.map((c) =>
            h('div', { style: 'display:grid;grid-template-columns:110px 1fr 42px;gap:10px;align-items:center;padding:8px 0;border-top:2px solid var(--paper-200)' },
              h('span', { style: 'font-size:12px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis' }, c.n),
              h('div', { style: 'height:12px;background:var(--paper-100);border:2px solid var(--ink-900);border-radius:4px;overflow:hidden' },
                h('span', { style: { display: 'block', width: Math.max(4, (c.p / mxC) * 100) + '%', height: '100%', background: cityBg } })),
              h('span', { style: 'font-family:var(--font-mono);font-size:11px;font-weight:700;text-align:right' }, c.p + '%'),
            ))
        : h('span', { style: 'font-family:var(--font-mono);font-size:10px;color:var(--ink-300);padding:8px 0;border-top:2px solid var(--paper-200)' }, 'sem dados de cidade ainda'),
    );

    right.push(h('div', { style: 'display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px;align-items:start' }, curveCard, citiesCard));
  } else {
    // sem métricas — cartão tracejado por status
    let title, txt, action = null;
    if (p.status === 'agendado') {
      title = 'agendado — vai ao ar ' + dth(p.ts);
      txt = 'as métricas começam a ser coletadas assim que o post for publicado. a primeira sincronização acontece em até 30 minutos após a publicação.';
    } else if (p.status === 'analisando') {
      title = 'no ar — sincronizando métricas';
      txt = 'o post já está publicado no instagram. o worker de sync busca as primeiras métricas na graph api em até 30 minutos.';
    } else if (p.status === 'erro') {
      title = 'falha ao publicar';
      txt = p.publish_error || 'erro desconhecido ao publicar.';
      let retrying = false;
      action = btn('tentar de novo', 'ink', async (ev) => {
        if (retrying) return; // sem double-publish
        retrying = true;
        if (ev && ev.target) ev.target.style.opacity = '0.5';
        try {
          await api.post('/api/posts/' + p.id + '/schedule', { ts: Date.now(), now: true });
          toast('tentando publicar de novo');
          location.reload();
        } catch (e) {
          retrying = false;
          if (ev && ev.target) ev.target.style.opacity = '1';
          toast(e.message);
        }
      });
    } else {
      title = 'rascunho em andamento';
      txt = 'esse post ainda não saiu do estúdio. abre lá pra finalizar a arte, escrever a legenda e agendar.';
      action = btn('abrir no estúdio', 'ink', () => {
        state.studio = {
          postId: p.id,
          page: p.page_id,
          title: p.title,
          text: p.text,
          cOn: !!p.comment_on,
          cPage: p.comment_page_id || state.pages[1]?.id || state.pages[0]?.id,
          cText: p.comment_text,
          tipo: p.fmt === 'carrossel' ? 'carrossel' : 'unico',
          slides: (p.slides || []).length ? p.slides : [{ frame: '1', media: [] }],
          active: 0,
          caption: p.caption,
        };
        go('/studio');
      });
    }
    right.push(h('div', { style: 'background:var(--paper-100);border:2px dashed var(--ink-300);border-radius:16px;padding:32px;display:flex;flex-direction:column;gap:10px;align-items:flex-start' },
      h('span', { style: 'font-family:var(--font-display);font-weight:800;font-size:24px;letter-spacing:-0.02em' }, title),
      h('span', { style: 'font-size:14px;color:var(--ink-700);line-height:1.5;max-width:480px' }, txt),
      action,
    ));
  }

  return section('Detalhe do post',
    back,
    h('div', { style: 'display:grid;grid-template-columns:minmax(300px,390px) minmax(0,1fr);gap:16px;align-items:start' },
      h('div', { style: 'display:flex;flex-direction:column;gap:14px' }, tile, ficha),
      h('div', { style: 'display:flex;flex-direction:column;gap:14px;min-width:0' }, right),
    ),
  );
}
