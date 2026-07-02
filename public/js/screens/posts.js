// tela posts — lista de conteúdo da equipe (ou do próprio autor) com filtros e paginação.
import { h, api, go, state, isGestor, fn, fmtL, postCells, pageHeader, cardCss, emptyBox, spinner, btn, ACC } from '../core.js';
import { section } from '../shell.js';

const GRID = '46px minmax(200px,1.7fr) 108px 52px 62px 92px 74px 66px 58px 52px 18px';
const LIMIT = 30;
const TABS = [['all', 'todos'], ['publicado', 'publicados'], ['analisando', 'em análise'], ['agendado', 'agendados'], ['rascunho', 'rascunhos']];

export async function postsScreen(params, query) {
  const gestor = isGestor();

  // ---------- estado local dos filtros ----------
  const f = {
    q: '',
    page: 'all',
    fmt: 'all',
    status: TABS.some(([id]) => id === query?.status) ? query.status : 'all',
    author: 'all',
    sort: 'recentes',
  };

  let rows = [];
  let total = 0;
  let loadError = null;
  let loading = false;

  const qs = (offset) => {
    const p = new URLSearchParams();
    if (f.q.trim()) p.set('q', f.q.trim());
    if (f.page !== 'all') p.set('page', f.page);
    if (f.fmt !== 'all') p.set('fmt', f.fmt);
    if (f.status !== 'all') p.set('status', f.status);
    if (gestor && f.author !== 'all') p.set('author', f.author);
    p.set('sort', f.sort);
    p.set('limit', String(LIMIT));
    p.set('offset', String(offset));
    return p.toString();
  };

  async function fetchRows(append) {
    try {
      const res = await api.get('/api/posts?' + qs(append ? rows.length : 0));
      total = res.total || 0;
      rows = append ? rows.concat(res.rows || []) : (res.rows || []);
      loadError = null;
    } catch (e) {
      loadError = e.message;
      if (!append) { rows = []; total = 0; }
    }
  }

  // ---------- cartão de filtros ----------
  const selCss = 'height:38px;border:2px solid var(--ink-900);border-radius:10px;background:var(--paper-0);font-family:var(--font-mono);font-size:11px;font-weight:700;padding:0 8px;cursor:pointer;box-shadow:2px 2px 0 0 var(--ink-900)';

  let debTimer = null;
  const qIn = h('input', {
    placeholder: 'buscar por título…',
    style: 'height:38px;width:250px;border:2px solid var(--ink-900);border-radius:10px;background:var(--paper-0);padding:0 12px;font-family:var(--font-sans);font-size:13px;box-shadow:2px 2px 0 0 var(--ink-900);outline:none',
    oninput: (e) => {
      clearTimeout(debTimer);
      debTimer = setTimeout(() => { f.q = e.target.value; refresh(); }, 300);
    },
  });

  const pageSel = h('select', { style: selCss, onchange: (e) => { f.page = e.target.value; refresh(); } },
    h('option', { value: 'all' }, 'todas as páginas'),
    state.pages.map((p) => h('option', { value: p.id }, p.handle)),
  );
  pageSel.value = f.page;

  const fmtSel = h('select', { style: selCss, onchange: (e) => { f.fmt = e.target.value; refresh(); } },
    [['all', 'todos os formatos'], ['feed', 'feed'], ['carrossel', 'carrossel'], ['reels', 'reels'], ['story', 'story']]
      .map(([v, l]) => h('option', { value: v }, l)),
  );
  fmtSel.value = f.fmt;

  let authorSel = null;
  if (gestor) {
    authorSel = h('select', { style: selCss, onchange: (e) => { f.author = e.target.value; refresh(); } },
      h('option', { value: 'all' }, 'toda a equipe'),
      state.users.filter((u) => u.role === 'equipe').map((u) => h('option', { value: u.id }, u.nome)),
    );
    authorSel.value = f.author;
  }

  const sortSel = h('select', {
    style: 'height:38px;border:2px solid var(--ink-900);border-radius:10px;background:var(--paper-100);font-family:var(--font-mono);font-size:11px;font-weight:700;padding:0 8px;cursor:pointer',
    onchange: (e) => { f.sort = e.target.value; refresh(); },
  },
    h('option', { value: 'recentes' }, '↓ mais recentes'),
    h('option', { value: 'alcance' }, '↓ maior alcance'),
    h('option', { value: 'idp' }, '↓ maior idp'),
  );
  sortSel.value = f.sort;

  const chipsRow = h('div', { style: 'display:flex;gap:6px;align-items:center;flex-wrap:wrap' });
  function renderChips() {
    chipsRow.replaceChildren(...TABS.map(([id, label]) => {
      const on = f.status === id;
      return h('button', {
        class: 'pl-btn',
        style: {
          height: '32px', padding: '0 14px', borderRadius: '999px', border: '2px solid var(--ink-900)',
          fontFamily: 'var(--font-sans)', fontWeight: '700', fontSize: '12px', cursor: 'pointer', flex: 'none',
          background: on ? 'var(--ink-900)' : 'var(--paper-0)',
          color: on ? 'var(--paper-50)' : 'var(--ink-700)',
          boxShadow: on ? '2px 2px 0 0 ' + ACC : 'none',
        },
        onclick: () => { if (f.status === id) return; f.status = id; refresh(); },
      }, label);
    }));
  }

  const countEl = h('span', { style: 'font-family:var(--font-mono);font-size:11px;color:var(--ink-500)' });
  function renderCount() {
    countEl.textContent = loadError ? '—' : total + ' posts · mostrando ' + rows.length;
  }

  const filterCard = h('div', { style: cardCss + ';padding:14px 16px;display:flex;flex-direction:column;gap:12px' },
    h('div', { style: 'display:flex;gap:10px;align-items:center;flex-wrap:wrap' },
      qIn, pageSel, fmtSel, authorSel,
      h('div', { style: 'flex:1' }),
      sortSel,
    ),
    h('div', { style: 'display:flex;gap:12px;align-items:center;flex-wrap:wrap' }, chipsRow, countEl),
  );

  // ---------- tabela ----------
  const tableCard = h('div', { style: cardCss + ';display:flex;flex-direction:column;overflow-x:auto' });

  const headerRow = () => h('div', { style: 'display:grid;grid-template-columns:' + GRID + ';min-width:900px;gap:10px;align-items:center;padding:14px 16px 8px;font-family:var(--font-mono);font-size:9px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-300)' },
    h('span'), h('span', null, 'post'), h('span', null, 'autor'), h('span', null, 'fmt'), h('span', null, 'data'), h('span', null, 'status'),
    h('span', { style: 'text-align:right' }, 'alcance'), h('span', { style: 'text-align:right' }, 'likes'), h('span', { style: 'text-align:right' }, 'ctr'),
    h('span', null, 'idp'), h('span'),
  );

  const rowEl = (p) => {
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
  };

  function renderTable() {
    const kids = [headerRow()];
    if (loadError) {
      kids.push(emptyBox('não deu pra carregar os posts', loadError));
    } else if (!rows.length) {
      kids.push(emptyBox('nada por aqui', 'nenhum post bate com esses filtros — tenta limpar a busca.'));
    } else {
      for (const p of rows) kids.push(rowEl(p));
      if (total > rows.length) {
        kids.push(h('div', {
          class: 'pl-hover-row',
          style: 'padding:12px;text-align:center;border-top:2px solid var(--paper-200);font-family:var(--font-mono);font-size:11px;font-weight:700;color:var(--ink-500);cursor:pointer',
          onclick: async () => {
            if (loading) return;
            loading = true;
            await fetchRows(true);
            loading = false;
            rerender();
          },
        }, 'mostrar mais 30 ↓'));
      }
    }
    tableCard.replaceChildren(...kids);
  }

  function rerender() {
    renderChips();
    renderCount();
    renderTable();
  }

  async function refresh() {
    if (loading) return;
    loading = true;
    renderChips();
    tableCard.replaceChildren(spinner());
    await fetchRows(false);
    loading = false;
    rerender();
  }

  // ---------- carga inicial + composição ----------
  await fetchRows(false);
  rerender();

  return section('Posts',
    pageHeader(
      '★ conteúdo',
      gestor ? 'posts da equipe' : 'meus posts',
      gestor ? 'tudo que a equipe publicou, agendou ou deixou no rascunho.' : 'tudo que você publicou, agendou ou deixou no rascunho.',
      btn('criar no estúdio', 'accent', () => go('/studio')),
    ),
    filterCard,
    tableCard,
  );
}
