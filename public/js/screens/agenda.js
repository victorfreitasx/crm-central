// tela agenda — calendário de publicação, fila e melhor janela pra postar.
import { h, api, go, page, user, ini, ago, ACC, DIAS, SLOTS, MESFULL, pageHeader, cardCss, monoLabel, spinner, emptyBox } from '../core.js';
import { section } from '../shell.js';

export async function agendaScreen(params, query) {
  const now = new Date();
  let y = now.getFullYear();
  let m = now.getMonth();

  const container = h('div', { style: 'display:flex;flex-direction:column;gap:18px' });

  const arrow = (t, onclick) => h('span', {
    class: 'pl-btn',
    style: 'width:34px;height:34px;display:inline-flex;align-items:center;justify-content:center;border:2px solid var(--ink-900);border-radius:8px;background:var(--paper-0);cursor:pointer;font-weight:800;box-shadow:2px 2px 0 0 var(--ink-900)',
    onclick,
  }, t);

  const header = () => pageHeader(
    '★ agenda',
    'calendário de publicação',
    'o que vai ao ar, quando, e a melhor janela pra postar.',
    h('div', { style: 'display:flex;gap:8px;align-items:center' },
      arrow('‹', () => { if (m === 0) { m = 11; y -= 1; } else m -= 1; load(); }),
      h('span', { style: 'font-family:var(--font-display);font-weight:800;font-size:19px;letter-spacing:-0.01em;min-width:150px;text-align:center' }, MESFULL[m] + ' ' + y),
      arrow('›', () => { if (m === 11) { m = 0; y += 1; } else m += 1; load(); }),
    ),
  );

  function calendar(month) {
    const first = new Date(y, m, 1);
    const offset = (first.getDay() + 6) % 7;
    const dim = new Date(y, m + 1, 0).getDate();
    const rows = Math.ceil((offset + dim) / 7);
    const today = new Date();
    const sameDay = (ts, d) => { const x = new Date(ts); return x.getFullYear() === y && x.getMonth() === m && x.getDate() === d; };

    const cells = Array.from({ length: rows * 7 }, (_, i) => {
      const dayN = i - offset + 1;
      const inM = dayN >= 1 && dayN <= dim;
      const isToday = inM && y === today.getFullYear() && m === today.getMonth() && dayN === today.getDate();
      const sched = inM ? month.filter((p) => p.status === 'agendado' && sameDay(p.ts, dayN)).sort((a, b) => a.ts - b.ts) : [];
      const pubN = inM ? month.filter((p) => p.m && sameDay(p.ts, dayN)).length : 0;

      const css = {
        minHeight: '86px', padding: '6px', borderTop: '2px solid var(--paper-200)',
        borderLeft: i % 7 === 0 ? 'none' : '2px solid var(--paper-200)',
        display: 'flex', flexDirection: 'column', gap: '3px',
        background: isToday ? 'var(--lime-200)' : (inM ? 'var(--paper-0)' : 'var(--paper-50)'),
        overflow: 'hidden',
      };
      const numCss = isToday
        ? { width: '20px', height: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ink-900)', color: 'var(--lime-500)', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: '700' }
        : { width: '20px', height: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-start', background: 'transparent', color: inM ? 'var(--ink-700)' : 'var(--ink-300)', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: '700' };

      const chips = sched.slice(0, 3).map((p) => {
        const pg = page(p.page_id);
        return h('span', {
          style: { display: 'block', background: pg.color, color: pg.fg, border: '1.5px solid var(--ink-900)', borderRadius: '4px', padding: '1.5px 4px', fontFamily: 'var(--font-mono)', fontSize: '8.5px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'pointer' },
          onclick: () => go('/post/' + p.id),
        }, new Date(p.ts).getHours() + 'h ' + pg.handle.replace('@mira.', ''));
      });

      return h('div', { style: css },
        h('span', { style: numCss }, inM ? String(dayN) : ''),
        chips,
        h('span', { style: 'font-family:var(--font-mono);font-size:8.5px;color:var(--ink-300)' }, pubN > 0 ? pubN + ' publicado' + (pubN > 1 ? 's' : '') : ''),
      );
    });

    return h('div', { style: cardCss + ';overflow:hidden' },
      h('div', { style: 'display:grid;grid-template-columns:repeat(7,1fr);border-bottom:2px solid var(--ink-900);background:var(--paper-100)' },
        DIAS.map((d) => h('span', { style: 'padding:8px;text-align:center;font-family:var(--font-mono);font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em' }, d)),
      ),
      h('div', { style: 'display:grid;grid-template-columns:repeat(7,1fr)' }, cells),
    );
  }

  function heatCard(heat, bestDay, bestSlot) {
    const rows = DIAS.map((d, i) => {
      const vals = (Array.isArray(heat) && Array.isArray(heat[i])) ? heat[i] : [0, 0, 0, 0, 0];
      return h('div', { style: 'display:flex;align-items:center;gap:5px' },
        h('span', { style: 'font-family:var(--font-mono);font-size:9px;font-weight:700;text-transform:uppercase;width:26px;color:var(--ink-500)' }, d),
        vals.map((v, j) => h('span', {
          style: {
            width: '34px', height: '20px', borderRadius: '4px', border: '2px solid var(--ink-900)',
            background: v > 0.78 ? 'var(--lime-600)' : v > 0.55 ? 'var(--lime-500)' : v > 0.3 ? 'var(--lime-200)' : 'var(--paper-100)',
            flex: 'none', boxSizing: 'border-box',
            outline: (i === bestDay && j === bestSlot) ? '2px solid ' + ACC : 'none',
            outlineOffset: '1px',
          },
        })),
      );
    });
    const hasBest = DIAS[bestDay] !== undefined && SLOTS[bestSlot] !== undefined;
    return h('div', { style: cardCss + ';padding:16px;display:flex;flex-direction:column;gap:8px' },
      h('span', { style: monoLabel }, 'melhor horário pra postar'),
      h('span', { style: 'font-size:11px;color:var(--ink-500)' }, 'engajamento médio por dia × faixa · 60 dias'),
      h('div', { style: 'display:flex;flex-direction:column;gap:4px;padding-top:4px' },
        rows,
        h('div', { style: 'display:flex;align-items:center;gap:5px;padding-top:2px' },
          h('span', { style: 'width:26px' }),
          ['8h', '11h', '14h', '17h', '20h'].map((t) => h('span', { style: 'width:34px;text-align:center;font-family:var(--font-mono);font-size:8px;color:var(--ink-300)' }, t)),
        ),
      ),
      hasBest ? h('span', { style: 'display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 10px;background:var(--lime-500);border:2px solid var(--ink-900);border-radius:6px;font-family:var(--font-mono);font-size:10.5px;font-weight:700;width:fit-content;box-shadow:2px 2px 0 0 var(--ink-900)' },
        'melhor janela: ' + DIAS[bestDay] + ' · ' + SLOTS[bestSlot]) : null,
    );
  }

  function filaCard(fila) {
    const rows = [...fila].sort((a, b) => a.ts - b.ts).map((p) => {
      const au = user(p.author_id);
      const d = new Date(p.ts);
      const wd = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'][d.getDay()];
      return h('div', {
        class: 'pl-hover-row',
        style: 'display:flex;align-items:center;gap:8px;padding:8px 0;border-top:2px solid var(--paper-200);cursor:pointer',
        onclick: () => go('/post/' + p.id),
      },
        h('span', { style: 'font-family:var(--font-mono);font-size:9.5px;font-weight:700;background:var(--violet-200);border:2px solid var(--ink-900);border-radius:5px;padding:2px 5px;white-space:nowrap;flex:none' },
          wd + ' ' + String(d.getDate()).padStart(2, '0') + ' · ' + d.getHours() + 'h'),
        h('span', { style: 'font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1' }, p.cap),
        h('span', { style: { width: '20px', height: '20px', borderRadius: '999px', border: '2px solid var(--ink-900)', background: au.cor, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '8px', flex: 'none' } }, ini(au.nome)),
      );
    });
    return h('div', { style: cardCss + ';padding:16px;display:flex;flex-direction:column' },
      h('span', { style: monoLabel + ';padding-bottom:4px' }, 'fila de publicação'),
      rows.length ? rows : h('span', { style: 'font-size:12px;color:var(--ink-500);padding:8px 0;border-top:2px solid var(--paper-200)' }, 'nada agendado por enquanto.'),
    );
  }

  function draftsCard(drafts) {
    const rows = [...drafts].sort((a, b) => a.ts - b.ts).map((p) => h('div', {
      class: 'pl-hover-row',
      style: 'display:flex;align-items:center;gap:8px;padding:7px 0;border-top:2px solid var(--paper-200);cursor:pointer',
      onclick: () => go('/post/' + p.id),
    },
      h('span', { style: 'font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1' }, p.cap),
      h('span', { style: 'font-family:var(--font-mono);font-size:9.5px;color:var(--ink-500);flex:none' }, ago(p.ts)),
      h('span', { style: 'color:var(--ink-300);font-weight:700' }, '›'),
    ));
    return h('div', { style: 'background:var(--paper-100);border:2px dashed var(--ink-300);border-radius:16px;padding:16px;display:flex;flex-direction:column' },
      h('span', { style: monoLabel + ';padding-bottom:4px;color:var(--ink-500)' }, 'rascunhos pendentes'),
      rows.length ? rows : h('span', { style: 'font-size:12px;color:var(--ink-500);padding:8px 0;border-top:2px solid var(--paper-200)' }, 'nenhum rascunho pendente.'),
    );
  }

  async function load() {
    container.replaceChildren(header(), spinner());
    let data;
    try {
      // manda os limites do mês em epoch ms no fuso local — evita posts sumirem
      // na fronteira do mês por diferença UTC×local no servidor.
      const start = new Date(y, m, 1).getTime();
      const end = new Date(y, m + 1, 1).getTime();
      data = await api.get('/api/agenda?y=' + y + '&m=' + m + '&start=' + start + '&end=' + end);
    } catch (e) {
      container.replaceChildren(header(), h('div', { style: cardCss }, emptyBox('não deu pra carregar a agenda', e.message)));
      return;
    }
    container.replaceChildren(
      header(),
      h('div', { style: 'display:grid;grid-template-columns:minmax(0,1.55fr) 330px;gap:14px;align-items:start' },
        calendar(data.month || []),
        h('div', { style: 'display:flex;flex-direction:column;gap:14px' },
          heatCard(data.heat, data.bestDay, data.bestSlot),
          filaCard(data.fila || []),
          draftsCard(data.drafts || []),
        ),
      ),
    );
  }

  await load();
  return section('Agenda', container);
}
