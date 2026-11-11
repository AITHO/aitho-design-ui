// Parsing for TimePicker, kept apart so the component file only exports components.
// Times are seconds since midnight, so `HH:mm:ss` values keep their seconds.

const pad = (n: number) => String(n).padStart(2, "0");

/** `HH:mm` or `HH:mm:ss` (fractions of a second ignored) to seconds since midnight, or `null`. */
export const parseTime = (value?: string | null): number | null => {
  const match = /^(\d{1,2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?$/.exec(
    (value ?? "").trim(),
  );
  if (!match) return null;
  const h = Number(match[1]);
  const m = Number(match[2]);
  const s = Number(match[3] ?? 0);
  return h < 24 && m < 60 && s < 60 ? h * 3600 + m * 60 + s : null;
};

/** Seconds since midnight as `HH:mm`, or `HH:mm:ss` with `withSeconds`. */
export const formatTime = (seconds: number, withSeconds = false) => {
  const hm = `${pad(Math.floor(seconds / 3600))}:${pad(Math.floor(seconds / 60) % 60)}`;
  return withSeconds ? `${hm}:${pad(seconds % 60)}` : hm;
};

/**
 * Typed text as seconds once complete: `09:30`, `9:30`, `0930`, and with `withSeconds` also
 * `09:30:45` and `093045` (a time without seconds then counts as `:00`).
 */
export const parseTypedTime = (
  text: string,
  withSeconds = false,
): number | null => {
  const value = text.trim();
  if (/^\d{4}$/.test(value))
    return parseTime(`${value.slice(0, 2)}:${value.slice(2)}`);
  if (withSeconds && /^\d{6}$/.test(value))
    return parseTime(
      `${value.slice(0, 2)}:${value.slice(2, 4)}:${value.slice(4)}`,
    );
  const pattern = withSeconds ? /^\d{1,2}:\d{2}(:\d{2})?$/ : /^\d{1,2}:\d{2}$/;
  return pattern.test(value) ? parseTime(value) : null;
};

// Digits become hh:mm (or hh:mm:ss) as they are typed; a loose `9:3` is left as written.
export const maskTypedTime = (raw: string, withSeconds = false) => {
  if (/^\d:\d{0,2}$/.test(raw)) return raw;
  const digits = raw.replace(/\D/g, "").slice(0, withSeconds ? 6 : 4);
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)]
    .filter(Boolean)
    .join(":");
};
