// casco do app: topbar + menu lateral + área de conteúdo + modal de agendamento.
import { h, state, isGestor, go, toast, api, ACC, page, ini, weekLabel, agoShort, btn, monoLabel } from './core.js';

const NAV_GESTOR = [
  ['/', 'visão geral'],
  ['/equipe', 'equipe'],
  ['/posts', 'posts'],
  ['/studio', 'estúdio'],
  ['/agenda', 'agenda'],
  ['/paginas', 'páginas'],
  ['/config', 'config'],
];
const NAV_EQUIPE = [
  ['/meu', 'meu placar'],
  ['/posts', 'meus posts'],
  ['/studio', 'estúdio'],
  ['/agenda', 'agenda'],
  ['/paginas', 'páginas'],
];

function navActive(id, path) {
  if (id === '/') return path === '/';
  if (id === '/meu') return path === '/meu' || path.startsWith('/perfil/' + state.me?.id);
  if (id === '/posts') return path === '/posts' || path.startsWith('/post/');
  if (id === '/equipe') return path === '/equipe' || path.startsWith('/perfil/');
  return path === id || path.startsWith(id + '/');
}

export function shell(path, content, lastSyncTs) {
  const me = state.me;
  const items = isGestor() ? NAV_GESTOR : NAV_EQUIPE;

  const nav = items.map(([id, label], i) => {
    const on = navActive(id, path);
    return h('div', {
      style: {
        display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '10px',
        cursor: 'pointer', transition: 'all 120ms var(--ease-out)', userSelect: 'none',
        background: on ? 'var(--ink-900)' : 'transparent',
        color: on ? 'var(--paper-50)' : 'var(--ink-700)',
        boxShadow: on ? '3px 3px 0 0 ' + ACC : 'none',
      },
      onclick: () => go(id === '/meu' ? '/perfil/' + me.id : id),
    },
      h('span', { style: { fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: '700', color: on ? ACC : 'var(--ink-300)', width: '18px', flex: 'none' } }, String(i + 1).padStart(2, '0')),
      h('span', { style: 'font-weight:700;font-size:14px;white-space:nowrap' }, label),
    );
  });

  let menuOpen = false;
  const avatarWrap = h('div', { style: 'position:relative' });
  const avatar = h('div', {
    class: 'pl-btn',
    style: 'width:40px;height:40px;border-radius:999px;border:2px solid var(--ink-900);background:' + (me.cor || '#CBFB45') + ';display:inline-flex;align-items:center;justify-content:center;font-family:var(--font-display);font-weight:800;font-size:14px;box-shadow:2px 2px 0 0 var(--ink-900)',
    title: me.nome + ' · ' + me.email,
    onclick: () => {
      menuOpen = !menuOpen;
      menu.style.display = menuOpen ? 'flex' : 'none';
    },
  }, ini(me.nome));
  const menu = h('div', { style: 'position:absolute;right:0;top:48px;display:none;flex-direction:column;gap:2px;background:var(--paper-0);border:2px solid var(--ink-900);border-radius:12px;box-shadow:4px 4px 0 0 var(--ink-900);padding:8px;z-index:60;min-width:200px' },
    h('div', { style: 'padding:8px 10px;display:flex;flex-direction:column;gap:2px' },
      h('span', { style: 'font-weight:700;font-size:13px' }, me.nome),
      h('span', { style: 'font-family:var(--font-mono);font-size:10px;color:var(--ink-500)' }, me.email),
      h('span', { style: 'font-family:var(--font-mono);font-size:10px;color:var(--ink-500);text-transform:uppercase' }, me.role + ' · ' + me.cargo),
    ),
    h('div', {
      style: 'padding:8px 10px;border-top:2px solid var(--paper-200);cursor:pointer;font-weight:700;font-size:13px;color:var(--red-500)',
      onclick: async () => { await api.post('/api/auth/logout'); state.me = null; go('/login'); },
    }, 'sair da conta'),
  );
  avatarWrap.append(avatar, menu);

  return h('div', { style: 'height:100vh;display:flex;flex-direction:column;overflow:hidden;font-family:var(--font-sans);color:var(--ink-900);background:var(--paper-50)' },
    h('header', { style: 'min-height:64px;flex:none;display:flex;align-items:center;flex-wrap:wrap;row-gap:8px;gap:14px;padding:8px 20px;background:var(--paper-0);border-bottom:2px solid var(--ink-900);z-index:20' },
      h('div', { style: 'display:flex;align-items:center;gap:10px;min-width:196px' },
        h('div', { style: 'display:flex;align-items:baseline;cursor:pointer', onclick: () => go(isGestor() ? '/' : '/perfil/' + me.id) },
          h('span', { style: 'font-family:var(--font-display);font-weight:800;font-size:25px;letter-spacing:-0.02em' }, 'placar'),
          h('span', { style: 'font-family:var(--font-display);font-weight:800;font-size:25px;color:' + ACC }, '.'),
        ),
        h('span', { style: 'font-family:var(--font-mono);font-size:9px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--ink-500);border:2px solid var(--ink-900);border-radius:6px;padding:3px 7px;background:var(--paper-50)' }, 'rede mira'),
      ),
      h('span', { style: 'font-family:var(--font-mono);font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-500)' }, weekLabel()),
      h('div', { style: 'flex:1' }),
      btn('+ novo post', 'primary', () => go('/studio'), { h: 36 }),
      avatarWrap,
    ),
    h('div', { style: 'flex:1;display:flex;min-height:0' },
      h('aside', { style: 'width:212px;flex:none;display:flex;flex-direction:column;gap:2px;padding:14px 12px;background:var(--paper-0);border-right:2px solid var(--ink-900);overflow-y:auto' },
        h('div', { style: 'font-family:var(--font-mono);font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--ink-300);padding:2px 12px 10px' }, '★ menu'),
        nav,
        h('div', { style: 'flex:1;min-height:16px' }),
        h('div', { style: 'border:2px solid var(--ink-900);border-radius:10px;padding:10px 12px;background:var(--paper-50);display:flex;flex-direction:column;gap:5px' },
          h('div', { style: 'display:flex;align-items:center;gap:6px' },
            h('span', { style: 'width:8px;height:8px;border-radius:99px;background:var(--green-500);border:1px solid var(--ink-900)' }),
            h('span', { style: 'font-family:var(--font-mono);font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase' }, 'sync métricas'),
          ),
          h('span', { style: 'font-size:12px;color:var(--ink-500)' }, lastSyncTs ? 'última: ' + agoShort(lastSyncTs) : state.demoMode ? 'modo demo ativo' : 'aguardando primeira sync'),
          h('span', { style: 'font-family:var(--font-mono);font-size:9px;letter-spacing:0.12em;color:var(--ink-300)' }, 'WORKERS · KV · D1 — OK'),
        ),
      ),
      h('main', { id: 'pl-main', style: 'flex:1;overflow-y:auto;min-width:0' }, content),
    ),
  );
}

