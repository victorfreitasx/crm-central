// renderizador da arte final (1080×1350) + zip sem compressão pro export.
// O layout é TRAVADO no padrão da rede: mesma fonte, margens e balão do preview.

const W = 1080;
const H = 1350;
const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

function wrap(ctx, text, maxW) {
  const out = [];
  for (const rawLine of String(text || '').split('\n')) {
    let line = '';
    for (const word of rawLine.split(' ')) {
      const probe = line ? line + ' ' + word : word;
      if (ctx.measureText(probe).width > maxW && line) {
        out.push(line);
        line = word;
      } else line = probe;
    }
    out.push(line);
  }
  return out;
}

function circle(ctx, x, y, r, fill) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

function verified(ctx, cx, cy, r) {
  circle(ctx, cx, cy, r, '#0095F6');
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = r * 0.24;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.42, cy + r * 0.05);
  ctx.lineTo(cx - r * 0.08, cy + r * 0.38);
  ctx.lineTo(cx + r * 0.5, cy - r * 0.3);
  ctx.stroke();
}

function coverDraw(ctx, img, x, y, w, hh) {
  const s = Math.max(w / img.width, hh / img.height);
  const dw = img.width * s, dh = img.height * s;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, hh);
  ctx.clip();
  ctx.drawImage(img, x + (w - dw) / 2, y + (hh - dh) / 2, dw, dh);
  ctx.restore();
}

function roundRect(ctx, x, y, w, hh, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + hh, r);
  ctx.arcTo(x + w, y + hh, x, y + hh, r);
  ctx.arcTo(x, y + hh, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function gridRects(frame, yStart) {
  const gap = 10;
  const areaH = H - yStart;
  const full = { x: 0, y: yStart, w: W, h: areaH };
  if (frame === '2h') {
    const hh = (areaH - gap) / 2;
    return [ { x: 0, y: yStart, w: W, h: hh }, { x: 0, y: yStart + hh + gap, w: W, h: hh } ];
  }
  if (frame === '2v') {
    const w = (W - gap) / 2;
    return [ { x: 0, y: yStart, w, h: areaH }, { x: w + gap, y: yStart, w, h: areaH } ];
  }
  if (frame === '3') {
    const w = (W - gap) / 2;
    const hh = (areaH - gap) / 2;
    return [
      { x: 0, y: yStart, w, h: hh },
      { x: w + gap, y: yStart, w, h: hh },
      { x: 0, y: yStart + hh + gap, w: W, h: hh },
    ];
  }
  return [full];
}

async function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/**
 * Renderiza um slide na arte final 1080×1350.
 * slide: {frame, media:[srcs]} · header: só o slide 0 leva nome/título/texto/balão.
 * pageInfo: {nome, letter, color, fg} · comment: {nome, letter, color, fg, text} | null
 */
export async function renderSlide({ slide, isHeader, page, title, text, comment, dots }) {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, W, H);

  let yStart = 0;
  if (isHeader) {
    const px = 48, py = 48;
    // avatar da página
    circle(ctx, px + 70, py + 70, 70, page.color);
    ctx.fillStyle = page.fg;
    ctx.font = `800 ${140 * 0.44}px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(page.letter, px + 70, py + 74);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';

    const tx = px + 140 + 44;
    const maxW = W - tx - px;
    let y = py + 46;
    // nome + selo
    ctx.fillStyle = '#050505';
    ctx.font = `700 63px ${FONT}`;
    const nome = page.nome;
    let nw = ctx.measureText(nome).width;
    if (nw > maxW - 74) { nw = maxW - 74; }
    ctx.save();
    ctx.beginPath();
    ctx.rect(tx, y - 60, maxW - 74, 80);
    ctx.clip();
    ctx.fillText(nome, tx, y);
    ctx.restore();
    verified(ctx, tx + Math.min(nw, maxW - 74) + 18 + 28, y - 22, 28);
    y += 24;
    // título (opcional, negrito) + texto
    if (title && title.trim()) {
      ctx.font = `700 58px ${FONT}`;
      for (const line of wrap(ctx, title, maxW)) {
        y += 58 * 1.24;
        ctx.fillText(line, tx, y);
      }
    }
    if (text && text.trim()) {
      ctx.font = `400 58px ${FONT}`;
      for (const line of wrap(ctx, text, maxW)) {
        y += 58 * 1.24;
        ctx.fillText(line, tx, y);
      }
    }
    yStart = Math.max(py + 140, y) + 40;
  }

  // grade de imagens
  const rects = gridRects(slide.frame || '1', yStart);
  for (let i = 0; i < rects.length; i++) {
    const r = rects[i];
    ctx.fillStyle = '#EFEFEF';
    ctx.fillRect(r.x, r.y, r.w, r.h);
    const src = slide.media?.[i];
    if (src) {
      const img = await loadImage(src);
      if (img) coverDraw(ctx, img, r.x, r.y, r.w, r.h);
    }
  }

  // balão de comentário (igual ao feed)
  if (isHeader && comment && comment.text) {
    const bx = 48, bw = Math.min(930, W - 96);
    ctx.font = `400 48px ${FONT}`;
    const innerW = bw - 26 - 110 - 26 - 46;
    const lines = wrap(ctx, comment.text, innerW);
    const bh = 28 + Math.max(110, 52 * 1.2 + lines.length * 48 * 1.25) + 26;
    const by = H - 96 - bh;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.22)';
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 10;
    roundRect(ctx, bx, by, bw, bh, 44);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.restore();
    circle(ctx, bx + 26 + 55, by + 26 + 55, 55, comment.color);
    ctx.fillStyle = comment.fg;
    ctx.font = `800 ${110 * 0.44}px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(comment.letter, bx + 26 + 55, by + 26 + 58);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    const cx0 = bx + 26 + 110 + 26;
    let cy = by + 26 + 44;
    ctx.fillStyle = '#050505';
    ctx.font = `700 52px ${FONT}`;
    const cnw = ctx.measureText(comment.nome).width;
    ctx.fillText(comment.nome, cx0, cy);
    verified(ctx, cx0 + cnw + 14 + 22, cy - 16, 22);
    ctx.font = `400 48px ${FONT}`;
    for (const line of lines) {
      cy += 48 * 1.25;
      ctx.fillText(line, cx0, cy);
    }
  }

  // pontinhos do carrossel
  if (dots && dots.total > 1) {
    const gap = 12, r = 9;
    const totalW = dots.total * r * 2 + (dots.total - 1) * gap;
    let x = (W - totalW) / 2 + r;
    for (let i = 0; i < dots.total; i++) {
      circle(ctx, x, H - 26 - r, r, i === dots.active ? '#FFFFFF' : 'rgba(255,255,255,0.45)');
      ctx.strokeStyle = 'rgba(0,0,0,0.18)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      x += r * 2 + gap;
    }
  }

  return canvas;
}

