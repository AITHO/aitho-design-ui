import { defineConfig } from "@pandacss/dev";
import { preset } from "./lib/preset";
import { keyframes } from "./lib/keyframes";

export default defineConfig({
  presets: ["@pandacss/preset-base", "@pandacss/preset-panda", preset],
  preflight: true,
  include: ["./lib/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  exclude: ["./lib/**/*.recipe.{js,jsx,ts,tsx}"],
  prefix: "aitho",
  outdir: "styled-system",
  layers: {
    reset: "aitho-reset",
    base: "aitho-base",
    tokens: "aitho-tokens",
    recipes: "aitho-recipes",
    utilities: "aitho-utilities",
  },
  theme: {
    extend: {
      keyframes: keyframes,
      tokens: {
        radii: {
          "radius-sm": { value: "var(--radius-sm)" },
          radius: { value: "var(--radius)" },
          "radius-lg": { value: "var(--radius-lg)" },
        },
        fonts: {
          custom: { value: "'quatro', sans-serif" },
          mono: { value: "'Space Mono', monospace" },
        },
        colors: {
          "color-primary": { value: "var(--color-primary)" },
          "color-primary-hover": { value: "var(--color-primary-hover)" },
          "color-primary-active": { value: "var(--color-primary-active)" },
          "color-primary-disabled": { value: "var(--color-primary-disabled)" },
          "color-primary-opacity-20": {
            value: "var(--color-primary-opacity-20)",
          },
          "color-primary-opacity-50": {
            value: "var(--color-primary-opacity-50)",
          },

          "text-primary": { value: "var(--text-primary)" },
          "text-secondary": { value: "var(--text-secondary)" },
          "text-on-primary": { value: "var(--text-on-primary)" },

          "background-primary": { value: "var(--background-primary)" },
          "background-secondary": { value: "var(--background-secondary)" },
          "background-tertiary": { value: "var(--background-tertiary)" },
          "background-contrast": { value: "var(--background-contrast)" },
          "background-overlay": { value: "var(--background-overlay)" },

          "color-error": { value: "var(--color-error)" },
          "color-error-hover": { value: "var(--color-error-hover)" },
          "color-error-opacity-80": { value: "var(--color-error-opacity-80)" },
          "color-attention": { value: "var(--color-attention)" },
          "color-attention-hover": { value: "var(--color-attention-hover)" },
          "color-warning": { value: "var(--color-warning)" },
          "color-warning-hover": { value: "var(--color-warning-hover)" },
          "color-success": { value: "var(--color-success)" },
          "color-success-hover": { value: "var(--color-success-hover)" },
          "color-info": { value: "var(--color-info)" },
          "color-info-hover": { value: "var(--color-info-hover)" },

          "border-color": { value: "var(--border-color)" },

          accent: { value: "var(--accent)" },
          white: { value: "var(--white)" },
          "grey-light": { value: "var(--grey-light)" },
          light: { value: "var(--light)" },
          dark: { value: "var(--dark)" },
          transparent: { value: "var(--transparent)" },
          "background-popup": { value: "var(--background-popup)" },
          "text-on-popup": { value: "var(--text-on-popup)" },
          "checkbox-square-color": { value: "var(--checkbox-square-color)" },
          "table-base-color": { value: "var(--table-base-color)" },
          "table-striped-color": { value: "var(--table-striped-color)" },
        },
      },
    },
  },
  globalCss: {
    html: {
      fontFamily: "custom",
    },
  },
});
