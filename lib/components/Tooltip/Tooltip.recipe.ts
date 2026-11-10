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
      userSelect: "none",
    },
    // Inverted colors, so it reads as a tooltip in both themes.
    content: {
      color: "background-primary",
      backgroundColor: "text-primary",
      maxWidth: "15.625rem",
      borderRadius: "radius-sm",
      padding: "6px 10px",
      fontWeight: 500,
      boxShadow: "overlay",
      whiteSpace: "normal",
      // Enters moving away from the trigger.
      "&:not([data-state=closed])": {
        "&[data-side=top]": { animation: "fromBelow 0.12s ease-out" },
        "&[data-side=bottom]": { animation: "fromAbove 0.12s ease-out" },
        "&[data-side=left]": { animation: "fromRight 0.12s ease-out" },
        "&[data-side=right]": { animation: "fromLeft 0.12s ease-out" },
      },
      _closed: { animation: "fadeOut 0.1s ease-in" },
    },
    arrow: {
      fill: "text-primary",
    },
  },
  variants: {
    size: {
      sm: {
        content: { fontSize: "xs", lineHeight: "1.4" },
        trigger: { fontSize: "sm" },
      },
      md: {
        content: { fontSize: "sm", lineHeight: "1.4" },
        trigger: { fontSize: "md" },
      },
      lg: {
        content: { fontSize: "md", lineHeight: "1.4", padding: "8px 12px" },
        trigger: { fontSize: "lg" },
      },
      xl: {
        content: { fontSize: "lg", lineHeight: "1.5", padding: "10px 14px" },
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