export function canvasToBlob(canvas) {
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
}

// ---------- zip (método STORE, sem compressão) ----------
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(bytes) {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

export async function makeZip(files) {
  // files: [{name, blob}]
  const encoder = new TextEncoder();
  const parts = [];
  const central = [];
  let offset = 0;

  for (const f of files) {
    const data = new Uint8Array(await f.blob.arrayBuffer());
    const name = encoder.encode(f.name);
    const crc = crc32(data);
    const local = new DataView(new ArrayBuffer(30));
    local.setUint32(0, 0x04034b50, true);
    local.setUint16(4, 20, true);
    local.setUint16(8, 0, true); // STORE
    local.setUint32(14, crc, true);
    local.setUint32(18, data.length, true);
    local.setUint32(22, data.length, true);
    local.setUint16(26, name.length, true);
    parts.push(new Uint8Array(local.buffer), name, data);

    const cd = new DataView(new ArrayBuffer(46));
    cd.setUint32(0, 0x02014b50, true);
    cd.setUint16(4, 20, true);
    cd.setUint16(6, 20, true);
    cd.setUint32(16, crc, true);
    cd.setUint32(20, data.length, true);
    cd.setUint32(24, data.length, true);
    cd.setUint16(28, name.length, true);
    cd.setUint32(42, offset, true);
    central.push(new Uint8Array(cd.buffer), name);
    offset += 30 + name.length + data.length;
  }

  const cdSize = central.reduce((s, b) => s + b.length, 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true);
  end.setUint16(8, files.length, true);
  end.setUint16(10, files.length, true);
  end.setUint32(12, cdSize, true);
  end.setUint32(16, offset, true);
  return new Blob([...parts, ...central, new Uint8Array(end.buffer)], { type: 'application/zip' });
}

export function download(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}
