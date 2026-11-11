import { defineSlotRecipe } from "@pandacss/dev";
import { pickerPanelStyles } from "../DatePickerMonth/DatePickerMonth.recipe";

// Same panel as the date pickers, with a scrollable list of times.
export const timePickerRecipe = defineSlotRecipe({
  className: "time-picker",
  slots: ["root", "popoverContent", "list", "option"],
  base: {
    root: {
      position: "relative",
      width: "100%",
    },
    popoverContent: {
      ...pickerPanelStyles.popoverContent,
      zIndex: "9999",
      width: "8.5rem",
      padding: "6px",
    },
    list: {
      display: "flex",
      flexDirection: "column",
      gap: "2px",
      maxHeight: "14rem",
      overflowY: "auto",
      outline: "none",
    },
    option: {
      flex: "none",
      height: "30px",
      padding: "0 10px",
      border: "none",
      borderRadius: "radius-sm",
      backgroundColor: "transparent",
      color: "text-primary",
      fontSize: "13px",
      fontVariantNumeric: "tabular-nums",
      textAlign: "left",
      cursor: "pointer",
      transition: "background-color 0.15s ease, color 0.15s ease",
      _hover: { backgroundColor: "color-primary-soft" },
      _focusVisible: { outline: "none", boxShadow: "focus-ring" },
      "&[aria-selected='true']": {
        backgroundColor: "color-primary",
        color: "text-on-primary",
        fontWeight: "bold",
      },
      _disabled: {
        opacity: 0.35,
        cursor: "not-allowed",
        backgroundColor: "transparent",
      },
    },
  },
});
