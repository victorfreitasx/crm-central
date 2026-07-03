// núcleo do front — DOM helper, API, estado, roteador hash e formatadores do placar.
// (porte fiel dos helpers do protótipo Placar Painel MIRA)

// ---------- DOM ----------
// h('div', {style:{...}|'css text', onclick, class, ...attrs}, ...children)
export function h(tag, attrs, ...children) {
  const el = document.createElement(tag);
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null) continue;
      if (k === 'style') {
        if (typeof v === 'string') el.style.cssText = v;
        else Object.assign(el.style, v);
      } else if (k.startsWith('on') && typeof v === 'function') {
        el.addEventListener(k.slice(2), v);
      } else if (k === 'class') {
        el.className = v;
      } else if (k === 'dataset') {
        Object.assign(el.dataset, v);
      } else if (k in el && k !== 'width' && k !== 'height' && k !== 'type') {
        try { el[k] = v; } catch { el.setAttribute(k, v); }
      } else {
        el.setAttribute(k, v);
      }
    }
  }
  append(el, children);
  return el;
}

function append(el, kids) {
  for (const c of kids) {
    if (c == null || c === false) continue;
    if (Array.isArray(c)) append(el, c);
    else if (c instanceof Node) el.appendChild(c);
    else el.appendChild(document.createTextNode(String(c)));
  }
}

export function svgEl(tag, attrs, ...children) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  if (attrs) for (const [k, v] of Object.entries(attrs)) {
    if (k === 'style') el.style.cssText = v;
    else el.setAttribute(k, v);
  }
  for (const c of children) if (c) el.appendChild(c);
  return el;
}

// ---------- API ----------
export class ApiError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

async function call(method, path, body, raw) {
  const opts = { method, headers: {} };
  if (body !== undefined) {
    if (raw) { opts.body = body; opts.headers['Content-Type'] = raw; }
    else { opts.body = JSON.stringify(body); opts.headers['Content-Type'] = 'application/json'; }
  }
  const res = await fetch(path, opts);
  if (res.status === 401) { state.me = null; go('/login'); throw new ApiError(401, 'não autenticado'); }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data.error || `erro ${res.status}`);
  return data;
}

export const api = {
  get: (p) => call('GET', p),
  post: (p, b) => call('POST', p, b),
  put: (p, b) => call('PUT', p, b),
  patch: (p, b) => call('PATCH', p, b),
  del: (p) => call('DELETE', p),
  upload: (p, blob, ct) => call('POST', p, blob, ct),
};

// ---------- estado global ----------
export const state = {
  me: null,          // usuário logado
  pages: [],         // páginas da rede
  users: [],         // colaboradores (nome/cargo/cor) p/ lookups
  perms: { criar: true, agendar: true, metricas: false, exportar: false },
  metaSemanal: 6,
  authMode: 'dev',
  demoMode: false,
  metaConfigured: false,
  lastSync: null,    // epoch ms da última sync de métricas
  studio: null,      // rascunho corrente do estúdio (persiste entre telas)
};

export async function loadBootstrap() {
  const b = await api.get('/api/bootstrap');
  state.me = b.me;
  state.pages = b.pages;
  state.users = b.users;
  state.perms = b.perms;
  state.metaSemanal = b.metaSemanal;
  state.authMode = b.authMode;
  state.demoMode = b.demoMode;
  state.metaConfigured = b.metaConfigured;
  state.lastSync = b.lastSync ?? null;
  return b;
}

export const page = (id) => state.pages.find((p) => p.id === id) || { id, handle: '@?', nome: '?', color: '#151210', fg: '#FBF4E9' };
export const user = (id) => state.users.find((u) => u.id === id) || (state.me && state.me.id === id ? state.me : { id, nome: '—', cargo: '', cor: '#F4E9D6' });
export const isGestor = () => state.me?.role === 'gestor';
// equipe só vê as páginas liberadas — SEM fallback pra todas (senão o estúdio
// pré-seleciona uma página que o backend rejeita com 403).
export const accessPages = () => (isGestor() ? state.pages : state.pages.filter((p) => state.me?.pages?.includes(p.id)));

