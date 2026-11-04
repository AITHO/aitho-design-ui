import { defineSlotRecipe } from "@pandacss/dev";

export const tooltipRecipe = defineSlotRecipe({
  className: "tooltip",
  slots: ["content", "trigger", "arrow"],
  base: {
    trigger: {
      color: "background-popup",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
    content: {
      color: "text-on-popup",
      backgroundColor: "background-popup",
      maxWidth: "15.625rem",
      borderRadius: "radius",
      padding: "0.5rem",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.25)",
      animation: "tooltipFadeIn 300ms ease",
      whiteSpace: "normal",
    },
    arrow: {
      fill: "background-popup",
    },
  },
  variants: {
    size: {
      sm: {
        content: { fontSize: "sm", lineHeight: "1.3" },
        trigger: { fontSize: "sm" },
      },
      md: {
        content: { fontSize: "base", lineHeight: "1.3" },
        trigger: { fontSize: "base" },
      },
      lg: {
        content: { fontSize: "lg", lineHeight: "1.4" },
        trigger: { fontSize: "lg" },
      },
      xl: {
        content: { fontSize: "xl", lineHeight: "1.5" },
        trigger: { fontSize: "xl" },
      },
    },
    textAlign: {
      start: {
        content: { textAlign: "start" },
      },
      center: {
        content: { textAlign: "center" },
      },
      end: {
        content: { textAlign: "end" },
      },
    },
  },
  defaultVariants: {
    size: "sm",
    textAlign: "center",
  },
});
