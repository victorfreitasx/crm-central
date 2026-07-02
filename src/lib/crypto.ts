// Criptografia dos tokens de página (AES-256-GCM) — chave derivada de SESSION_SECRET.
// Nunca gravamos token da Graph API em texto puro no D1.

const enc = new TextEncoder();
const dec = new TextDecoder();

async function key(secret: string): Promise<CryptoKey> {
  const digest = await crypto.subtle.digest('SHA-256', enc.encode(secret));
  return crypto.subtle.importKey('raw', digest, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
}

function b64(buf: ArrayBuffer | Uint8Array): string {
  const b = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = '';
  for (const x of b) s += String.fromCharCode(x);
  return btoa(s);
}

function unb64(s: string): Uint8Array {
  const raw = atob(s);
  const b = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) b[i] = raw.charCodeAt(i);
  return b;
}

export async function encrypt(secret: string, plaintext: string): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const k = await key(secret);
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, k, enc.encode(plaintext));
  return b64(iv) + '.' + b64(ct);
}

export async function decrypt(secret: string, payload: string): Promise<string> {
  const [ivB, ctB] = payload.split('.');
  if (!ivB || !ctB) throw new Error('payload inválido');
  const k = await key(secret);
  const pt = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: unb64(ivB) as unknown as BufferSource },
    k,
    unb64(ctB) as unknown as BufferSource,
  );
  return dec.decode(pt);
}

/** HMAC-SHA256 (hex) — assina o state do OAuth da Meta. */
export async function hmac(secret: string, data: string): Promise<string> {
  const k = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', k, enc.encode(data));
  return [...new Uint8Array(sig)].map((x) => x.toString(16).padStart(2, '0')).join('');
}

export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}
