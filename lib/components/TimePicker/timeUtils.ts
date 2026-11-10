// Parsing for TimePicker, kept apart so the component file only exports components.

const pad = (n: number) => String(n).padStart(2, "0");

/** `HH:mm` (seconds ignored) to minutes since midnight, or `null`. */
export const parseTime = (value?: string | null): number | null => {
  const match = /^(\d{1,2}):(\d{2})/.exec((value ?? "").trim());
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  return h < 24 && m < 60 ? h * 60 + m : null;
};

export const formatTime = (minutes: number) =>
  `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;

/** Typed text as minutes once complete: `09:30`, `9:30`, `0930`. */
export const parseTypedTime = (text: string): number | null => {
  const value = text.trim();
  if (/^\d{4}$/.test(value))
    return parseTime(`${value.slice(0, 2)}:${value.slice(2)}`);
  return /^\d{1,2}:\d{2}$/.test(value) ? parseTime(value) : null;
};

// Digits become hh:mm as they are typed; a loose `9:3` is left as written.
export const maskTypedTime = (raw: string) => {
  if (/^\d:\d{0,2}$/.test(raw)) return raw;
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2
    ? `${digits.slice(0, 2)}:${digits.slice(2)}`
    : digits;
};
