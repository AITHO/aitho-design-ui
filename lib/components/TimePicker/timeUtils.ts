// Parsing for TimePicker, kept apart so the component file only exports components.
// Times are milliseconds since midnight, so `HH:mm:ss.sss` values keep every digit.

/** How much of a time the field shows and keeps, as a native time input does for its `step`. */
export type TimePrecision = "minutes" | "seconds" | "milliseconds";

const pad = (n: number, size = 2) => String(n).padStart(size, "0");

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;

/** Typed digits per precision: `hhmm`, `hhmmss`, `hhmmsssss`. */
const DIGITS: Record<TimePrecision, number> = {
  minutes: 4,
  seconds: 6,
  milliseconds: 9,
};

/** `HH:mm`, `HH:mm:ss` or `HH:mm:ss.sss` to milliseconds since midnight, or `null`. */
export const parseTime = (value?: string | null): number | null => {
  const match = /^(\d{1,2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?$/.exec(
    (value ?? "").trim(),
  );
  if (!match) return null;
  const [h, m, s] = [match[1], match[2], match[3] ?? "0"].map(Number);
  const ms = Number((match[4] ?? "").padEnd(3, "0"));
  return h < 24 && m < 60 && s < 60
    ? h * HOUR + m * MINUTE + s * 1000 + ms
    : null;
};

/** The precision a value is written in: `10:30` minutes, `10:30:45` seconds, `.123` milliseconds. */
export const precisionOfValue = (value?: string | null): TimePrecision => {
  if (/:\d{2}:\d{2}\.\d/.test(value ?? "")) return "milliseconds";
  return /:\d{2}:\d{2}/.test(value ?? "") ? "seconds" : "minutes";
};

/** The finer of two precisions, so a value is never shown with less than it has. */
export const finerPrecision = (a: TimePrecision, b: TimePrecision) =>
  DIGITS[a] >= DIGITS[b] ? a : b;

/** Milliseconds since midnight as `HH:mm`, `HH:mm:ss` or `HH:mm:ss.sss`. */
export const formatTime = (
  time: number,
  precision: TimePrecision = "minutes",
) => {
  const hm = `${pad(Math.floor(time / HOUR))}:${pad(Math.floor(time / MINUTE) % 60)}`;
  if (precision === "minutes") return hm;
  const hms = `${hm}:${pad(Math.floor(time / 1000) % 60)}`;
  return precision === "seconds" ? hms : `${hms}.${pad(time % 1000, 3)}`;
};

/** The length of a complete time in the field: `hh:mm`, `hh:mm:ss`, `hh:mm:ss.sss`. */
export const timeLength = (precision: TimePrecision) =>
  formatTime(0, precision).length;

// Digits become hh:mm, hh:mm:ss or hh:mm:ss.sss as they are typed; a loose `9:3` stays as written.
export const maskTypedTime = (
  raw: string,
  precision: TimePrecision = "minutes",
) => {
  if (/^\d:\d{0,2}$/.test(raw)) return raw;
  const digits = raw.replace(/\D/g, "").slice(0, DIGITS[precision]);
  const hms = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 6)]
    .filter(Boolean)
    .join(":");
  return digits.length > 6 ? `${hms}.${digits.slice(6)}` : hms;
};

const COMPLETE: Record<TimePrecision, RegExp> = {
  minutes: /^\d{1,2}:\d{2}$/,
  seconds: /^\d{1,2}:\d{2}:\d{2}$/,
  milliseconds: /^\d{1,2}:\d{2}:\d{2}\.\d{3}$/,
};

const parseTypedComplete = (value: string, precision: TimePrecision) =>
  COMPLETE[precision].test(value) ? parseTime(value) : null;

/**
 * Typed text as a time, only once complete for the precision: `09:30` or `0930` in minutes,
 * `09:30:45` or `093045` in seconds, `09:30:45.123` or `093045123` in milliseconds. A shorter
 * time is still being typed (on leaving the field, parseTime accepts it).
 */
export const parseTypedTime = (
  text: string,
  precision: TimePrecision = "minutes",
): number | null => {
  const value = text.trim();
  const digits = DIGITS[precision];
  if (new RegExp(`^\\d{${digits}}$`).test(value)) {
    return parseTime(maskTypedTime(value, precision));
  }
  return value.length === timeLength(precision) || /^\d:/.test(value) // a loose 9:30 (one hour digit) in minutes
    ? parseTypedComplete(value, precision)
    : null;
};
