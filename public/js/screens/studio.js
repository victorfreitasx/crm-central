// estúdio — monta teu post: layout travado no padrão da rede (fonte, margens e
// balão fixos). Só escolhe página, texto, moldura, imagens e comentário.
import { h, api, state, page, accessPages, isGestor, go, toast, ACC, fgFor, monoLabel, btn, svgEl } from '../core.js';
import { section, openScheduleModal } from '../shell.js';
import { renderSlide, canvasToBlob, makeZip, download } from '../studio-render.js';

const GRID_DEF = {
  '1': { cols: '1fr', rows: '1fr', n: 1 },
  '2h': { cols: '1fr', rows: '1fr 1fr', n: 2 },
  '2v': { cols: '1fr 1fr', rows: '1fr', n: 2 },
  '3': { cols: '1fr 1fr', rows: '1fr 1fr', n: 3 },
};
const FRAMES = [['1', '1 imagem'], ['2h', '2 empilhadas'], ['2v', '2 lado a lado'], ['3', '3 imagens']];

const letterOf = (pg) => (pg.nome.split(' ')[1] ? pg.nome.split(' ')[1][0] : pg.nome[0] || 'm');

function ensureStudio() {
  if (!state.studio) {
    const acc = accessPages();
    state.studio = {
      postId: null,
      page: acc[0]?.id,
      title: '',
      text: 'Mauricio de Sousa foi homenageado com uma estátua de bronze na Avenida Paulista em celebração aos seus 90 anos.',
      cOn: false,
      cPage: state.pages[1]?.id || state.pages[0]?.id,
      cText: 'Merecidíssimo! Um gênio dos quadrinhos.',
      tipo: 'unico',
      slides: [{ frame: '1', media: [] }],
      active: 0,
      caption: '',
    };
  }
  // célula de mídia: {key?, url?, blob?}
  for (const sl of state.studio.slides) {
    sl.media = (sl.media || []).map((m) => (typeof m === 'string' ? { key: m, url: '/media/' + m } : m));
  }
  return state.studio;
}

