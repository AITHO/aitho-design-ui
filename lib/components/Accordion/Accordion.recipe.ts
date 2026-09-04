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
      borderRadius: "radius",
      gap: "0.625rem",
      display: "flex",
      flexDirection: "column",
    },
    item: {
      maxWidth: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "0.625rem",
      overflow: "hidden",
      marginTop: "1px",
      borderRadius: "radius",
    },
    header: {
      display: "flex",
    },
    trigger: {
      cursor: "pointer",
      width: "100%",
      padding: "0 0.625rem",
      display: "flex",
      flexDirection: "row",
      gap: "0.313rem",
      alignItems: "center",
      lineHeight: 1,
      borderRadius: "radius",
      border: "1px solid",
      "&[data-state='open']": {
        color: "color-primary",
      },
      "&[data-state='open'] svg": {
        transform: "rotate(90deg)",
      },
      _focusVisible: {
        outlineWidth: "2px",
        outlineStyle: "solid",
        outlineColor: "color-primary",
        outlineOffset: "-2px",
      },
    },
    content: {
      border: "1px solid",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      padding: "0.625rem",
      color: "text-primary",
      overflow: "hidden",
      borderRadius: "radius",
      "&[data-state='open']": {
        animation: "accordionSlideDown 300ms cubic-bezier(0.87, 0, 0.13, 1)",
      },
      "&[data-state='closed']": {
        animation: "accordionSlideUp 300ms cubic-bezier(0.87, 0, 0.13, 1)",
      },
      _hover: {
        backgroundColor: "background-secondary",
      },
    },
    chevron: {
      transition: "transform 300ms cubic-bezier(0.87, 0, 0.13, 1)",
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
          trigger: BORDER_COLOR_MAPS[variant],
          content: BORDER_COLOR_MAPS[variant],
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