// ---------- roteador (hash) ----------
const routes = [];
export function route(pattern, screen) { routes.push({ pattern, screen }); }

export function parseHash() {
  const raw = (location.hash || '#/').slice(1);
  const [path, qs] = raw.split('?');
  return { path: path || '/', query: Object.fromEntries(new URLSearchParams(qs || '')) };
}

export function go(path) {
  if (('#' + path) === location.hash) render();
  else location.hash = path;
}

export function matchRoute(path) {
  for (const r of routes) {
    const keys = [];
    const rx = new RegExp('^' + r.pattern.replace(/:[^/]+/g, (m) => { keys.push(m.slice(1)); return '([^/]+)'; }) + '$');
    const m = path.match(rx);
    if (m) {
      const params = {};
      keys.forEach((k, i) => {
        // hash malformado (%-escape quebrado) não pode derrubar o roteador
        try { params[k] = decodeURIComponent(m[i + 1]); } catch { params[k] = m[i + 1]; }
      });
      return { screen: r.screen, params };
    }
  }
  return null;
}

let renderFn = null;
export function onRender(fn) { renderFn = fn; }
export function render() { if (renderFn) renderFn(); }
window.addEventListener('hashchange', () => render());

// ---------- toasts ----------
export function toast(msg) {
  let host = document.getElementById('pl-toasts');
  if (!host) {
    host = h('div', { id: 'pl-toasts', style: 'position:fixed;right:20px;bottom:20px;display:flex;flex-direction:column;gap:8px;z-index:80' });
    document.body.appendChild(host);
  }
  const t = h('div', {
    style: 'background:var(--ink-900);color:var(--paper-50);border-radius:10px;padding:11px 16px;font-family:var(--font-mono);font-size:12px;box-shadow:4px 4px 0 0 ' + ACC + ';animation:plToast 180ms var(--ease-snap)',
  }, msg);
  host.appendChild(t);
  setTimeout(() => t.remove(), 3800);
}

// ---------- formatadores (idênticos ao protótipo) ----------
export const ACC = '#FF2E7E';       // acento rosa
export const ACC_FG = '#FFFFFF';
export const DAY = 864e5;
export const MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
export const MESFULL = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
export const DIAS = ['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom'];
export const SLOTS = ['8–11h', '11–14h', '14–17h', '17–20h', '20–23h'];

export function K(n) {
  n = Number(n) || 0;
  if (n >= 1e6) return (n / 1e6).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + ' mi';
  if (n >= 100000) return Math.round(n / 1000).toLocaleString('pt-BR') + ' mil';
  if (n >= 1000) return (n / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + ' mil';
  return Math.round(n).toLocaleString('pt-BR');
}
export const pc = (x) => ((x || 0) * 100).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + '%';
export const dt = (ts) => { const d = new Date(ts); return String(d.getDate()).padStart(2, '0') + ' ' + MES[d.getMonth()]; };
export const dth = (ts) => dt(ts) + ' · ' + new Date(ts).getHours() + 'h';
export function ago(ts) {
  const d = Math.floor((Date.now() - ts) / DAY);
  return d <= 0 ? 'hoje' : d === 1 ? 'há 1 dia' : 'há ' + d + ' dias';
}
export function agoShort(ts) {
  if (!ts) return '—';
  const m = Math.floor((Date.now() - ts) / 6e4);
  if (m < 2) return 'agora';
  if (m < 60) return 'há ' + m + ' min';
  const hh = Math.floor(m / 60);
  if (hh < 24) return 'há ' + hh + ' h';
  return ago(ts);
}
export const ini = (nome) => (nome || '?').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
export const fn = (nome) => { const p = (nome || '?').split(' '); return p[0] + (p[1] ? ' ' + p[1][0] + '.' : ''); };
export const fgFor = (bg) => ['#CBFB45', '#FBF4E9', '#F4E9D6', '#FFC9DF', '#ECFFB8', '#FFFFFF', '#D9CCFF', '#FFD7C2', '#D2F4E2', '#FFE6EF'].includes(bg) ? '#151210' : '#FBF4E9';
export const tierOf = (idp) => (idp >= 115 ? 'S' : idp >= 105 ? 'A' : idp >= 92 ? 'B' : 'C');

export function tierCss(t, size) {
  const m = { S: ['#FF2E7E', '#FFFFFF'], A: ['#7A4DFF', '#FFFFFF'], B: ['#CBFB45', '#151210'], C: ['#F4E9D6', '#151210'] }[t] || ['#F4E9D6', '#151210'];
  const d = size || 26;
  return {
    width: d + 'px', height: d + 'px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    background: m[0], color: m[1], border: '2px solid var(--ink-900)', borderRadius: '6px',
    fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: d * 0.52 + 'px', flex: 'none',
    boxShadow: '2px 2px 0 0 var(--ink-900)',
  };
}

export function idpChip(idp) {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '42px', height: '22px',
    padding: '0 6px', borderRadius: '6px', border: '2px solid var(--ink-900)',
    fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '11px', flex: 'none',
  };
  if (idp >= 130) return { ...base, background: '#151210', color: '#CBFB45' };
  if (idp >= 108) return { ...base, background: '#151210', color: '#FBF4E9' };
  if (idp >= 92) return { ...base, background: 'var(--paper-0)', color: '#151210' };
  return { ...base, background: '#FFD9D6', color: '#151210' };
}

