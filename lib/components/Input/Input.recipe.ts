import { defineSlotRecipe } from "@pandacss/dev";

export const inputRecipe = defineSlotRecipe({
  className: "input",
  slots: [
    "inputWrapper",
    "requiredMark",
    "inputContainer",
    "iconStyle",
    "iconStyleDelete",
    "inputField",
    "errorText",
  ],
  base: {
    inputWrapper: {
      display: "flex",
      alignItems: "center",
      gap: "0.938rem",
      width: "full",
    },
    requiredMark: {
      color: "color-error",
    },
    inputContainer: {
      position: "relative",
      width: "100%",
    },
    iconStyle: {
      position: "absolute",
      zIndex: 20,
      color: "text-secondary",
      height: "1.063rem",
      width: "1.063rem",
      cursor: "pointer",
      right: "0.625rem",
      top: "50%",
      transform: "translateY(-50%)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      background: "none",
      border: "none",
      padding: "0",
      _focusVisible: {
        outlineWidth: "2px",
        outlineStyle: "solid",
        outlineColor: "color-primary",
        outlineOffset: "2px",
        borderRadius: "radius-sm",
      },
    },
    inputField: {
      border: "1px solid",
      backgroundColor: "background-primary",
      color: "text-primary",
      padding: "0.5rem",
      transitionProperty: "all",
      minWidth: "15.625rem",
      width: "100%",
      maxHeight: "2.5rem",
      transitionDuration: "300ms",
      _disabled: {
        cursor: "not-allowed",
        opacity: "0.5",
      },
      _focus: {
        bg: "background-secondary",
      },
      _focusVisible: {
        outlineWidth: "2px",
        outlineStyle: "solid",
        outlineColor: "color-primary",
        outlineOffset: "2px",
        borderRadius: "radius-sm",
      },
      _placeholder: {
        color: "background-popup",
      },
      _hover: {
        bg: "background-secondary",
      },
      _active: {
        bg: "background-tertiary",
      },
      "&::-webkit-calendar-picker-indicator": {
        cursor: "pointer",
        borderRadius: "0.25rem",
        marginRight: "0.125rem",
        filter: "invert(0.7)",
      },
      "&::-ms-clear": {
        display: "none",
      },
      "&::-ms-reveal": {
        display: "none",
      },
    },
    errorText: {
      color: "color-error",
      fontSize: "0.75rem",
    },
  },
  variants: {
    borderColor: {
      base: { inputField: { borderColor: "border-color" } },
      primary: { inputField: { borderColor: "color-primary" } },
      error: { inputField: { borderColor: "color-error" } },
    },
    borderRadius: {
      none: { inputField: { borderRadius: "0px" } },
      rounded: { inputField: { borderRadius: "radius" } },
    },
  },
  defaultVariants: {
    borderColor: "base",
    borderRadius: "rounded",
  },
});