export function section(label, ...children) {
  return h('section', { dataset: { screen: label }, style: 'padding:26px 30px 72px;display:flex;flex-direction:column;gap:18px;max-width:1340px;margin:0 auto;width:100%' }, ...children);
}

// ---------- modal de agendamento ----------
// onDone(mode) — chamado depois de agendar ('agendado') ou publicar ('agora')
export function openScheduleModal(post, onDone) {
  const pages = state.pages;
  const defaultDate = new Date(Date.now() + 3 * 864e5);
  const dateVal = defaultDate.toISOString().slice(0, 10);

  const dateIn = h('input', { type: 'date', value: dateVal, style: 'height:40px;border:2px solid var(--ink-900);border-radius:10px;background:var(--paper-0);padding:0 10px;font-size:13px;box-shadow:2px 2px 0 0 var(--ink-900)' });
  const hourSel = h('select', { style: 'height:40px;border:2px solid var(--ink-900);border-radius:10px;background:var(--paper-0);padding:0 10px;font-family:var(--font-mono);font-size:13px;cursor:pointer;box-shadow:2px 2px 0 0 var(--ink-900)' },
    [9, 11, 12, 14, 15, 17, 18, 19, 20, 21].map((hh) => h('option', { value: String(hh), selected: hh === 18 }, hh + ':00')));
  const pageSel = h('select', { style: 'height:40px;border:2px solid var(--ink-900);border-radius:10px;background:var(--paper-0);padding:0 10px;font-family:var(--font-mono);font-size:13px;cursor:pointer;box-shadow:2px 2px 0 0 var(--ink-900)' },
    pages.map((p) => h('option', { value: p.id, selected: p.id === post.page_id }, p.handle)));

  const close = () => overlay.remove();
  const act = async (now) => {
    try {
      const ts = now ? Date.now() : new Date(dateIn.value + 'T' + String(hourSel.value).padStart(2, '0') + ':00:00').getTime();
      if (!Number.isFinite(ts)) { toast('escolhe uma data válida'); return; }
      const res = await api.post(`/api/posts/${post.id}/schedule`, { ts, page_id: pageSel.value, now });
      close();
      onDone && onDone(now ? 'agora' : 'agendado', res);
    } catch (e) {
      toast(e.message);
    }
  };

  const field = (label, el) => h('label', { style: 'display:flex;flex-direction:column;gap:5px' },
    h('span', { style: 'font-family:var(--font-mono);font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-500)' }, label), el);

  const overlay = h('div', { style: 'position:fixed;inset:0;background:rgba(21,18,16,0.55);display:flex;align-items:center;justify-content:center;z-index:90', onclick: close },
    h('div', { style: 'width:440px;max-width:92vw;background:var(--paper-0);border:2px solid var(--ink-900);border-radius:16px;box-shadow:8px 8px 0 0 var(--ink-900);padding:22px;display:flex;flex-direction:column;gap:14px;animation:plPop 160ms var(--ease-snap)', onclick: (e) => e.stopPropagation() },
      h('span', { style: 'font-family:var(--font-mono);font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--ink-500)' }, '★ agendar publicação'),
      h('div', { style: 'font-family:var(--font-display);font-weight:800;font-size:26px;letter-spacing:-0.02em;line-height:0.98' }, 'quando esse post vai ao ar?'),
      h('div', { style: 'display:grid;grid-template-columns:1fr 1fr;gap:10px' }, field('data', dateIn), field('horário', hourSel)),
      field('página de destino', pageSel),
      h('div', { style: 'display:flex;gap:10px;justify-content:flex-end;margin-top:4px;flex-wrap:wrap' },
        btn('cancelar', 'ghost', close),
        btn('enviar agora', 'ink', () => act(true)),
        btn('confirmar agenda', 'primary', () => act(false)),
      ),
    ),
  );
  document.body.appendChild(overlay);
}