const verifiedSvg = (size) =>
  svgEl('svg', { width: size, height: size, viewBox: '0 0 24 24', style: 'flex:none' },
    svgEl('circle', { cx: 12, cy: 12, r: 11, fill: '#0095F6' }),
    svgEl('path', { d: 'M7 12.5l3 3 7-7', fill: 'none', stroke: '#FFFFFF', 'stroke-width': 2.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
  );

export async function studioScreen() {
  const s = ensureStudio();
  const wrap = h('div', {});

  const inputCss = 'border:2px solid var(--ink-900);border-radius:10px;background:var(--paper-0);padding:0 10px;font-family:var(--font-sans);font-size:13px;outline:none;box-shadow:2px 2px 0 0 var(--ink-900)';
  const selectCss = 'height:38px;border:2px solid var(--ink-900);border-radius:10px;background:var(--paper-0);font-family:var(--font-mono);font-size:11px;font-weight:700;padding:0 8px;cursor:pointer;box-shadow:2px 2px 0 0 var(--ink-900)';
  const boxCss = 'background:var(--paper-0);border:2px solid var(--ink-900);border-radius:16px;box-shadow:3px 3px 0 0 var(--ink-900);padding:14px;display:flex;flex-direction:column;gap:10px';
  const stepLabel = (t) => h('span', { style: 'font-family:var(--font-mono);font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-500)' }, t);

  function mut() {
    render();
  }

  // ---------- salvar / publicar / exportar ----------
  let busy = false;

  async function persistDraft() {
    const body = {
      page_id: s.page,
      fmt: s.tipo === 'carrossel' ? 'carrossel' : 'feed',
      title: s.title,
      text: s.text,
      caption: s.caption,
      comment_on: s.cOn,
      comment_page_id: s.cPage,
      comment_text: s.cText,
      slides: s.slides.map((sl) => ({ frame: sl.frame, media: sl.media.filter((m) => m && m.key).map((m) => m.key) })),
    };
    if (s.postId) await api.put('/api/posts/' + s.postId, body);
    else s.postId = (await api.post('/api/posts', body)).id;

    // sobe imagens novas das células
    for (let i = 0; i < s.slides.length; i++) {
      const sl = s.slides[i];
      for (let j = 0; j < sl.media.length; j++) {
        const cell = sl.media[j];
        if (cell && cell.blob && !cell.key) {
          const res = await api.upload(`/api/posts/${s.postId}/media?slide=${i}&cell=${j}`, cell.blob, cell.blob.type || 'image/png');
          cell.key = res.key;
        }
      }
    }
    // renderiza e sobe a arte final de cada slide (é ela que vai pro Instagram)
    for (let i = 0; i < s.slides.length; i++) {
      const blob = await renderArt(i);
      if (blob) await api.upload(`/api/posts/${s.postId}/media?slide=${i}&cell=art`, blob, 'image/png');
    }
    return s.postId;
  }

  async function renderArt(i) {
    const sl = s.slides[i];
    const pg = page(s.page);
    const cpg = page(s.cPage);
    const canvas = await renderSlide({
      slide: { frame: sl.frame, media: sl.media.map((m) => (m ? m.url : null)) },
      isHeader: i === 0,
      page: { nome: pg.nome, letter: letterOf(pg), color: pg.color, fg: pg.fg },
      title: s.title,
      text: s.text,
      comment: i === 0 && s.cOn && s.cText ? { nome: cpg.nome, letter: letterOf(cpg), color: cpg.color, fg: cpg.fg, text: s.cText } : null,
      dots: s.tipo === 'carrossel' ? { total: s.slides.length, active: i } : null,
    });
    return canvasToBlob(canvas);
  }

  async function saveDraft() {
    if (busy) return;
    busy = true;
    try {
      await persistDraft();
      toast('rascunho salvo — tá na lista de posts');
    } catch (e) {
      toast(e.message);
    } finally {
      busy = false;
    }
  }

  async function send() {
    if (busy) return;
    busy = true;
    try {
      const id = await persistDraft();
      busy = false;
      openScheduleModal({ id, page_id: s.page }, (mode) => {
        state.studio = null;
        if (mode === 'agora') {
          toast('enviado pro instagram — primeira sync de métricas em ~30 min');
          go('/posts');
        } else {
          toast('post agendado ✓');
          go('/agenda');
        }
      });
    } catch (e) {
      busy = false;
      toast(e.message);
    }
  }

  async function exportZip() {
    if (busy) return;
    busy = true;
    try {
      const files = [];
      for (let i = 0; i < s.slides.length; i++) {
        const blob = await renderArt(i);
        if (blob) files.push({ name: `arte-${String(i + 1).padStart(2, '0')}.png`, blob });
      }
      download(await makeZip(files), 'placar-post.zip');
      toast(`gerando ${files.length} arte(s) em 1080×1350 — placar-post.zip baixado`);
    } catch (e) {
      toast(e.message);
    } finally {
      busy = false;
    }
  }

  // ---------- render ----------
  function render() {
    const pgs = accessPages();
    if (!pgs.find((p) => p.id === s.page)) s.page = pgs[0]?.id;
    if (s.active >= s.slides.length) s.active = 0;
    const pg = page(s.page);
    const cpg = page(s.cPage);
    const slide = s.slides[s.active] || s.slides[0];
    const isCar = s.tipo === 'carrossel';
    const header = s.active === 0;
    const gd = GRID_DEF[slide.frame || '1'];

    // tabs tipo
    const tipoTabs = h('div', { style: 'display:flex;border:2px solid var(--ink-900);border-radius:999px;background:var(--paper-0);padding:3px;gap:3px;box-shadow:2px 2px 0 0 var(--ink-900)' },
      [['unico', 'post único'], ['carrossel', 'carrossel']].map(([id, label]) =>
        h('span', {
          class: 'pl-btn',
          style: `padding:8px 16px;border-radius:999px;font-weight:700;font-size:13px;${s.tipo === id ? 'background:var(--ink-900);color:var(--paper-50)' : 'color:var(--ink-700)'}`,
          onclick: () => { s.tipo = id; if (id === 'unico') s.active = 0; mut(); },
        }, label)),
    );

    // 1 · página
    const pageSel = h('select', { style: selectCss, onchange: (e) => { s.page = e.target.value; mut(); } },
      pgs.map((p) => h('option', { value: p.id }, p.handle)));
    pageSel.value = s.page;

    const box1 = h('div', { style: boxCss },
      stepLabel('1 · perfil da página'),
      pageSel,
      h('div', { style: 'display:flex;align-items:center;gap:10px' },
        h('span', { style: { width: '34px', height: '34px', borderRadius: '999px', background: pg.color, color: pg.fg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '15px', flex: 'none', border: '2px solid var(--ink-900)', fontFamily: 'var(--font-display)' } }, letterOf(pg)),
        h('div', { style: 'display:flex;flex-direction:column;min-width:0' },
          h('div', { style: 'display:flex;align-items:center;gap:5px' },
            h('span', { style: 'font-weight:700;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis' }, pg.nome),
            verifiedSvg(15),
          ),
          h('span', { style: 'font-family:var(--font-mono);font-size:10px;color:var(--ink-500)' }, pg.handle),
        ),
      ),
      h('span', { style: 'font-size:11px;color:var(--ink-500)' },
        isGestor() ? 'como gestor, você publica em qualquer página da rede.' : 'você só vê as páginas que o gestor liberou pro seu acesso.'),
    );

    // 2 · texto
    const titleIn = h('input', { style: 'height:36px;font-weight:700;' + inputCss, placeholder: 'título em negrito (opcional)', value: s.title, oninput: (e) => { s.title = e.target.value; updatePreviewText(); } });
    const textIn = h('textarea', { rows: 5, style: 'width:100%;padding:8px 10px;resize:vertical;' + inputCss, placeholder: 'o texto do post — entra abaixo do nome, fonte e posição travadas', oninput: (e) => { s.text = e.target.value; updatePreviewText(); } }, s.text);
    const box2 = h('div', { style: boxCss.replace('gap:10px', 'gap:8px') }, stepLabel('2 · texto (zona branca)'), titleIn, textIn);

    // 3 · moldura
    const box3 = h('div', { style: boxCss },
      stepLabel('3 · moldura da arte ' + (isCar ? '· arte ' + (s.active + 1) : '')),
      h('div', { style: 'display:grid;grid-template-columns:repeat(4,1fr);gap:8px' },
        FRAMES.map(([id, label]) => {
          const on = (slide.frame || '1') === id;
          const g = GRID_DEF[id];
          return h('div', {
            style: `display:flex;flex-direction:column;align-items:center;gap:5px;padding:7px 3px;border:2px solid var(--ink-900);border-radius:10px;cursor:pointer;background:${on ? 'var(--lime-200)' : 'var(--paper-50)'};box-shadow:${on ? '2px 2px 0 0 var(--ink-900)' : 'none'}`,
            onclick: () => { slide.frame = id; mut(); },
          },
            h('div', { style: `display:grid;gap:3px;width:40px;height:48px;grid-template-columns:${g.cols};grid-template-rows:${g.rows}` },
              Array.from({ length: g.n }, (_, i) =>
                h('span', { style: `background:${on ? 'var(--ink-900)' : 'var(--ink-300)'};border-radius:3px;min-width:0;min-height:0;${id === '3' && i === 2 ? 'grid-column:1 / -1;' : ''}` })),
            ),
            h('span', { style: 'font-family:var(--font-mono);font-size:8.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.02em;text-align:center' }, label),
          );
        }),
      ),
    );

    // 4 · comentário
    const cSel = h('select', { style: selectCss.replace('height:38px', 'height:36px'), onchange: (e) => { s.cPage = e.target.value; mut(); } },
      state.pages.map((p) => h('option', { value: p.id }, p.handle)));
    cSel.value = s.cPage;
    const switchEl = h('div', {
      class: 'pl-btn',
      style: `width:46px;height:26px;border-radius:999px;border:2px solid var(--ink-900);background:${s.cOn ? 'var(--lime-500)' : 'var(--paper-100)'};position:relative;flex:none`,
      onclick: () => { s.cOn = !s.cOn; mut(); },
    }, h('span', { style: `position:absolute;top:2px;left:${s.cOn ? '22px' : '2px'};width:16px;height:16px;border-radius:999px;background:var(--ink-900);transition:left 120ms var(--ease-snap)` }));
    const box4 = h('div', { style: boxCss },
      h('div', { style: 'display:flex;align-items:center;justify-content:space-between;gap:8px' }, stepLabel('4 · comentário'), switchEl),
      s.cOn ? [
        cSel,
        h('textarea', { rows: 2, style: 'width:100%;padding:8px 10px;resize:vertical;' + inputCss, placeholder: 'o comentário da marca…', oninput: (e) => { s.cText = e.target.value; updatePreviewText(); } }, s.cText),
        h('span', { style: 'font-size:11px;color:var(--ink-500)' }, 'entra como balão sobre a imagem, igual ao feed.'),
      ] : null,
    );

    // ---------- preview ----------
    let pvTitle, pvText, pvCText;
    function updatePreviewText() {
      if (pvTitle) { pvTitle.textContent = s.title; pvTitle.style.display = s.title.trim() ? '' : 'none'; }
      if (pvText) pvText.textContent = s.text;
      if (pvCText) pvCText.textContent = s.cText;
    }

    const cellEls = Array.from({ length: gd.n }, (_, i) => {
      const cell = slide.media[i];
      const inner = cell && cell.url
        ? h('img', { src: cell.url, style: 'width:100%;height:100%;object-fit:cover;display:block' })
        : h('div', { style: 'width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#9A948E;font-size:34px;text-align:center;padding:20px' }, 'solta a imagem ' + (i + 1) + ' aqui');
      const fileIn = h('input', { type: 'file', accept: 'image/*', style: 'display:none', onchange: (e) => pick(e.target.files) });
      const pick = (files) => {
        const f = files && files[0];
        if (!f) return;
        slide.media[i] = { blob: f, url: URL.createObjectURL(f), key: null };
        mut();
      };
      return h('div', {
        style: `overflow:hidden;background:#EFEFEF;min-width:0;min-height:0;position:relative;cursor:pointer;${slide.frame === '3' && i === 2 ? 'grid-column:1 / -1;' : ''}`,
        onclick: () => fileIn.click(),
        ondragover: (e) => e.preventDefault(),
        ondrop: (e) => { e.preventDefault(); pick(e.dataTransfer.files); },
      }, inner, fileIn);
    });

    pvTitle = h('span', { style: `font-size:58px;font-weight:700;color:#050505;line-height:1.24;display:${s.title.trim() ? '' : 'none'}` }, s.title);
    pvText = h('span', { style: 'font-size:58px;font-weight:400;color:#050505;line-height:1.24;white-space:pre-wrap;overflow-wrap:break-word' }, s.text);
    pvCText = h('span', { style: 'font-size:48px;font-weight:400;color:#050505;line-height:1.25;overflow-wrap:break-word' }, s.cText);

    const artboard = h('div', { style: 'width:1080px;height:1350px;transform:scale(0.4);transform-origin:top left;position:absolute;left:0;top:0;background:#FFFFFF;display:flex;flex-direction:column;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif' },
      header ? h('div', { style: 'display:flex;gap:44px;padding:48px 48px 0 48px;flex:none' },
        h('span', { style: { width: '140px', height: '140px', borderRadius: '999px', background: pg.color, color: pg.fg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '61px', flex: 'none' } }, letterOf(pg)),
        h('div', { style: 'flex:1;min-width:0;display:flex;flex-direction:column;gap:4px' },
          h('div', { style: 'display:flex;align-items:center;gap:18px' },
            h('span', { style: 'font-size:63px;font-weight:700;letter-spacing:-0.3px;color:#050505;line-height:1.16;white-space:nowrap;overflow:hidden;text-overflow:ellipsis' }, pg.nome),
            verifiedSvg(56),
          ),
          pvTitle,
          pvText,
        ),
      ) : null,
      h('div', { style: `flex:1;min-height:0;margin-top:${header ? '40px' : '0'};display:grid;gap:10px;grid-template-columns:${gd.cols};grid-template-rows:${gd.rows}` }, cellEls),
      header && s.cOn ? h('div', { style: 'position:absolute;left:48px;bottom:96px;max-width:930px;background:#FFFFFF;border-radius:44px;box-shadow:0 10px 40px rgba(0,0,0,0.22);padding:26px 46px 28px 26px;display:flex;gap:26px;align-items:flex-start' },
        h('span', { style: { width: '110px', height: '110px', borderRadius: '999px', background: cpg.color, color: cpg.fg, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '48px', flex: 'none' } }, letterOf(cpg)),
        h('div', { style: 'display:flex;flex-direction:column;gap:2px;min-width:0' },
          h('div', { style: 'display:flex;align-items:center;gap:14px' },
            h('span', { style: 'font-size:52px;font-weight:700;color:#050505;line-height:1.2;white-space:nowrap' }, cpg.nome),
            verifiedSvg(44),
          ),
          pvCText,
        ),
      ) : null,
      isCar ? [
        h('div', { style: 'position:absolute;bottom:26px;left:0;right:0;display:flex;justify-content:center;gap:12px;pointer-events:none' },
          s.slides.map((_, i) => h('span', { style: `width:18px;height:18px;border-radius:999px;background:${i === s.active ? '#FFFFFF' : 'rgba(255,255,255,0.45)'};box-shadow:0 1px 6px rgba(0,0,0,0.35);flex:none` }))),
        h('div', { style: 'position:absolute;right:22px;top:50%;transform:translateY(-50%);width:90px;height:90px;border-radius:999px;background:rgba(255,255,255,0.92);display:flex;align-items:center;justify-content:center;font-size:50px;color:#050505;box-shadow:0 4px 18px rgba(0,0,0,0.25);pointer-events:none' }, '›'),
      ] : null,
    );

    const chips = isCar ? h('div', { style: 'display:flex;gap:6px;align-items:center;flex-wrap:wrap;justify-content:center' },
      s.slides.map((_, i) => h('span', {
        class: 'pl-btn',
        style: `height:28px;display:inline-flex;align-items:center;padding:0 10px;border:2px solid var(--ink-900);border-radius:8px;font-family:var(--font-mono);font-size:10px;font-weight:700;background:${i === s.active ? 'var(--ink-900)' : 'var(--paper-0)'};color:${i === s.active ? 'var(--paper-50)' : 'var(--ink-900)'};box-shadow:${i === s.active ? '2px 2px 0 0 ' + ACC : 'none'}`,
        onclick: () => { s.active = i; mut(); },
      }, 'arte ' + (i + 1))),
      h('span', {
        class: 'pl-hover-ink',
        style: 'height:28px;display:inline-flex;align-items:center;padding:0 10px;border:2px dashed var(--ink-500);border-radius:8px;font-family:var(--font-mono);font-size:10px;font-weight:700;cursor:pointer;color:var(--ink-500)',
        onclick: () => {
          if (s.slides.length >= 10) { toast('máx. 10 artes por carrossel'); return; }
          s.slides.push({ frame: '1', media: [] });
          s.active = s.slides.length - 1;
          mut();
        },
      }, '+ arte'),
      isCar && s.slides.length > 1 && s.active > 0 ? h('span', {
        style: 'height:28px;display:inline-flex;align-items:center;padding:0 10px;border:2px solid var(--red-500);border-radius:8px;font-family:var(--font-mono);font-size:10px;font-weight:700;cursor:pointer;color:var(--red-500)',
        onclick: () => { s.slides.splice(s.active, 1); s.active = Math.max(0, s.active - 1); mut(); },
      }, 'remover arte') : null,
    ) : null;

    const preview = h('div', { style: 'display:flex;flex-direction:column;align-items:safe center;gap:10px;background:var(--paper-100);border:2px solid var(--ink-900);border-radius:16px;padding:20px;min-height:560px;justify-content:safe center;overflow:auto' },
      chips,
      h('div', { style: 'width:432px;height:540px;flex:none;position:relative;border:2px solid var(--ink-900);box-shadow:7px 7px 0 0 var(--ink-900);overflow:hidden;background:#FFFFFF' }, artboard),
      h('span', { style: 'font-family:var(--font-mono);font-size:10px;color:var(--ink-500);letter-spacing:0.06em' }, '1080 × 1350 px · 4:5 · grade e fonte travadas — padrão da rede'),
    );

    // ---------- direita ----------
    const rowKV = (k, v) => h('div', { style: 'display:flex;justify-content:space-between;gap:8px;padding:7px 0;border-top:2px solid var(--paper-200)' },
      h('span', { style: 'font-family:var(--font-mono);font-size:10px;font-weight:700;text-transform:uppercase;color:var(--ink-500)' }, k),
      h('span', { style: 'font-family:var(--font-mono);font-size:11px;font-weight:700;text-align:right' }, v));

    const captionIn = h('textarea', { rows: 3, placeholder: 'legenda do instagram… (hashtags e link)', style: 'width:100%;border:2px solid var(--ink-700);border-radius:10px;background:var(--ink-700);color:var(--paper-50);padding:8px 10px;font-family:var(--font-sans);font-size:13px;resize:vertical;outline:none', oninput: (e) => { s.caption = e.target.value; } }, s.caption);

    const right = h('div', { style: 'display:flex;flex-direction:column;gap:14px' },
      h('div', { style: boxCss.replace('gap:10px', 'gap:2px') },
        h('span', { style: 'font-family:var(--font-mono);font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--ink-500);padding-bottom:6px' }, 'como vai sair'),
        rowKV('tipo', isCar ? 'carrossel · ' + s.slides.length + (s.slides.length === 1 ? ' arte' : ' artes') : 'post único · 4:5'),
        rowKV('página', pg.handle),
        rowKV('comentário', s.cOn ? 'sim · ' + cpg.handle : 'não'),
        rowKV('tamanho', '1080 × 1350'),
      ),
      h('div', { style: `background:var(--ink-900);border:2px solid var(--ink-900);border-radius:16px;box-shadow:4px 4px 0 0 ${ACC};padding:14px;display:flex;flex-direction:column;gap:10px` },
        h('span', { style: 'font-family:var(--font-mono);font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--lime-500)' }, 'publicação'),
        captionIn,
        h('div', { style: 'display:flex;flex-direction:column;gap:8px' },
          btn('enviar pro instagram', 'accent', send, { block: true }),
          btn('exportar .zip', 'ghost', exportZip, { block: true, style: 'color:var(--paper-50);border-color:var(--paper-50);box-shadow:none;', borderColor: 'var(--paper-50)' }),
          btn('salvar rascunho', 'ghost', saveDraft, { block: true, style: 'color:var(--paper-50);border-color:var(--paper-50);box-shadow:none;', borderColor: 'var(--paper-50)' }),
        ),
      ),
      h('div', { style: 'background:var(--paper-100);border:2px solid var(--ink-900);border-radius:16px;padding:14px;display:flex;flex-direction:column;gap:6px' },
        h('span', { style: 'font-family:var(--font-mono);font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase' }, '★ regra de ouro'),
        h('span', { style: 'font-size:12px;line-height:1.5;color:var(--ink-700)' }, 'todo post da rede sai pixel perfect no mesmo template: fonte, margens e balão travados. aqui não tem como errar.'),
      ),
    );

    wrap.replaceChildren(
      h('div', { style: 'display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap' },
        h('div', { style: 'display:flex;flex-direction:column;gap:6px' },
          h('span', { style: 'font-family:var(--font-mono);font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--ink-500)' }, '★ estúdio'),
          h('h1', { style: 'margin:0;font-family:var(--font-display);font-weight:800;font-size:40px;letter-spacing:-0.02em;line-height:0.94' }, 'monta teu post'),
          h('span', { style: 'font-size:14px;color:var(--ink-500)' }, 'o layout é travado no padrão da rede — você só escolhe página, texto, moldura e imagens.'),
        ),
        tipoTabs,
      ),
      h('div', { style: 'display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px;align-items:start' },
        h('div', { style: 'display:flex;flex-direction:column;gap:14px' }, box1, box2, box3, box4),
        preview,
        right,
      ),
    );
  }

  render();
  return section('Estúdio', wrap);
}
