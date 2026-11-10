import { defineSlotRecipe } from "@pandacss/dev";

// Current page per Button variant (the `variant` prop is passed to every page Button).
const CURRENT_PAGE = {
  primary: { bg: "color-primary!", color: "text-on-primary!" },
  transparent: { bg: "color-primary-soft!", color: "color-primary!" },
  outline: { borderColor: "color-primary!", color: "color-primary!" },
  neutral: { bg: "background-tertiary!", color: "text-primary!" },
  error: { bg: "color-error!", color: "text-on-primary!" },
  outlineError: { borderColor: "color-error!", color: "color-error!" },
} as const;

// The page items are Buttons: their variant styles sit outside the recipes' base
// layer and win over these selectors, hence the !important (`!`) values.
export const paginationRecipe = defineSlotRecipe({
  className: "pagination",
  slots: ["root"],
  base: {
    root: {
      display: "flex",
      flexWrap: "wrap",
      gap: "0.25rem",
      alignItems: "center",
      justifyContent: "center",
      padding: "0.375rem",
      userSelect: "none",
      "& > button": {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "34px!",
        height: "34px!",
        padding: "0 0.5rem!",
        border: "1px solid transparent!",
        borderRadius: "radius-sm!",
        bg: "transparent!",
        color: "text-primary!",
        boxShadow: "none!",
        opacity: "1!",
        fontSize: "0.8125rem!",
        fontWeight: "600",
        lineHeight: 1,
        cursor: "pointer",
        transition:
          "background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease, opacity 0.15s ease",
        "& > span": {
          padding: "0!",
        },
        "&:hover:not(:disabled)": {
          bg: "color-primary-soft!",
        },
        "&:active:not(:disabled)": {
          transform: "scale(0.92)",
        },
        _focusVisible: {
          outline: "none",
          boxShadow: "focus-ring!",
        },
        "&:disabled:not([aria-current='page'])": {
          opacity: "0.35!",
          cursor: "not-allowed!",
        },
        "&[aria-current='page']": {
          cursor: "default!",
          animation: "scaleIn 0.18s ease-out",
        },
        ...Object.fromEntries(
          Object.entries(CURRENT_PAGE).map(([variant, css]) => [
            `&.aitho-button__root--variant_${variant}[aria-current='page']`,
            css,
          ]),
        ),
      },
    },
  },
});
