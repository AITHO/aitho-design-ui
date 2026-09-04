import { defineSlotRecipe } from "@pandacss/dev";

export const numberStepperRecipe = defineSlotRecipe({
  className: "number-stepper",
  slots: ["root", "button", "value"],
  base: {
    root: {
      display: "inline-flex",
      alignItems: "center",
      border: "1px solid",
      borderColor: "border-color",
      borderRadius: "radius",
      overflow: "hidden",
      backgroundColor: "background-primary",
      flexShrink: 0,
      '&[data-active="true"]': {
        border: "2px solid",
        borderColor: "color-primary",
      },
      '&[data-disabled="true"]': {
        opacity: 0.5,
      },
    },
    button: {
      width: "2.75rem",
      height: "2.75rem",
      border: "none",
      backgroundColor: "background-secondary",
      color: "color-primary",
      fontSize: "1.125rem",
      fontWeight: "bold",
      cursor: "pointer",
      flexShrink: 0,
      _disabled: {
        cursor: "not-allowed",
        color: "text-secondary",
      },
      _focusVisible: {
        outlineWidth: "2px",
        outlineStyle: "solid",
        outlineColor: "color-primary",
        outlineOffset: "-2px",
      },
    },
    value: {
      width: "3.5rem",
      height: "2.75rem",
      border: "none",
      textAlign: "center",
      fontFamily: "inherit",
      fontSize: "1rem",
      fontWeight: "bold",
      color: "text-primary",
      backgroundColor: "transparent",
      padding: 0,
      minWidth: 0,
      _focus: {
        outline: "none",
      },
      _disabled: {
        color: "text-secondary",
      },
    },
  },
});
