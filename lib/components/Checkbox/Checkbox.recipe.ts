import { defineSlotRecipe } from "@pandacss/dev";

const checkedState = "&:is([data-state=checked], [data-state=indeterminate])";

export const checkboxRecipe = defineSlotRecipe({
  className: "checkbox",
  slots: ["root", "indicator", "icon", "squareIcon"],
  base: {
    root: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: "0",
      overflow: "hidden",
      borderRadius: "radius-sm",
      position: "relative",
      cursor: "pointer",
      userSelect: "none",
      transition:
        "background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease",
      _disabled: {
        cursor: "not-allowed",
        opacity: "0.45",
      },
      _focusVisible: {
        outline: "none",
        boxShadow: "focus-ring",
      },
    },
    indicator: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      height: "100%",
      // Radix keeps the indicator mounted until the exit animation ends
      _checked: {
        animation: "check 0.15s cubic-bezier(0.3, 1.6, 0.6, 1)",
      },
      _unchecked: {
        animation: "uncheck 0.15s ease-in",
      },
    },
    icon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: "0",
      position: "relative",
      // thickens the filled Radix check glyph to the prototype's bolder stroke
      stroke: "currentColor",
      strokeWidth: "1.2",
      strokeLinejoin: "round",
    },
    squareIcon: {
      width: "60%",
      height: "60%",
      borderRadius: "xs",
    },
  },
  variants: {
    size: {
      sm: {
        root: { h: "18px", w: "18px" },
        icon: { h: "12px", w: "12px" },
      },
      md: {
        root: { h: "22px", w: "22px" },
        icon: { h: "15px", w: "15px" },
      },
      lg: {
        root: { h: "26px", w: "26px", borderRadius: "radius" },
        icon: { h: "18px", w: "18px" },
      },
      xl: {
        root: { h: "30px", w: "30px", borderRadius: "radius" },
        icon: { h: "21px", w: "21px" },
      },
    },
    variant: {
      primary: {
        root: {
          bg: "background-primary",
          borderColor: "grey-light",
          borderWidth: "1.5px",
          "&:hover:not(:disabled)": { borderColor: "color-primary" },
          [checkedState]: { bg: "color-primary", borderColor: "color-primary" },
        },
        icon: {
          color: "text-on-primary",
        },
        squareIcon: {
          bg: "text-on-primary",
        },
      },
      secondary: {
        root: {
          bg: "background-primary",
          borderColor: "grey-light",
          borderWidth: "1.5px",
          "&:hover:not(:disabled)": { borderColor: "color-attention" },
          [checkedState]: {
            bg: "color-attention",
            borderColor: "color-attention",
          },
        },
        icon: {
          color: "text-on-primary",
        },
        squareIcon: {
          bg: "text-on-primary",
        },
      },
      white: {
        root: {
          bg: "white",
          borderColor: "checkbox-square-color",
          borderWidth: "1.5px",
        },
        icon: {
          color: "checkbox-square-color",
        },
        squareIcon: {
          bg: "checkbox-square-color",
        },
      },
    },
    border: {
      solid: {
        root: {
          borderStyle: "solid",
        },
      },
      dashed: {
        root: {
          borderStyle: "dashed",
        },
      },
      none: {
        root: {
          borderStyle: "none",
          backgroundColor: "color-primary-soft",
        },
      },
    },
    required: {
      none: {},
      primary: {
        root: {
          borderColor: "color-error",
          [checkedState]: { bg: "color-error", borderColor: "color-error" },
        },
        icon: {
          color: "text-on-primary",
        },
      },
    },
  },

  defaultVariants: {
    size: "sm",
    variant: "primary",
    border: "solid",
    required: "none",
  },
});
