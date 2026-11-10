import { defineSlotRecipe } from "@pandacss/dev";

export const monthStepperRecipe = defineSlotRecipe({
  className: "month-stepper",
  slots: ["root", "arrow", "label"],
  base: {
    root: {
      display: "inline-flex",
      alignItems: "center",
      gap: "2px",
      width: "fit-content",
      maxWidth: "100%",
      padding: "3px",
      backgroundColor: "background-primary",
      border: "1px solid",
      borderColor: "border-color",
      borderRadius: "radius",
      userSelect: "none",
    },
    arrow: {
      display: "grid",
      placeItems: "center",
      width: "30px",
      height: "30px",
      // touch screens keep the 44px hit target the component documents
      "@media (pointer: coarse)": { width: "44px", height: "44px" },
      padding: "0",
      border: "none",
      backgroundColor: "transparent",
      borderRadius: "radius-sm",
      color: "text-primary",
      fontSize: "1.375rem",
      lineHeight: "1",
      cursor: "pointer",
      flexShrink: 0,
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
    label: {
      // Fixed minimum so the arrows don't move as the month name changes length.
      minWidth: "8.125rem",
      padding: "0 4px",
      textAlign: "center",
      fontSize: "0.875rem",
      fontWeight: "600",
      fontVariantNumeric: "tabular-nums",
      color: "text-primary",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
  },
});
