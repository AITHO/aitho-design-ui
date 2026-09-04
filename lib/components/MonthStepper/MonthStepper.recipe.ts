import { defineSlotRecipe } from "@pandacss/dev";

export const monthStepperRecipe = defineSlotRecipe({
  className: "month-stepper",
  slots: ["root", "arrow", "label"],
  base: {
    root: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "0.25rem",
      backgroundColor: "background-secondary",
      border: "1px solid",
      borderColor: "border-color",
      borderRadius: "radius",
      padding: "0.25rem",
      minWidth: 0,
    },
    arrow: {
      width: "2.75rem",
      height: "2.25rem",
      border: "none",
      backgroundColor: "transparent",
      borderRadius: "radius-sm",
      color: "color-primary",
      fontSize: "1rem",
      cursor: "pointer",
      flexShrink: 0,
      _disabled: {
        opacity: 0.5,
        cursor: "not-allowed",
      },
      _focusVisible: {
        outlineWidth: "2px",
        outlineStyle: "solid",
        outlineColor: "color-primary",
        outlineOffset: "2px",
      },
    },
    label: {
      fontSize: "0.906rem",
      fontWeight: "bold",
      color: "text-primary",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      minWidth: 0,
    },
  },
});
