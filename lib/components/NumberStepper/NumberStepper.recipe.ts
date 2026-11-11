import { defineSlotRecipe } from "@pandacss/dev";

export const numberStepperRecipe = defineSlotRecipe({
  className: "number-stepper",
  slots: ["root", "button", "value"],
  base: {
    root: {
      display: "inline-flex",
      alignItems: "center",
      gap: "2px",
      width: "fit-content",
      padding: "3px",
      border: "1px solid",
      borderColor: "border-color",
      borderRadius: "radius",
      backgroundColor: "background-primary",
      flexShrink: 0,
      transition:
        "border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease",
      // 1px border + 1px ring reads as a 2px border without shifting the layout.
      '&[data-active="true"]': {
        borderColor: "color-primary",
        boxShadow: "0 0 0 1px {colors.color-primary}",
      },
      '&[data-disabled="true"]': {
        backgroundColor: "background-secondary",
        cursor: "not-allowed",
      },
    },
    button: {
      display: "grid",
      placeItems: "center",
      width: "30px",
      height: "30px",
      // touch screens keep the 44px hit target the component documents
      "@media (pointer: coarse)": { width: "44px", height: "44px" },
      padding: "0",
      border: "none",
      borderRadius: "radius-sm",
      backgroundColor: "transparent",
      color: "text-primary",
      fontSize: "1.125rem",
      fontWeight: "500",
      lineHeight: "1",
      cursor: "pointer",
      flexShrink: 0,
      userSelect: "none",
      transition:
        "background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease, opacity 0.15s ease",
      _hover: {
        backgroundColor: "color-primary-soft",
        color: "color-primary",
      },
      _active: {
        transform: "scale(0.92)",
      },
      _focusVisible: {
        outline: "none",
        boxShadow: "focus-ring",
      },
      _disabled: {
        opacity: 0.35,
        cursor: "not-allowed",
        backgroundColor: "transparent",
        color: "text-primary",
        transform: "none",
      },
    },
    value: {
      width: "3rem",
      height: "30px",
      border: "none",
      borderRadius: "radius-sm",
      textAlign: "center",
      fontFamily: "inherit",
      fontSize: "0.875rem",
      fontWeight: "bold",
      fontVariantNumeric: "tabular-nums",
      color: "text-primary",
      backgroundColor: "transparent",
      padding: 0,
      minWidth: 0,
      transition: "box-shadow 0.15s ease",
      _focus: {
        outline: "none",
      },
      _focusVisible: {
        boxShadow: "focus-ring",
      },
      _disabled: {
        color: "text-secondary",
        cursor: "not-allowed",
      },
    },
  },
});
