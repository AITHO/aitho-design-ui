import { defineSlotRecipe } from "@pandacss/dev";

const SIZES = ["sm", "md", "lg"] as const;
const VARIANTS = ["primary", "secondary"] as const;
const BORDER_COLORS = ["base", "primary"] as const;

export type SizeVariant = (typeof SIZES)[number];
export type VariantType = (typeof VARIANTS)[number];

const SIZE_MAPS = {
  sm: { fontSize: "sm" },
  md: { fontSize: "base" },
  lg: { fontSize: "lg" },
} as const;

const VARIANT_MAPS = {
  primary: {
    bg: "background-primary",
  },
  secondary: {
    bg: "background-secondary",
  },
} as const;

const BORDER_COLOR_MAPS = {
  base: {
    borderColor: "border-color",
  },
  primary: {
    borderColor: "background-secondary",
  },
} as const;

export const accordionRecipe = defineSlotRecipe({
  className: "accordion",
  slots: ["root", "item", "header", "trigger", "content", "chevron"],
  base: {
    root: {
      color: "text-primary",
      display: "flex",
      flexDirection: "column",
      border: "1px solid",
      borderRadius: "radius",
      overflow: "hidden",
      bg: "background-primary",
    },
    item: {
      maxWidth: "100%",
      display: "flex",
      flexDirection: "column",
      "& + &": {
        borderTopWidth: "1px",
      },
    },
    header: {
      display: "flex",
    },
    trigger: {
      cursor: "pointer",
      width: "100%",
      padding: "0.75rem 0.875rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "0.5rem",
      fontWeight: "600",
      textAlign: "left",
      userSelect: "none",
      transition:
        "background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease",
      _hover: {
        bg: "color-primary-softer",
      },
      _disabled: {
        cursor: "not-allowed",
        opacity: 0.5,
        _hover: {
          bg: "transparent",
        },
      },
      // Inset: the root clips anything drawn outside the trigger.
      _focusVisible: {
        outline: "none",
        boxShadow: "inset 0 0 0 2px var(--color-primary)",
      },
    },
    content: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      padding: "0 0.875rem 0.875rem",
      color: "text-secondary",
      overflow: "hidden",
      "&[data-state='open']": {
        animation: "accordionSlideDown 0.25s ease",
      },
      "&[data-state='closed']": {
        animation: "accordionSlideUp 0.25s ease",
      },
    },
    chevron: {
      // Rendered before the header text: moved to the trailing edge, pointing down.
      order: 1,
      flexShrink: 0,
      color: "text-secondary",
      transform: "rotate(90deg)",
      transition: "transform 0.2s ease",
      "[data-state='open'] > &": {
        transform: "rotate(-90deg)",
      },
    },
  },
  variants: {
    size: Object.fromEntries(
      SIZES.map((size) => [
        size,
        {
          root: SIZE_MAPS[size],
        },
      ]),
    ),
    variant: Object.fromEntries(
      VARIANTS.map((variant) => [
        variant,
        {
          header: VARIANT_MAPS[variant],
          content: VARIANT_MAPS[variant],
        },
      ]),
    ),
    borderColor: Object.fromEntries(
      BORDER_COLORS.map((variant) => [
        variant,
        {
          root: BORDER_COLOR_MAPS[variant],
          item: BORDER_COLOR_MAPS[variant],
        },
      ]),
    ),
  },
  defaultVariants: {
    borderColor: "base",
    size: "sm",
    variant: "primary",
  },
});
