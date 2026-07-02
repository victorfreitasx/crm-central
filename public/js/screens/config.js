// tela config — acesso & infra (gestor): membros, convites, permissões, saúde do backend.
import { h, api, state, toast, K, ini, agoShort, ACC, pageHeader, btn, cardCss, monoLabel, emptyBox } from '../core.js';
import { section } from '../shell.js';

const GRID = '30px minmax(150px,1.3fr) 120px 64px 92px 90px 100px';
const CARGOS = ['gestor', 'designer sr', 'designer', 'social designer', 'editor', 'editor de vídeo', 'motion designer', 'redator'];

export async function configScreen(params, query) {
  const header = pageHeader('★ config', 'acesso & infra', 'quem entra, o que pode fazer, e a saúde do backend.');

  let data;
  try {
    data = await api.get('/api/config');
  } catch (e) {
    return section('Configurações', header,
      h('div', { style: cardCss }, emptyBox('não deu pra carregar a config', e.message)));
  }

  let members = data.members || [];
  const perms = data.perms || state.perms || {};
  const infra = data.infra || {};

  // ---------- membros ----------
  const memTitle = infra.authMode === 'clerk' ? 'membros · autenticação via clerk' : '★ membros · magic link + sessões no KV';

  const emailIn = h('input', {
    placeholder: 'email@mira.co',
    style: 'height:36px;width:230px;border:2px solid var(--ink-900);border-radius:8px;background:var(--paper-0);padding:0 10px;font-family:var(--font-mono);font-size:12px;outline:none',
  });
  const cargoSel = h('select', {
    style: 'height:36px;border:2px solid var(--ink-900);border-radius:8px;background:var(--paper-0);font-family:var(--font-mono);font-size:11px;font-weight:700;padding:0 8px;cursor:pointer',
  },
    h('option', { value: 'editor' }, 'editor'),
    h('option', { value: 'designer' }, 'designer'),
    h('option', { value: 'gestor' }, 'gestor'),
  );
  cargoSel.value = 'editor';

  const linkHost = h('div', { style: 'display:none;flex-direction:column;gap:8px' });

  async function sendInvite() {
    const em = (emailIn.value || '').trim();
    if (em.indexOf('@') < 1) { toast('escreve um email válido primeiro'); return; }
    try {
      const res = await api.post('/api/invites', { email: em, cargo: cargoSel.value });
      toast('convite enviado pra ' + em);
      emailIn.value = '';
      if (res.link) {
        linkHost.style.display = 'flex';
        linkHost.appendChild(h('div', { style: 'display:flex;align-items:center;gap:10px;background:var(--paper-50);border:2px solid var(--ink-900);border-radius:8px;padding:6px 10px' },
          h('span', { style: 'font-family:var(--font-mono);font-size:10px;color:var(--ink-700);flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap' }, res.link),
          btn('copiar link', 'ghost', () => { navigator.clipboard.writeText(res.link); toast('link copiado'); }, { h: 28 }),
        ));
      }
      await refetchMembers();
    } catch (e) {
      toast(e.message);
    }
  }

  const inviteBar = h('div', { style: 'display:flex;gap:8px;align-items:center;flex-wrap:wrap;background:var(--paper-100);border:2px solid var(--ink-900);border-radius:10px;padding:10px' },
    emailIn,
    cargoSel,
    btn('enviar convite', 'ink', sendInvite, { h: 36 }),
    h('span', { style: 'font-size:11px;color:var(--ink-500)' }, 'o convite chega por email com magic link — sem senha.'),
  );

  const rowsHost = h('div', { style: 'display:flex;flex-direction:column' });

  async function refetchMembers() {
    try {
      const d = await api.get('/api/config');
      members = d.members || [];
    } catch (e) {
      toast(e.message);
      return;
    }
    renderRows();
  }

  function memberRow(u) {
    const invited = u.status === 'convidado';
    const sus = u.status === 'suspenso';
    const self = state.me && state.me.id === u.id;
    const fnome = (u.nome || '?').split(' ')[0];
    const stTxt = invited ? 'convidado' : sus ? 'suspenso' : 'ativo';
    const stBg = invited ? '#FFEFC9' : sus ? '#FFD9D6' : '#ECFFB8';

    const iniCss = { width: '26px', height: '26px', borderRadius: '999px', border: '2px solid var(--ink-900)', background: u.cor || '#F4E9D6', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: '800', fontSize: '9px', flex: 'none', opacity: sus ? '0.45' : '1' };
    const stCss = { display: 'inline-flex', alignItems: 'center', height: '22px', padding: '0 8px', borderRadius: '6px', border: '2px solid var(--ink-900)', fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '10px', letterSpacing: '0.05em', textTransform: 'uppercase', background: stBg, width: 'fit-content' };

    const sel = h('select', {
      style: 'height:32px;border:2px solid var(--ink-900);border-radius:8px;background:var(--paper-0);font-family:var(--font-mono);font-size:10.5px;font-weight:700;padding:0 6px;cursor:pointer',
      onchange: async () => {
        const val = sel.value;
        try {
          await api.patch('/api/members/' + u.id, { cargo: val });
          u.cargo = val;
          toast('cargo de ' + fnome + ' → ' + val);
        } catch (e) {
          sel.value = u.cargo;
          toast(e.message);
        }
      },
    }, CARGOS.map((c) => h('option', { value: c }, c)));
    sel.value = u.cargo;

    const susCss = self
      ? { fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--ink-300)', textAlign: 'right' }
      : { fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: '700', color: sus ? 'var(--green-500)' : 'var(--red-500)', textDecoration: 'underline', cursor: 'pointer', textAlign: 'right' };

    const susEl = h('span', {
      style: susCss,
      onclick: self ? null : async () => {
        try {
          const res = await api.post('/api/members/' + u.id + '/suspend');
          toast(fnome + (res.status === 'suspenso' ? ' suspenso(a) — acesso revogado' : ' reativado(a)'));
          await refetchMembers();
        } catch (e) {
          toast(e.message);
        }
      },
    }, self ? 'você' : sus ? 'reativar' : 'suspender');

    return h('div', { style: 'display:grid;grid-template-columns:' + GRID + ';min-width:740px;gap:10px;align-items:center;padding:8px 4px;border-top:2px solid var(--paper-200)' },
      h('span', { style: iniCss }, ini(u.nome)),
      h('div', { style: 'display:flex;flex-direction:column;min-width:0' },
        h('span', { style: 'font-weight:700;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis' }, u.nome),
        h('span', { style: 'font-family:var(--font-mono);font-size:10px;color:var(--ink-500)' }, u.email),
      ),
      sel,
      h('span', { style: 'font-family:var(--font-mono);font-size:11px;text-align:center' }, u.role === 'gestor' ? 'todas' : String((u.pages || []).length)),
      h('span', { style: stCss }, stTxt),
      h('span', { style: 'font-family:var(--font-mono);font-size:10px;color:var(--ink-500)' }, agoShort(u.last_seen_at)),
      susEl,
    );
  }

  function renderRows() {
    rowsHost.replaceChildren(
      ...(members.length
        ? members.map(memberRow)
        : [emptyBox('nenhum membro ainda', 'convide alguém pelo formulário acima.')]),
    );
  }
  renderRows();

  const membersCard = h('div', { style: cardCss + ';padding:18px;display:flex;flex-direction:column;gap:14px;overflow-x:auto' },
    h('div', { style: 'display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap' },
      h('span', { style: monoLabel }, memTitle),
    ),
    inviteBar,
    linkHost,
    h('div', { style: 'display:grid;grid-template-columns:' + GRID + ';min-width:740px;gap:10px;align-items:center;padding:0 4px;font-family:var(--font-mono);font-size:9px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-300)' },
      h('span', null), h('span', null, 'membro'), h('span', null, 'cargo'), h('span', null, 'páginas'), h('span', null, 'status'), h('span', null, 'visto'), h('span', null),
    ),
    rowsHost,
  );

  // ---------- permissões ----------
  const PERM_DEFS = [
    ['criar', 'criar posts no estúdio', 'todo membro pode montar artes e salvar rascunhos'],
    ['agendar', 'agendar sem aprovação', 'desligado = agendamentos entram numa fila de revisão do gestor'],
    ['metricas', 'ver métricas da equipe toda', 'desligado = cada um vê só o próprio placar'],
    ['exportar', 'exportar dados (csv)', 'liberar download de métricas brutas do d1'],
  ];

  function permSwitch(key) {
    let on = !!perms[key];
    const knob = h('span', { style: { width: '16px', height: '16px', borderRadius: '99px', background: 'var(--ink-900)', position: 'absolute', top: '3px', left: '3px', transform: on ? 'translateX(20px)' : 'translateX(0)', transition: 'transform 140ms var(--ease-snap)' } });
    const outer = h('button', {
      type: 'button',
      class: 'pl-btn',
      style: { position: 'relative', width: '46px', height: '26px', borderRadius: '999px', border: '2px solid var(--ink-900)', background: on ? 'var(--lime-500)' : 'var(--paper-100)', cursor: 'pointer', padding: '0', flex: 'none', transition: 'background 140ms var(--ease-out)' },
      onclick: async () => {
        const next = !on;
        try {
          const res = await api.put('/api/perms', { [key]: next });
          on = next;
          perms[key] = next;
          if (res && res.perms) state.perms = res.perms;
          else state.perms = { ...state.perms, [key]: next };
          outer.style.background = on ? 'var(--lime-500)' : 'var(--paper-100)';
          knob.style.transform = on ? 'translateX(20px)' : 'translateX(0)';
        } catch (e) {
          toast(e.message);
        }
      },
    }, knob);
    return outer;
  }

  const metaIn = h('input', {
    type: 'number', min: '1', max: '12', value: String(data.metaSemanal || state.metaSemanal || 6),
    style: 'height:32px;width:64px;border:2px solid var(--ink-900);border-radius:8px;background:var(--paper-0);font-family:var(--font-mono);font-size:12px;font-weight:700;padding:0 8px;text-align:center',
  });

  const permsCard = h('div', { style: cardCss + ';padding:18px;display:flex;flex-direction:column;gap:4px' },
    h('span', { style: monoLabel + ';padding-bottom:8px' }, 'permissões do papel “equipe”'),
    PERM_DEFS.map(([key, label, desc]) =>
      h('div', { style: 'display:flex;align-items:center;gap:12px;padding:10px 0;border-top:2px solid var(--paper-200)' },
        permSwitch(key),
        h('div', { style: 'display:flex;flex-direction:column;gap:1px' },
          h('span', { style: 'font-size:13.5px;font-weight:700' }, label),
          h('span', { style: 'font-size:11.5px;color:var(--ink-500)' }, desc),
        ),
      ),
    ),
    h('div', { style: 'display:flex;align-items:center;gap:12px;padding:10px 0;border-top:2px solid var(--paper-200)' },
      h('span', { style: 'font-size:13.5px;font-weight:700;flex:1' }, 'meta semanal'),
      metaIn,
      btn('salvar', 'ghost', async () => {
        const n = parseInt(metaIn.value, 10);
        if (!n || n < 1 || n > 12) { toast('meta entre 1 e 12 posts'); return; }
        try {
          const res = await api.put('/api/settings/meta-semanal', { metaSemanal: n });
          state.metaSemanal = res.metaSemanal || n;
          toast('meta semanal → ' + (res.metaSemanal || n) + ' posts');
        } catch (e) {
          toast(e.message);
        }
      }, { h: 32 }),
    ),
  );

  // ---------- infra ----------
  const infraRow = (dotColor, name, desc, statusTxt, statusColor) =>
    h('div', { style: 'display:flex;align-items:center;gap:10px;padding:9px 0;border-top:2px solid var(--ink-700)' },
      h('span', { style: 'width:8px;height:8px;border-radius:99px;background:' + dotColor + ';flex:none' }),
      h('span', { style: 'font-family:var(--font-mono);font-size:12px;font-weight:700;width:84px' }, name),
      h('span', { style: 'font-size:12px;color:var(--ink-300);flex:1' }, desc),
      h('span', { style: 'font-family:var(--font-mono);font-size:10px;color:' + statusColor }, statusTxt),
    );

  let infraFoot = 'backend 100% edge — sem servidor dedicado.';
  if (infra.demoMode) infraFoot += ' modo demo ativo — conecte páginas reais em páginas.';
  infraFoot += infra.metaConfigured ? ' graph api configurada ✓' : ' graph api aguardando credenciais.';

  const infraCard = h('div', { style: 'background:var(--ink-900);color:var(--paper-50);border:2px solid var(--ink-900);border-radius:16px;box-shadow:4px 4px 0 0 ' + ACC + ';padding:18px;display:flex;flex-direction:column;gap:2px' },
    h('span', { style: 'font-family:var(--font-mono);font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--lime-500);padding-bottom:8px' }, 'infra · cloudflare edge'),
    infraRow('var(--lime-500)', 'workers', 'api + sync graph', 'operacional', 'var(--lime-500)'),
    infraRow('var(--lime-500)', 'kv', 'sessões + cache de métricas', 'operacional', 'var(--lime-500)'),
    infraRow('var(--lime-500)', 'd1', 'placar-mira · ' + K(infra.posts) + ' posts · ' + K(infra.metrics) + ' métricas', 'operacional', 'var(--lime-500)'),
    infraRow('var(--amber-500)', 'cron', 'sync a cada 30 min · última ' + agoShort(infra.lastSync), 'rodando', 'var(--amber-500)'),
    h('span', { style: 'font-size:11.5px;color:var(--ink-300);padding-top:10px' }, infraFoot),
  );

  const bottomGrid = h('div', { style: 'display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:14px;align-items:start' },
    permsCard,
    infraCard,
  );

  return section('Configurações', header, membersCard, bottomGrid);
}