export function stChip(s) {
  const map = {
    publicado: ['publicado', '#ECFFB8', 'var(--ink-900)'],
    analisando: ['análise 48h', '#FFEFC9', 'var(--ink-900)'],
    agendado: ['agendado', '#D9CCFF', 'var(--ink-900)'],
    rascunho: ['rascunho', '#F4E9D6', 'var(--ink-500)'],
    erro: ['erro', '#FFD9D6', 'var(--ink-900)'],
  };
  const m = map[s] || map.rascunho;
  return {
    label: m[0],
    css: {
      display: 'inline-flex', alignItems: 'center', height: '22px', padding: '0 8px', borderRadius: '6px',
      border: '2px solid ' + (s === 'rascunho' ? 'var(--ink-300)' : 'var(--ink-900)'),
      fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '10px', letterSpacing: '0.05em',
      textTransform: 'uppercase', whiteSpace: 'nowrap', background: m[1], color: m[2], flex: 'none',
    },
  };
}

export const fmtL = (f) => ({ feed: 'FEED', carrossel: 'CARR', reels: 'REELS', story: 'STORY' }[f] || f);
export const FMT_COLORS = { feed: 'var(--ink-900)', carrossel: '#7A4DFF', reels: ACC, story: '#FF6B2C' };

export function segsOf(done, target, onColor, offColor) {
  return Array.from({ length: target }, (_, i) =>
    h('span', { style: { width: '14px', height: '10px', borderRadius: '3px', border: '2px solid var(--ink-900)', background: i < done ? onColor : offColor || 'var(--paper-100)', flex: 'none', boxSizing: 'border-box' } }),
  );
}

export function sparkBars(arr, opts = {}) {
  const mx = Math.max(...arr, 1e-6);
  const wpx = opts.w || '5px', hmax = opts.h || 26;
  return arr.map((v, i) =>
    h('span', { style: { width: wpx, height: Math.max(3, (v / mx) * hmax) + 'px', background: i === arr.length - 1 ? opts.lastColor || ACC : opts.color || 'var(--ink-900)', opacity: i === arr.length - 1 ? '1' : String(opts.dim ?? 0.22), borderRadius: '2px', flex: 'none' } }),
  );
}

// rótulo da temporada (mês · semana n/total) — calculado, não mockado
export function weekLabel(now = Date.now()) {
  const d = new Date(now);
  const first = new Date(d.getFullYear(), d.getMonth(), 1);
  const offset = (first.getDay() + 6) % 7;
  const week = Math.floor((d.getDate() - 1 + offset) / 7) + 1;
  const dim = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  const total = Math.ceil((dim + offset) / 7);
  return `temporada ${MES[d.getMonth()]}·${String(d.getFullYear()).slice(2)} — semana ${week}/${total}`;
}

