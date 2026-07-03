// Cálculo de calendário no fuso da marca (não no fuso do runtime, que é UTC no
// Workers). workerd traz ICU completo, então Intl.DateTimeFormat resolve DST.
export const DEFAULT_TZ = 'America/Sao_Paulo';

interface Parts {
  y: number;
  mo: number; // 1-12
  d: number;
  hour: number;
  dow: number; // 0=domingo … 6=sábado
}

const fmtCache = new Map<string, Intl.DateTimeFormat>();
function fmt(tz: string): Intl.DateTimeFormat {
  let f = fmtCache.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      weekday: 'short',
    });
    fmtCache.set(tz, f);
  }
  return f;
}

const DOW: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

export function localParts(ts: number, tz = DEFAULT_TZ): Parts {
  const parts: Record<string, string> = {};
  for (const p of fmt(tz).formatToParts(new Date(ts))) parts[p.type] = p.value;
  return {
    y: +(parts.year ?? '1970'),
    mo: +(parts.month ?? '1'),
    d: +(parts.day ?? '1'),
    hour: +(parts.hour ?? '0') % 24,
    dow: DOW[parts.weekday ?? 'Thu'] ?? 4,
  };
}

/** Offset (ms) entre o horário de parede no fuso e o UTC, no instante ts. */
function offsetMs(ts: number, tz: string): number {
  const p = localParts(ts, tz);
  const asUTC = Date.UTC(p.y, p.mo - 1, p.d, p.hour, 0, 0) + (ts % 3600000); // preserva min/seg via resto
  return asUTC - ts;
}

/** Epoch ms da meia-noite local do dia de ts (no fuso dado). */
export function localMidnight(ts: number, tz = DEFAULT_TZ): number {
  const p = localParts(ts, tz);
  const off = offsetMs(ts, tz);
  return Date.UTC(p.y, p.mo - 1, p.d, 0, 0, 0) - off;
}

/** Segunda-feira 00:00 local da semana de ts. */
export function weekStartTz(ts: number, tz = DEFAULT_TZ): number {
  const p = localParts(ts, tz);
  const midnight = localMidnight(ts, tz);
  const mondayIndex = (p.dow + 6) % 7; // 0 = segunda
  return midnight - mondayIndex * 86400000;
}
