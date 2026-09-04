import { defineSlotRecipe } from "@pandacss/dev";

const SIZES = ["sm", "md", "lg"] as const;
const VARIANTS = ["primary", "secondary", "neutral"] as const;

export type SizeVariant = (typeof SIZES)[number];
export type VariantType = (typeof VARIANTS)[number];

const SIZE_MAPS = {
  sm: { fontSize: "sm" },
  md: { fontSize: "md" },
  lg: { fontSize: "lg" },
} as const;

const VARIANT_MAPS = {
  primary: {
    color: "color-primary",
  },
  secondary: {
    color: "text-secondary",
  },
  neutral: {
    color: "text-primary",
  },
} as const;

export const listRecipe = defineSlotRecipe({
  className: "list",
  slots: ["root", "container", "content", "item", "rightSlot", "separator"],
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
    container: {
      _focusVisible: {
        outlineWidth: "2px",
        outlineStyle: "solid",
        outlineColor: "color-primary",
        outlineOffset: "1px",
        borderRadius: "radius-sm",
        zIndex: "999999",
      },
    },
    content: {
      lineHeight: 1,
      display: "flex",
      flexDirection: "row",
      minHeight: "1.875rem",
      userSelect: "none",
      outline: "none",
      padding: "0.167rem",
    },
    item: {
      display: "flex",
      flexDirection: "row",
      gap: "0.938rem",
      alignItems: "center",
    },
    rightSlot: {
      marginLeft: "auto",
      paddingLeft: "0.625rem",
      display: "flex",
      flexDirection: "row",
      gap: "0.625rem",
    },
    separator: {
      backgroundColor: "border-color",
      height: "1px",
      width: "100%",
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
          root: VARIANT_MAPS[variant],
        },
      ]),
    ),
    striped: {
      true: {},
      false: {},
    },
  },
  compoundVariants: [
    {
      variant: "primary",
      striped: true,
      css: {
        root: {
          "& > div:nth-of-type(even) > .aitho-list__content": {
            bg: "table-striped-color",
          },
        },
      },
    },
    {
      variant: "secondary",
      striped: true,
      css: {
        root: {
          "& > div:nth-of-type(even) > .aitho-list__content": {
            bg: "table-striped-color",
          },
        },
      },
    },
    {
      variant: "neutral",
      striped: true,
      css: {
        root: {
          "& > div:nth-of-type(even) > .aitho-list__content": {
            bg: "background-secondary",
          },
        },
      },
    },
  ],
  defaultVariants: {
    variant: "secondary",
    size: "md",
  },
});
