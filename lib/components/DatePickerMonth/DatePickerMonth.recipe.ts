import { defineSlotRecipe } from "@pandacss/dev";

export const datePickerMonthRecipe = defineSlotRecipe({
  className: "date-picker-month",
  slots: ["popoverContent", "header", "monthGrid", "yearHeader", "clearButton"],
  base: {
    popoverContent: {
      zIndex: "10",
      borderRadius: "0.25rem",
      width: "16.25rem",
      backgroundColor: "background-secondary",
      animationDuration: "400ms",
      animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      willChange: "transform, opacity",
      boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.1)",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid #e0e0e0",
      padding: "4px 12px",
    },
    monthGrid: {
      padding: "0.75rem",
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "0.5rem",
    },
    yearHeader: {
      fontWeight: "bold",
      fontSize: "0.875rem",
      color: "text-primary",
    },
    clearButton: {
      cursor: "pointer",
      position: "absolute",
      right: "0.5rem",
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 1,
      _focusVisible: {
        outlineWidth: "2px",
        outlineStyle: "solid",
        outlineColor: "color-primary",
        outlineOffset: "2px",
        borderRadius: "radius-sm",
      },
    },
  },
});
