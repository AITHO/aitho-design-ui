import { defineSlotRecipe } from "@pandacss/dev";

const requiredMark = {
  content: '"*"',
  marginLeft: "2px",
  color: "color-error",
};

export const labelRecipe = defineSlotRecipe({
  className: "label",
  slots: ["root"],
  base: {
    root: {
      display: "flex",
      alignItems: "center",
      // Text starts at the left edge: a full-width label (form column) was centred over its field.
      justifyContent: "flex-start",
      position: "relative",
      fontWeight: "600",
      _disabled: {
        opacity: "0.5",
        cursor: "not-allowed",
      },
    },
  },
  variants: {
    size: {
      sm: {
        root: { fontSize: "0.75rem" },
      },
      md: {
        root: { fontSize: "0.8125rem" },
      },
      lg: {
        root: { fontSize: "0.9375rem" },
      },
      xl: {
        root: { fontSize: "1.0625rem" },
      },
    },
    variant: {
      text: {
        root: {
          color: "text-primary",
        },
      },
      primary: {
        root: {
          color: "color-primary",
        },
      },
    },

    required: {
      none: {},
      primary: {
        root: {
          alignItems: "start",
          _after: requiredMark,
        },
      },
      bold: {
        root: {
          alignItems: "start",
          _after: { ...requiredMark, fontSize: "1.125em", fontWeight: "bold" },
        },
      },
      text: {
        root: {
          alignItems: "start",
          justifyContent: "flex-start",
          _after: requiredMark,
          color: "color-error",
        },
      },
      textBold: {
        root: {
          alignItems: "start",
          justifyContent: "flex-start",
          _after: { ...requiredMark, fontWeight: "bold" },
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
