// entrada do app — roteador + bootstrap de sessão.
import { h, state, loadBootstrap, parseHash, matchRoute, route, onRender, go, isGestor, spinner } from './core.js';
import { shell } from './shell.js';
import { loginScreen } from './screens/login.js';
import { dashScreen } from './screens/dash.js';
import { equipeScreen } from './screens/equipe.js';
import { perfilScreen } from './screens/perfil.js';
import { postsScreen } from './screens/posts.js';
import { postScreen } from './screens/post.js';
import { studioScreen } from './screens/studio.js';
import { agendaScreen } from './screens/agenda.js';
import { paginasScreen } from './screens/paginas.js';
import { configScreen } from './screens/config.js';

route('/', dashScreen);
route('/equipe', equipeScreen);
route('/perfil/:uid', perfilScreen);
route('/posts', postsScreen);
route('/post/:id', postScreen);
route('/studio', studioScreen);
route('/agenda', agendaScreen);
route('/paginas', paginasScreen);
route('/config', configScreen);

const root = document.getElementById('app');
let rendering = 0;

async function renderApp() {
  const seq = ++rendering;
  const { path, query } = parseHash();

  if (path === '/login') {
    root.replaceChildren(await loginScreen(query));
    return;
  }

  if (!state.me) {
    root.replaceChildren(spinner());
    try {
      await loadBootstrap();
    } catch {
      if (seq === rendering) go('/login');
      return;
    }
  }

  // raiz: gestor vê o dash, equipe cai no próprio placar
  let target = path;
  if (path === '/' && !isGestor()) target = '/perfil/' + state.me.id;
  if ((path === '/equipe' || path === '/config') && !isGestor()) target = '/perfil/' + state.me.id;
  if (target !== path) { go(target); return; }

  const m = matchRoute(path);
  if (!m) { go('/'); return; }

  const holder = h('div', {}, spinner());
  root.replaceChildren(shell(path, holder, state.lastSync));
  try {
    const content = await m.screen(m.params, query);
    if (seq !== rendering) return; // navegação mudou no meio do fetch
    holder.replaceChildren(content);
  } catch (e) {
    if (e.status === 401) return; // core já redirecionou pro login
    if (seq !== rendering) return;
    holder.replaceChildren(
      h('div', { style: 'padding:60px;display:flex;flex-direction:column;gap:10px;align-items:center' },
        h('span', { style: 'font-family:var(--font-display);font-weight:800;font-size:24px' }, 'deu ruim por aqui'),
        h('span', { style: 'font-size:13px;color:var(--ink-500)' }, e.message || 'erro inesperado'),
      ),
    );
  }
}

onRender(renderApp);
renderApp();
