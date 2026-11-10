/** A color in the HSV model: hue in degrees (0-360), saturation and value in percent (0-100). */
export interface Hsv {
  h: number;
  s: number;
  v: number;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/**
 * Normalizes a hex color to the lowercase `#rrggbb` form.
 * Accepts `#rgb`, `#rrggbb` and the same without `#`; returns `null` for anything else.
 */
export const normalizeHex = (input: string): string | null => {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(input.trim());
  if (!match) return null;

  const digits = match[1].toLowerCase();
  const full =
    digits.length === 3
      ? digits
          .split("")
          .map((digit) => digit + digit)
          .join("")
      : digits;

  return `#${full}`;
};

export const hexToHsv = (hex: string): Hsv => {
  const normalized = normalizeHex(hex) ?? "#000000";
  const r = Number.parseInt(normalized.slice(1, 3), 16) / 255;
  const g = Number.parseInt(normalized.slice(3, 5), 16) / 255;
  const b = Number.parseInt(normalized.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const delta = max - Math.min(r, g, b);

  let h = 0;
  if (delta !== 0) {
    if (max === r) h = ((g - b) / delta) % 6;
    else if (max === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
  }

  return {
    h: (h * 60 + 360) % 360,
    s: max === 0 ? 0 : (delta / max) * 100,
    v: max * 100,
  };
};

export const hsvToHex = ({ h, s, v }: Hsv): string => {
  const saturation = clamp(s, 0, 100) / 100;
  const value = clamp(v, 0, 100) / 100;
  const channel = (n: number) => {
    const k = (n + clamp(h, 0, 360) / 60) % 6;
    const component =
      value - value * saturation * Math.max(0, Math.min(k, 4 - k, 1));
    return Math.round(component * 255)
      .toString(16)
      .padStart(2, "0");
  };

  return `#${channel(5)}${channel(3)}${channel(1)}`;
};

export const clampHsv = ({ h, s, v }: Hsv): Hsv => ({
  h: clamp(h, 0, 360),
  s: clamp(s, 0, 100),
  v: clamp(v, 0, 100),
});
