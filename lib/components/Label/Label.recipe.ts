import { defineSlotRecipe } from "@pandacss/dev";

export const labelRecipe = defineSlotRecipe({
  className: "label",
  slots: ["root"],
  base: {
    root: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
    },
  },
  variants: {
    size: {
      sm: {
        root: { fontSize: "sm" },
      },
      md: {
        root: { fontSize: "base" },
      },
      lg: {
        root: { fontSize: "lg" },
      },
      xl: {
        root: { fontSize: "xl" },
      },
    },
    variant: {
      text: {
        root: {
          color: "text-primary",
          _disabled: {
            color: "grey-light",
            cursor: "not-allowed",
          },
        },
      },
      primary: {
        root: {
          color: "color-primary",
          _disabled: {
            color: "grey-light",
            cursor: "not-allowed",
          },
        },
      },
    },

    required: {
      none: {},
      primary: {
        root: {
          alignItems: "start",
          _before: {
            content: '" *"',
            color: "color-error",
          },
        },
      },
      bold: {
        root: {
          alignItems: "start",
          _before: {
            content: '" *"',
            fontSize: "1.125rem",
            color: "color-error",
            fontWeight: "bold",
          },
        },
      },
      text: {
        root: {
          alignItems: "start",
          justifyContent: "flex-start",
          _before: {
            content: '" *"',
            color: "color-error",
          },
          color: "color-error",
        },
      },
      textBold: {
        root: {
          alignItems: "start",
          justifyContent: "flex-start",
          _before: {
            content: '" *"',
            color: "color-error",
            fontWeight: "bold",
          },
          color: "color-error",
          fontWeight: "bold",
        },
      },
    },
  },
  defaultVariants: {
    size: "md",
    variant: "text",
    required: "none",
  },
} as const);
