import { defineSlotRecipe } from "@pandacss/dev";

export const progressRecipe = defineSlotRecipe({
  className: "progress",
  slots: ["root", "indicator"],
  base: {
    root: {
      width: "18.75rem",
      height: "1.25rem",
      overflow: "hidden",
      _focusVisible: {
        outlineWidth: "2px",
        outlineStyle: "solid",
        outlineColor: "color-primary",
        outlineOffset: "2px",
      },
    },
    indicator: {
      width: "100%",
      height: "100%",
      transition: "transform 660ms cubic-bezier(0.65, 0, 0.35, 1)",
    },
  },
  variants: {
    size: {
      sm: { root: { height: "0.625rem" } },
      md: { root: { height: "1.25rem" } },
      lg: { root: { height: "1.875rem" } },
    },
    borderRadius: {
      none: { root: { borderRadius: "none" } },
      sm: { root: { borderRadius: "radius-sm" } },
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
