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
      padding: "0.25rem",
      border: "1px solid",
      borderColor: "border-color",
      borderRadius: "radius",
      bg: "background-primary",
    },
    container: {
      _focusVisible: {
        outline: "none",
        boxShadow: "focus-ring",
        borderRadius: "radius-sm",
        zIndex: "999999",
      },
    },
    content: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      minHeight: "1.875rem",
      padding: "0.625rem",
      borderRadius: "radius-sm",
      outline: "none",
      transition: "background-color 0.15s ease",
      _hover: {
        bg: "color-primary-softer",
      },
    },
    item: {
      display: "flex",
      flexDirection: "row",
      gap: "0.75rem",
      alignItems: "center",
    },
    rightSlot: {
      marginLeft: "auto",
      paddingLeft: "0.625rem",
      display: "flex",
      flexDirection: "row",
      gap: "0.625rem",
    },
    // Items are told apart by their hover background: the separator is just a 2px gap.
    separator: {
      height: "2px",
      width: "100%",
      ".aitho-list__container:last-child > &": {
        display: "none",
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
