// tela de login — magic link (sem senha), no estilo sticker do DS.
import { h, api, state, toast, go, loadBootstrap, ACC, btn } from '../core.js';

export async function loginScreen(query) {
  const erro = query?.erro;
  let sentBox = null;

  const email = h('input', {
    type: 'email', placeholder: 'voce@mira.co', autocomplete: 'email',
    style: 'height:44px;border:2px solid var(--ink-900);border-radius:10px;background:var(--paper-0);padding:0 12px;font-family:var(--font-mono);font-size:14px;outline:none;box-shadow:2px 2px 0 0 var(--ink-900);width:100%',
    onkeydown: (e) => { if (e.key === 'Enter') send(); },
  });

  async function send() {
    const v = email.value.trim();
    if (!v.includes('@')) { toast('escreve um email válido primeiro'); return; }
    try {
      const res = await api.post('/api/auth/request-link', { email: v });
      sentBox.innerHTML = '';
      sentBox.append(
        h('div', { style: 'display:flex;flex-direction:column;gap:8px;background:var(--lime-200);border:2px solid var(--ink-900);border-radius:12px;padding:14px' },
          h('span', { style: 'font-weight:700;font-size:14px' }, 'link mágico enviado ✓'),
          h('span', { style: 'font-size:12.5px;color:var(--ink-700)' }, 'confere teu email e clica no link pra entrar — sem senha.'),
          res.link
            ? h('a', { href: res.link, style: 'font-family:var(--font-mono);font-size:11px;word-break:break-all;color:var(--violet-600)' }, '[modo dev] entrar agora →')
            : null,
        ),
      );
    } catch (e) {
      toast(e.message);
    }
  }

  sentBox = h('div', {});

  return h('div', { style: 'min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--paper-50);padding:20px' },
    h('div', { style: 'width:420px;max-width:94vw;display:flex;flex-direction:column;gap:18px' },
      h('div', { style: 'display:flex;align-items:center;gap:10px' },
        h('div', { style: 'display:flex;align-items:baseline' },
          h('span', { style: 'font-family:var(--font-display);font-weight:800;font-size:44px;letter-spacing:-0.02em' }, 'placar'),
          h('span', { style: 'font-family:var(--font-display);font-weight:800;font-size:44px;color:' + ACC }, '.'),
        ),
        h('span', { style: 'font-family:var(--font-mono);font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--ink-500);border:2px solid var(--ink-900);border-radius:6px;padding:3px 7px;background:var(--paper-0)' }, 'rede mira'),
      ),
      h('div', { style: 'background:var(--paper-0);border:2px solid var(--ink-900);border-radius:20px;box-shadow:6px 6px 0 0 var(--ink-900);padding:24px;display:flex;flex-direction:column;gap:14px' },
        h('span', { style: 'font-family:var(--font-mono);font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--ink-500)' }, '★ entrar no painel'),
        h('h1', { style: 'margin:0;font-family:var(--font-display);font-weight:800;font-size:30px;letter-spacing:-0.02em;line-height:0.96' }, 'bora ver o placar?'),
        h('span', { style: 'font-size:13.5px;color:var(--ink-500);line-height:1.5' }, 'entra com teu email do trabalho. o link mágico chega sem senha — sessões seguras no edge (KV).'),
        erro ? h('div', { style: 'background:var(--red-100);border:2px solid var(--ink-900);border-radius:10px;padding:10px 12px;font-size:12.5px;font-weight:700' },
          erro === 'link-invalido' ? 'esse link expirou ou já foi usado — pede outro.' : 'sem acesso — fala com o gestor da rede.') : null,
        email,
        btn('me manda o link →', 'ink', send, { block: true, h: 44 }),
        sentBox,
      ),
      h('span', { style: 'font-family:var(--font-mono);font-size:9.5px;letter-spacing:0.1em;color:var(--ink-300);text-align:center' }, 'WORKERS · KV · D1 — 100% EDGE'),
    ),
  );
}
