// tela equipe — placar da equipe (ranking por IDP), gestor.
import { h, api, go, page, user, K, ini, tierOf, tierCss, segsOf, weekLabel, pageHeader, emptyBox, cardCss, monoLabel, ACC, ACC_FG, state } from '../core.js';
import { section } from '../shell.js';

const GRID = '36px 30px minmax(170px,1.2fr) 34px 56px 76px minmax(100px,1fr) 46px 48px 112px 18px';

export async function equipeScreen(params, query) {
  let data;
  try {
    data = await api.get('/api/team');
  } catch (e) {
    return section('Equipe',
      pageHeader('★ equipe — ' + weekLabel(), 'placar da equipe', 'ranking por qualidade (IDP), não por volume. clique num nome pra abrir o perfil.'),
      h('div', { style: cardCss }, emptyBox('não deu pra carregar a equipe', e.message)),
    );
  }

  const rows = data.rows || [];
  const target = data.metaSemanal || state.metaSemanal || 6;

  const medalBg = [ACC, '#7A4DFF', '#CBFB45'];
  const medalFg = [ACC_FG, '#FFFFFF', '#151210'];

  const header = pageHeader(
    '★ equipe — ' + weekLabel(),
    'placar da equipe',
    'ranking por qualidade (IDP), não por volume. clique num nome pra abrir o perfil.',
    h('span', { style: 'display:inline-flex;align-items:center;height:28px;padding:0 10px;background:var(--paper-0);border:2px solid var(--ink-900);border-radius:6px;font-family:var(--font-mono);font-size:11px;font-weight:700' }, 'meta semanal: ' + target + ' posts'),
  );

  const headRow = h('div', { style: 'display:grid;grid-template-columns:' + GRID + ';min-width:880px;gap:10px;align-items:center;padding:14px 16px 8px;font-family:var(--font-mono);font-size:9px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-300)' },
    h('span', null, 'pos'), h('span', null), h('span', null, 'colaborador'), h('span', null, 'tier'),
    h('span', { style: 'text-align:right' }, 'posts'), h('span', { style: 'text-align:right' }, 'alcance'),
    h('span', null, 'idp médio'), h('span', null), h('span', { style: 'text-align:right' }, 'Δ 15d'),
    h('span', null, 'meta semanal'), h('span', null),
  );

  const bodyRows = rows.map((r, i) => {
    const u = r.user || {};
    const s = r.stats || { posts30: 0, re: 0, idpAvg: 100, delta: 0, week: 0 };
    const full = user(u.id);
    const pgs = (full.pages || []).map((pid) => page(pid).handle.replace('@mira.', '')).join(' · ');
    const tier = tierOf(s.idpAvg);

    const posCss = {
      width: '36px', height: '28px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: '700',
      background: i < 3 ? medalBg[i] : 'transparent',
      color: i < 3 ? medalFg[i] : 'var(--ink-300)',
      border: i < 3 ? '2px solid var(--ink-900)' : '2px solid transparent',
      boxShadow: i < 3 ? '2px 2px 0 0 var(--ink-900)' : 'none',
      flex: 'none',
    };
    const iniCss = {
      width: '28px', height: '28px', borderRadius: '999px', border: '2px solid var(--ink-900)', background: u.cor,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '10px', flex: 'none',
    };
    const barCss = {
      display: 'block', width: Math.min(100, s.idpAvg / 130 * 100) + '%', height: '100%',
      background: i === 0 ? ACC : 'var(--ink-900)',
    };
    const deltaCss = {
      fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: '700', textAlign: 'right',
      color: s.delta >= 0 ? 'var(--green-500)' : 'var(--red-500)',
    };

    return h('div', {
      class: 'pl-hover-row',
      style: 'display:grid;grid-template-columns:' + GRID + ';min-width:880px;gap:10px;align-items:center;padding:10px 16px;border-top:2px solid var(--paper-200);cursor:pointer',
      onclick: () => go('/perfil/' + u.id),
    },
      h('span', { style: posCss }, String(i + 1).padStart(2, '0')),
      h('span', { style: iniCss }, ini(u.nome)),
      h('div', { style: 'display:flex;flex-direction:column;min-width:0' },
        h('span', { style: 'font-weight:700;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis' }, u.nome),
        h('span', { style: 'font-family:var(--font-mono);font-size:10px;color:var(--ink-500)' }, (u.cargo || '') + (pgs ? ' · ' + pgs : '')),
      ),
      h('span', { style: tierCss(tier, 28) }, tier),
      h('span', { style: 'font-family:var(--font-mono);font-size:12px;font-weight:700;text-align:right' }, String(s.posts30)),
      h('span', { style: 'font-family:var(--font-mono);font-size:12px;text-align:right' }, K(s.re)),
      h('div', { style: 'height:12px;background:var(--paper-100);border:2px solid var(--ink-900);border-radius:4px;overflow:hidden' },
        h('span', { style: barCss })),
      h('span', { style: 'font-family:var(--font-mono);font-size:13px;font-weight:700;text-align:right' }, String(s.idpAvg)),
      h('span', { style: deltaCss }, (s.delta >= 0 ? '+' : '') + s.delta),
      h('div', { style: 'display:flex;gap:3px;align-items:center' },
        segsOf(Math.min(s.week, target), target, 'var(--lime-500)'),
        h('span', { style: 'font-family:var(--font-mono);font-size:10px;color:var(--ink-500);padding-left:4px' }, s.week + '/' + target),
      ),
      h('span', { style: 'color:var(--ink-300);font-weight:700' }, '›'),
    );
  });

  const table = h('div', { style: cardCss + ';display:flex;flex-direction:column;overflow-x:auto' },
    headRow,
    rows.length ? bodyRows : emptyBox('ninguém no placar ainda', 'os colaboradores aparecem aqui assim que publicarem.'),
  );

  const explainers = h('div', { style: 'display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px' },
    h('div', { style: 'background:var(--paper-100);border:2px solid var(--ink-900);border-radius:16px;padding:18px;display:flex;flex-direction:column;gap:8px' },
      h('span', { style: monoLabel }, 'como o idp é calculado'),
      h('span', { style: 'font-size:13.5px;line-height:1.5;color:var(--ink-700)' },
        'IDP = taxa de engajamento do post ÷ mediana de 90 dias da ', h('b', null, 'própria página'),
        ' × 100. um post na @mira.grana (412 mil) compete de igual pra igual com um na @mira.memes (2,3 mi) — medimos o ofício, não o alcance herdado.'),
    ),
    h('div', { style: 'background:var(--paper-100);border:2px solid var(--ink-900);border-radius:16px;padding:18px;display:flex;flex-direction:column;gap:8px' },
      h('span', { style: monoLabel }, 'por que não rankear por volume?'),
      h('span', { style: 'font-size:13.5px;line-height:1.5;color:var(--ink-700)' },
        'volume vira meta — e meta vira spam. aqui o rank premia qualidade (IDP) e a ', h('b', null, 'meta semanal'),
        ' cuida da consistência, separadamente. os dois aparecem lado a lado, sem se misturar.'),
    ),
  );

  return section('Equipe', header, table, explainers);
}
