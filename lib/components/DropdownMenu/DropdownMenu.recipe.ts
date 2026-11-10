import { defineSlotRecipe } from "@pandacss/dev";

export const dropdownMenuRecipe = defineSlotRecipe({
  className: "dropdown-menu",
  slots: [
    "root",
    "trigger",
    "content",
    "item",
    "label",
    "rightSlot",
    "arrow",
    "radioGroup",
    "separator",
  ],
  base: {
    content: {
      padding: "4px",
      minWidth: "13.125rem",
      maxWidth: "18.75rem",
      borderRadius: "radius",
      borderStyle: "solid",
      borderWidth: "1px",
      borderColor: "border-color",
      backgroundColor: "background-secondary",
      color: "text-primary",
      boxShadow: "overlay",
      userSelect: "none",
      outline: "none",
      marginTop: "1.25rem",
      transformOrigin: "var(--radix-dropdown-menu-content-transform-origin)",
      _open: { animation: "popIn 0.14s ease-out" },
      _closed: { animation: "popOut 0.1s ease-in" },
    },
    // Radix highlights items on pointer move too, so this covers hover; disabled items are never highlighted.
    item: {
      cursor: "pointer",
      borderRadius: "radius-sm",
      lineHeight: "1.4",
      display: "flex",
      alignItems: "center",
      position: "relative",
      userSelect: "none",
      outline: "none",
      padding: "7px 10px",
      color: "text-primary",
      transition:
        "background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease",
      _highlighted: {
        backgroundColor: "color-primary-soft",
      },
      _focusVisible: { boxShadow: "focus-ring" },
      _disabled: {
        opacity: 0.45,
        cursor: "not-allowed",
      },
    },
    label: {
      display: "flex",
      alignItems: "center",
      position: "relative",
      userSelect: "none",
      outline: "none",
      padding: "6px 10px 4px",
      fontSize: "0.6875rem",
      fontWeight: 600,
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      color: "text-secondary",
    },
    rightSlot: {
      display: "flex",
      alignItems: "center",
      marginLeft: "auto",
      paddingLeft: "10px",
      color: "text-secondary",
    },
    arrow: {
      fill: "border-color",
    },
    radioGroup: {
      display: "flex",
      flexDirection: "column",
    },
    separator: {
      height: "1px",
      backgroundColor: "border-color",
      marginY: "4px",
    },
  },
  variants: {
    variant: {
      primary: {
        trigger: {
          borderRadius: "radius",
          borderStyle: "solid",
          borderWidth: "1px",
          borderColor: "border-color",
          backgroundColor: "transparent",
          color: "text-primary",
          cursor: "pointer",
          userSelect: "none",
          transition:
            "background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease",
          _hover: {
            backgroundColor: "color-primary-softer",
            borderColor: "color-primary",
          },
          _open: {
            backgroundColor: "color-primary-softer",
            borderColor: "color-primary",
          },
          _focusVisible: { outline: "none", boxShadow: "focus-ring" },
        },
      },
      ghost: {
        trigger: {
          backgroundColor: "transparent",
          border: "none",
          padding: "0",
          borderRadius: "radius-sm",
          cursor: "pointer",
          userSelect: "none",
          transition: "box-shadow 0.15s ease",
          _focusVisible: { outline: "none", boxShadow: "focus-ring" },
        },
      },
    },
    size: {
      sm: {
        content: { fontSize: "0.8125rem" },
        trigger: { fontSize: "0.8125rem" },
      },
      md: {
        content: { fontSize: "sm" },
        trigger: { fontSize: "sm" },
      },
      lg: {
        content: { fontSize: "md" },
        trigger: { fontSize: "md" },
      },
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});