// linha de post (tabelas) — tile + autor + status + métricas
export function postCells(p) {
  const pg = page(p.page_id);
  const au = user(p.author_id);
  const st = stChip(p.status);
  return {
    pg, au, st,
    tile: h('div', { style: { width: '44px', height: '44px', borderRadius: '8px', border: '2px solid var(--ink-900)', background: p.tile_bg, color: p.tile_fg, fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '7px', lineHeight: '1.08', padding: '4px', overflow: 'hidden', letterSpacing: '-0.01em', flex: 'none' } }, p.cap.length > 34 ? p.cap.slice(0, 34) + '…' : p.cap),
    auAv: h('span', { style: { width: '22px', height: '22px', borderRadius: '999px', border: '2px solid var(--ink-900)', background: au.cor, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '9px', flex: 'none' } }, ini(au.nome)),
    data: p.status === 'agendado' ? dth(p.ts) : dt(p.ts),
    stEl: h('span', { style: st.css }, st.label),
    re: p.m ? K(p.m.re) : '—',
    li: p.m ? K(p.m.li) : '—',
    ctr: p.m && p.m.re ? pc(p.m.cl / p.m.re) : '—',
    idpEl: p.idp
      ? h('span', { style: idpChip(p.idp) }, String(p.idp))
      : h('span', { style: { fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ink-300)' } }, '—'),
  };
}

// cartão padrão
export const cardCss = 'background:var(--paper-0);border:2px solid var(--ink-900);border-radius:16px;box-shadow:3px 3px 0 0 var(--ink-900)';
export const monoLabel = 'font-family:var(--font-mono);font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase';

export function pageHeader(eyebrow, title, sub, right) {
  return h('div', { style: 'display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap' },
    h('div', { style: 'display:flex;flex-direction:column;gap:6px' },
      h('span', { style: 'font-family:var(--font-mono);font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--ink-500)' }, eyebrow),
      h('h1', { style: 'margin:0;font-family:var(--font-display);font-weight:800;font-size:40px;letter-spacing:-0.02em;line-height:0.94' }, title),
      sub ? h('span', { style: 'font-size:14px;color:var(--ink-500)' }, sub) : null,
    ),
    right || null,
  );
}

// botão do DS (primary/accent/ink/ghost)
export function btn(label, variant, onclick, opts = {}) {
  const styles = {
    primary: 'background:#FF2E7E;color:#FFFFFF;',
    accent: 'background:#CBFB45;color:#151210;',
    ink: 'background:#151210;color:#FBF4E9;',
    ghost: 'background:transparent;color:var(--ink-900);',
  };
  return h('button', {
    class: 'pl-btn',
    style:
      `height:${opts.h || 36}px;padding:0 16px;border:2px solid ${opts.borderColor || 'var(--ink-900)'};border-radius:999px;` +
      `font-family:var(--font-sans);font-weight:700;font-size:13px;display:inline-flex;align-items:center;justify-content:center;gap:6px;` +
      `box-shadow:${variant === 'ghost' ? 'none' : '3px 3px 0 0 var(--ink-900)'};` +
      styles[variant] + (opts.block ? 'width:100%;' : '') + (opts.style || ''),
    onclick,
  }, label);
}

export function spinner() {
  return h('div', { style: 'display:flex;align-items:center;justify-content:center;padding:60px' },
    h('div', { style: 'width:34px;height:34px;border:3px solid var(--paper-200);border-top-color:var(--ink-900);border-radius:99px;animation:plSpin 700ms linear infinite' }));
}

export function emptyBox(title, sub) {
  return h('div', { style: 'padding:36px;text-align:center;display:flex;flex-direction:column;gap:8px;align-items:center' },
    h('span', { style: 'font-family:var(--font-display);font-weight:800;font-size:20px' }, title),
    h('span', { style: 'font-size:13px;color:var(--ink-500)' }, sub || ''),
  );
}
