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
    // A raised surface in the theme's own colors (inverted colors gave a white tooltip in dark mode).
    content: {
      color: "text-primary",
      backgroundColor: "background-tertiary",
      border: "1px solid",
      borderColor: "border-color",
      // Rendered in a portal: above tables, sticky headers and dialogs.
      zIndex: 9999,
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
      fill: "background-tertiary",
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
