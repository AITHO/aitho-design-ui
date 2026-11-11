import { defineSlotRecipe } from "@pandacss/dev";

export const progressRecipe = defineSlotRecipe({
  className: "progress",
  slots: ["root", "indicator"],
  base: {
    root: {
      width: "18.75rem",
      height: "8px",
      overflow: "hidden",
      transition: "box-shadow 0.15s ease",
      _focusVisible: {
        outline: "none",
        boxShadow: "focus-ring",
      },
    },
    indicator: {
      width: "100%",
      height: "100%",
      borderRadius: "inherit",
      transformOrigin: "left",
      transition: "transform 0.4s ease",
      // Animates `scale`, not `transform`: the value is an inline translateX.
      animation: "progressGrowX 0.9s cubic-bezier(0.2, 0.8, 0.2, 1)",
    },
  },
  variants: {
    // --progress-pill is half the track height, used by the default radius.
    size: {
      sm: { root: { height: "4px", "--progress-pill": "2px" } },
      md: { root: { height: "8px", "--progress-pill": "4px" } },
      lg: { root: { height: "12px", "--progress-pill": "6px" } },
    },
    borderRadius: {
      none: { root: { borderRadius: "0" } },
      sm: { root: { borderRadius: "var(--progress-pill)" } },
      md: { root: { borderRadius: "radius" } },
      lg: { root: { borderRadius: "radius-lg" } },
    },
    variant: {
      primary: {
        root: { backgroundColor: "background-tertiary" },
        indicator: { backgroundColor: "color-primary" },
      },
    },
  },
  defaultVariants: {
    size: "md",
    variant: "primary",
    borderRadius: "sm",
  },
});
