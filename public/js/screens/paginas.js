// tela páginas — as contas da rede: cartão por página + conexão via graph api (gestor).
import { h, api, state, user, isGestor, K, pc, ini, fmtL, toast, pageHeader, emptyBox, cardCss } from '../core.js';
import { section } from '../shell.js';

export async function paginasScreen(params, query) {
  if (query.conectadas) toast(query.conectadas + ' página(s) conectada(s) via graph api ✓');
  if (query.erro) toast('conexão falhou — tenta de novo (' + query.erro + ')');

  let data;
  try {
    data = await api.get('/api/pages');
  } catch (e) {
    return section('Páginas',
      pageHeader('★ páginas', 'as contas da rede', 'perfis conectados via graph api — métricas caem direto no D1.'),
      h('div', { style: cardCss }, emptyBox('não deu pra carregar as páginas', e.message)),
    );
  }
  const cards = data.cards || [];

  const header = pageHeader(
    '★ páginas',
    'as contas da rede',
    cards.length + ' perfis conectados via graph api — métricas caem direto no D1.',
  );

  const statCell = (label, val) => h('div', { style: 'display:flex;flex-direction:column;gap:1px' },
    h('span', { style: 'font-family:var(--font-mono);font-size:8.5px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-500)' }, label),
    h('span', { style: 'font-family:var(--font-display);font-weight:800;font-size:17px' }, val),
  );

  const cardEls = cards.map((pg) => {
    const s = pg.stats || { posts30: 0, re: 0, eng: 0, nf: 0, spark: [], topFmt: 'feed' };
    const parts = (pg.nome || '').split(' ');
    const letter = parts[1] ? parts[1][0].toLowerCase() : 'm';

    const tileCss = {
      width: '46px', height: '46px', borderRadius: '10px', border: '2px solid var(--ink-900)',
      background: pg.color, color: pg.fg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '20px', flex: 'none',
      boxShadow: '2px 2px 0 0 var(--ink-900)',
    };

    const sp = Array.isArray(s.spark) ? s.spark : [];
    const mx = Math.max(...sp, 1);
    const bars = sp.map((v, i) => {
      const last = i === sp.length - 1;
      return h('span', { style: {
        width: '7px', height: Math.max(3, (v / mx) * 32) + 'px',
        background: last ? pg.color : 'var(--ink-900)', opacity: last ? '1' : '0.2',
        borderRadius: '2px', flex: 'none', border: last ? '1px solid var(--ink-900)' : 'none', boxSizing: 'border-box',
      } });
    });

    const teamAv = (pg.team || []).map((uid) => {
      const u = user(uid);
      return h('span', { style: {
        width: '22px', height: '22px', borderRadius: '999px', border: '2px solid var(--ink-900)', background: u.cor,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '8px', flex: 'none',
      } }, ini(u.nome));
    });

    return h('div', { style: cardCss + ';padding:18px;display:flex;flex-direction:column;gap:12px' },
      h('div', { style: 'display:flex;align-items:center;gap:10px' },
        h('span', { style: tileCss }, letter),
        h('div', { style: 'display:flex;flex-direction:column;min-width:0' },
          h('span', { style: 'font-family:var(--font-mono);font-size:11px;font-weight:700' }, pg.handle),
          h('span', { style: 'font-size:12px;color:var(--ink-500);white-space:nowrap;overflow:hidden;text-overflow:ellipsis' }, pg.nome),
        ),
        h('div', { style: 'flex:1' }),
        h('span', { style: 'font-family:var(--font-mono);font-size:9px;font-weight:700;background:' + (pg.connected ? 'var(--lime-200)' : 'var(--paper-100)') + ';border:2px solid var(--ink-900);border-radius:5px;padding:2px 6px;white-space:nowrap' }, pg.connected ? 'conectada' : 'demo'),
        h('span', { style: 'font-family:var(--font-mono);font-size:9.5px;font-weight:700;background:var(--lime-200);border:2px solid var(--ink-900);border-radius:5px;padding:2px 6px;white-space:nowrap' }, '+' + K(s.nf) + ' · 30d'),
      ),
      h('div', { style: 'display:flex;align-items:flex-end;justify-content:space-between;gap:8px' },
        h('div', { style: 'display:flex;flex-direction:column' },
          h('span', { style: 'font-family:var(--font-display);font-weight:800;font-size:30px;letter-spacing:-0.02em;line-height:0.9' }, K(pg.seguidores)),
          h('span', { style: 'font-family:var(--font-mono);font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-500)' }, 'seguidores'),
        ),
        h('div', { style: 'display:flex;align-items:flex-end;gap:3px;height:34px' }, bars),
      ),
      h('div', { style: 'display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;border-top:2px solid var(--paper-200);padding-top:10px' },
        statCell('posts 30d', String(s.posts30)),
        statCell('alc./post', s.posts30 ? K(s.re / s.posts30) : '—'),
        statCell('eng. média', pc(s.eng)),
      ),
      h('div', { style: 'display:flex;align-items:center;gap:6px;border-top:2px solid var(--paper-200);padding-top:10px' },
        h('span', { style: 'font-family:var(--font-mono);font-size:9px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-500)' }, 'equipe'),
        teamAv,
        h('div', { style: 'flex:1' }),
        h('span', { style: 'font-family:var(--font-mono);font-size:9.5px;font-weight:700;background:var(--paper-100);border:2px solid var(--ink-900);border-radius:5px;padding:2px 6px' }, 'forte em ' + fmtL(s.topFmt).toLowerCase()),
      ),
    );
  });

  const connectCard = isGestor()
    ? h('div', {
        class: 'pl-hover-ink',
        style: 'border:2px dashed var(--ink-300);border-radius:16px;min-height:220px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;cursor:pointer;color:var(--ink-500)',
        onclick: () => {
          if (state.metaConfigured) location.href = '/api/meta/oauth/start';
          else toast('configura META_APP_ID / META_APP_SECRET nos secrets do worker primeiro');
        },
      },
        h('span', { style: 'font-family:var(--font-display);font-weight:800;font-size:34px;line-height:1' }, '+'),
        h('span', { style: 'font-family:var(--font-mono);font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase' }, 'conectar página'),
        h('span', { style: 'font-size:11.5px' }, 'oauth via instagram graph api'),
      )
    : null;

  const content = (cards.length || connectCard)
    ? h('div', { style: 'display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px' }, cardEls, connectCard)
    : h('div', { style: cardCss }, emptyBox('nenhuma página por aqui', 'as páginas conectadas aparecem neste painel.'));

  return section('Páginas', header, content);
}
