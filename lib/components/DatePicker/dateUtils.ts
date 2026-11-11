// Pure day arithmetic and parsing for DatePicker, kept apart so the component file only exports components.
export type Lang = "it" | "en";
/** Calendar day, `m` zero-based like `Date`. */
export interface Ymd {
  y: number;
  m: number;
  d: number;
}

export const pad = (n: number) => String(n).padStart(2, "0");
export const daysInMonth = (y: number, m: number) =>
  new Date(y, m + 1, 0).getDate();
export const isValidYmd = ({ y, m, d }: Ymd) =>
  y >= 1000 &&
  y <= 9999 &&
  m >= 0 &&
  m <= 11 &&
  d >= 1 &&
  d <= daysInMonth(y, m);
export const fromDate = (date: Date): Ymd => ({
  y: date.getFullYear(),
  m: date.getMonth(),
  d: date.getDate(),
});
export const addDays = ({ y, m, d }: Ymd, days: number) =>
  fromDate(new Date(y, m, d + days));
// Same day in another month, clamped to that month's length (31 Jan + 1 month = 28/29 Feb).
export const addMonths = ({ y, m, d }: Ymd, months: number): Ymd => {
  const first = new Date(y, m + months, 1);
  return {
    y: first.getFullYear(),
    m: first.getMonth(),
    d: Math.min(d, daysInMonth(first.getFullYear(), first.getMonth())),
  };
};

export const toIsoDate = ({ y, m, d }: Ymd) => `${y}-${pad(m + 1)}-${pad(d)}`;

/** Reads `YYYY-MM-DD` (anything after the date, like a time, is ignored). */
export const parseIsoDate = (value?: string | null): Ymd | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value ?? "");
  if (!match) return null;
  const ymd = {
    y: Number(match[1]),
    m: Number(match[2]) - 1,
    d: Number(match[3]),
  };
  return isValidYmd(ymd) ? ymd : null;
};

export const toDisplay = (ymd: Ymd | null) =>
  ymd ? `${pad(ymd.d)}/${pad(ymd.m + 1)}/${ymd.y}` : "";

/**
 * What the user typed, as a complete day or `null` while it is still partial.
 * Accepts `15/01/2026`, `15012026`, `1.2.2026`, `1-2-2026` and an ISO `2026-01-15`.
 */
export const parseTypedDate = (text: string): Ymd | null => {
  const value = text.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return parseIsoDate(value);
  const parts = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/.exec(value);
  let ymd: Ymd | null = null;
  if (parts) {
    ymd = { d: Number(parts[1]), m: Number(parts[2]) - 1, y: Number(parts[3]) };
  } else if (/^\d{8}$/.test(value)) {
    ymd = {
      d: Number(value.slice(0, 2)),
      m: Number(value.slice(2, 4)) - 1,
      y: Number(value.slice(4)),
    };
  }
  return ymd && isValidYmd(ymd) ? ymd : null;
};

// Digits only become dd/mm/yyyy as they are typed; a loose `1/2/2026` is left as written.
export const maskTyped = (raw: string) => {
  if (
    /^\d{1,2}[/.-]\d{1,2}([/.-]\d{0,4})?$/.test(raw) &&
    !/^\d{2}\/\d{2}/.test(raw)
  ) {
    return raw;
  }
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (digits.length > 4)
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
};

export const resolveLang = (lang?: string): Lang => {
  const source =
    lang ||
    (typeof document !== "undefined" ? document.documentElement.lang : "") ||
    "";
  return source.toLowerCase().startsWith("it") ? "it" : "en";
};
