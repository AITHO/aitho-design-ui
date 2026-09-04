import { defineSlotRecipe } from "@pandacss/dev";

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
      borderRadius: "md",
      position: "relative",
      cursor: "pointer",
      _disabled: {
        cursor: "not-allowed",
        opacity: "0.5",
        backgroundColor: "color-primary-disabled",
        borderColor: "color-primary-disabled",
      },
      _checked: {
        animation: "check 300ms ease-in-out",
      },
      _unchecked: {
        animation: "uncheck 300ms ease-in-out",
      },
      _focusVisible: {
        outlineWidth: "2px",
        outlineStyle: "solid",
        outlineColor: "color-primary",
        outlineOffset: "2px",
      },
    },
    icon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: "0",
      overflow: "hidden",
      position: "relative",
      width: "100%",
      height: "100%",
      _disabled: {
        color: "grey-light",
      },
    },
    squareIcon: {
      width: "60%",
      height: "60%",
      backgroundColor: "checkbox-square-color",
      borderRadius: "sm",
      _disabled: {
        backgroundColor: "grey-light",
      },
    },
    indicator: {
      position: "relative",
      _disabled: {
        backgroundColor: "color-primary-disabled",
        borderColor: "color-primary-disabled",
      },
    },
  },
  variants: {
    size: {
      sm: {
        root: { h: "5", w: "5", fontSize: "sm" },
        icon: { h: "5", w: "5", fontSize: "sm" },
      },
      md: {
        root: { h: "9", w: "9", fontSize: "base" },
        icon: { h: "9", w: "9", fontSize: "base" },
      },
      lg: {
        root: { h: "11", w: "11", fontSize: "lg" },
        icon: { h: "11", w: "11", fontSize: "lg" },
      },
      xl: {
        root: { h: "12", w: "12", fontSize: "xl" },
        icon: { h: "12", w: "12", fontSize: "xl" },
      },
    },
    variant: {
      primary: {
        root: {
          bg: "background-primary",
          borderColor: "color-primary",
          borderWidth: "1px",
        },
        indicator: {
          bg: "color-primary",
          borderColor: "primary",
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
          borderColor: "color-attention",
          borderWidth: "1px",
        },
        indicator: {
          bg: "color-attention",
          borderColor: "color-attention",
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
          borderWidth: "1px",
        },
        indicator: {
          bg: "white",
          borderColor: "primary",
        },
        icon: {
          color: "checkbox-square-color",
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
          border: "none",
          backgroundColor: "color-primary-disabled",
        },
      },
    },
    required: {
      none: {},
      primary: {
        root: {
          borderColor: "color-error",
        },
        indicator: {
          bg: "color-error",
          borderColor: "color-error",
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
