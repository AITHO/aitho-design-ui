import { defineSlotRecipe } from "@pandacss/dev";

export const toggleSwitchRecipe = defineSlotRecipe({
  className: "toggleSwitch",
  slots: ["root", "thumb"],
  base: {
    root: {
      width: "2.625rem",
      height: "1.563rem",
      borderRadius: "9999px",
      position: "relative",
      WebkitTapHighlightColor: "rgba(0, 0, 0, 0)",
      transition: "background-color 200ms ease-in-out",
      cursor: "pointer",
      overflow: "hidden",
      backgroundColor: "background-tertiary",
      _checked: { backgroundColor: "color-primary" },
      _disabled: {
        cursor: "not-allowed",
        backgroundColor: "background-tertiary",
        _checked: {
          backgroundColor: "color-primary-disabled",
        },
      },
      _focusVisible: {
        outlineWidth: "2px",
        outlineStyle: "solid",
        outlineColor: "color-primary",
        outlineOffset: "2px",
        borderRadius: "radius-sm",
      },
    },
    thumb: {
      display: "block",
      width: "1.313rem",
      height: "1.313rem",
      backgroundColor: "light",
      borderRadius: "full",
      boxShadow: "0 2px 2px var(--dark)",
      transition: "transform 100ms",
      transform: "translateX(2px)",
      willChange: "transform",
      _checked: {
        transform: "translateX(19px)",
        boxShadow: "0 2px 2px var(--dark)",
      },
      _disabled: {
        boxShadow: "none",
      },
    },
  },
  variants: {
    size: {
      sm: {
        root: { width: "2.25rem", height: "1.25rem" },
        thumb: {
          width: "1rem",
          height: "1rem",
          transform: "translateX(2px)",
          _checked: { transform: "translateX(17px)" },
        },
      },
      md: {
        root: { width: "2.625rem", height: "1.563rem" },
        thumb: {
          width: "1.313rem",
          height: "1.313rem",
          transform: "translateX(2px)",
          _checked: { transform: "translateX(19px)" },
        },
      },
      lg: {
        root: { width: "3.125rem", height: "1.875rem" },
        thumb: {
          width: "1.625rem",
          height: "1.625rem",
          transform: "translateX(2px)",
          _checked: { transform: "translateX(22px)" },
        },
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
} as const);
