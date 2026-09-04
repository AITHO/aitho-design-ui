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
      padding: "0.5rem",
      minWidth: "9.375rem",
      maxWidth: "18.75rem",
      borderRadius: "radius-sm",
      borderStyle: "solid",
      borderWidth: "1px",
      borderColor: "border-color",
      backgroundColor: "background-primary",
      color: "text-primary",
      userSelect: "none",
      outline: "none",
      marginTop: "1.25rem",
    },
    item: {
      cursor: "pointer",
      borderRadius: "radius-sm",
      lineHeight: 1,
      display: "flex",
      alignItems: "center",
      minHeight: "1.875rem",
      position: "relative",
      userSelect: "none",
      outline: "none",
      padding: "0.313rem",
      color: "text-primary",
      _hover: {
        color: "text-on-primary",
        backgroundColor: "color-primary-hover",
      },
      "&[data-highlighted]": {
        color: "text-on-primary",
        backgroundColor: "color-primary-hover",
        outline: "none",
      },
      _disabled: {
        color: "grey-light",
      },
      marginY: "0.125rem",
      _first: {
        marginTop: "0px",
      },
      _last: {
        marginBottom: "0px",
      },
    },
    label: {
      lineHeight: 1,
      display: "flex",
      alignItems: "center",
      minHeight: "1.875rem",
      position: "relative",
      userSelect: "none",
      outline: "none",
      padding: "0.313rem",
      color: "text-primary",
    },
    rightSlot: {
      marginLeft: "auto",
      paddingLeft: "0.313rem",
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
      backgroundColor: "color-primary",
      margin: "0.313rem",
    },
  },
  variants: {
    variant: {
      primary: {
        trigger: {
          borderRadius: "radius",
          borderStyle: "solid",
          borderWidth: "0.125rem",
          borderColor: "border-color",
          backgroundColor: "background-primary",
          _hover: {
            backgroundColor: "background-secondary",
            borderColor: "border-color",
          },
          _active: {
            backgroundColor: "background-tertiary",
          },
          _focus: {
            backgroundColor: "background-secondary",
            borderColor: "border-color",
          },
        },
      },
      ghost: {
        trigger: {
          backgroundColor: "transparent",
          border: "none",
          padding: "0",
          focus: {
            backgroundColor: "transparent",
            border: "none",
          },
        },
      },
    },
    size: {
      sm: {
        content: { fontSize: "sm" },
        trigger: { fontSize: "sm" },
      },
      md: {
        content: { fontSize: "base" },
        trigger: { fontSize: "base" },
      },
      lg: {
        content: { fontSize: "lg" },
        trigger: { fontSize: "lg" },
      },
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});
