/**
 * Names of the CSS custom properties defined per theme in lib/main.css.
 * Keep this list in sync manually with lib/main.css whenever a token is
 * added, renamed or removed there (same convention already used between
 * panda.config.ts and lib/main.css).
 */
export const BRAND_TOKEN_NAMES = [
  "color-primary",
  "color-primary-hover",
  "color-primary-active",
  "color-primary-disabled",
  "color-primary-opacity-20",
  "color-primary-opacity-50",

  "text-primary",
  "text-secondary",
  "text-on-primary",

  "background-primary",
  "background-secondary",
  "background-tertiary",
  "background-contrast",
  "background-overlay",

  "color-error",
  "color-error-hover",
  "color-error-opacity-80",
  "color-attention",
  "color-attention-hover",
  "color-warning",
  "color-warning-hover",
  "color-success",
  "color-success-hover",
  "color-info",
  "color-info-hover",

  "border-color",

  "accent",
  "white",
  "grey-light",
  "light",
  "dark",
  "transparent",
  "background-popup",
  "text-on-popup",
  "checkbox-square-color",
  "table-base-color",
  "table-striped-color",
] as const;

export type BrandTokenName = (typeof BRAND_TOKEN_NAMES)[number];

export type BrandPalette = Partial<Record<BrandTokenName, string>>;

export interface BrandTokens {
  light?: BrandPalette;
  dark?: BrandPalette;
}
