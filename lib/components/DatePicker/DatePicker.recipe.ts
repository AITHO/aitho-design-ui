import { defineSlotRecipe } from "@pandacss/dev";
import { pickerPanelStyles } from "../DatePickerMonth/DatePickerMonth.recipe";

const CONTROL_TRANSITION =
  "background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease, opacity 0.15s ease";

// Same panel anatomy as DatePickerMonth / DatePickerYear, with a day grid instead of months.
export const datePickerRecipe = defineSlotRecipe({
  className: "date-picker",
  slots: [
    "root",
    "popoverContent",
    "header",
    "title",
    "weekdays",
    "weekday",
    "grid",
    "day",
    "footer",
    "footerButton",
  ],
  base: {
    root: {
      position: "relative",
      width: "100%",
    },
    popoverContent: {
      ...pickerPanelStyles.popoverContent,
      // Portalled: above dialogs (999) and fixed app chrome.
      zIndex: "9999",
      width: "18rem",
    },
    header: {
      ...pickerPanelStyles.header,
      gap: "2px",
    },
    title: {
      flex: "1",
      textAlign: "center",
      fontWeight: "bold",
      fontSize: "0.875rem",
      fontVariantNumeric: "tabular-nums",
      textTransform: "capitalize",
      color: "text-primary",
    },
    weekdays: {
      display: "grid",
      gridTemplateColumns: "repeat(7, 1fr)",
      gap: "2px",
      marginBottom: "2px",
    },
    weekday: {
      textAlign: "center",
      fontSize: "11px",
      fontWeight: "600",
      color: "text-secondary",
      lineHeight: "24px",
      textTransform: "capitalize",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(7, 1fr)",
      gap: "2px",
    },
    day: {
      height: "34px",
      padding: "0",
      border: "none",
      borderRadius: "radius-sm",
      backgroundColor: "transparent",
      color: "text-primary",
      fontSize: "13px",
      fontVariantNumeric: "tabular-nums",
      cursor: "pointer",
      userSelect: "none",
      transition: CONTROL_TRANSITION,
      _hover: {
        backgroundColor: "color-primary-soft",
      },
      _active: {
        transform: "scale(0.92)",
      },
      _focusVisible: {
        outline: "none",
        boxShadow: "focus-ring",
      },
      "&[data-outside]": {
        color: "text-secondary",
        opacity: 0.55,
      },
      "&[data-today]": {
        fontWeight: "bold",
        boxShadow: "inset 0 0 0 1px {colors.color-primary}",
      },
      "&[data-selected]": {
        backgroundColor: "color-primary",
        color: "text-on-primary",
        fontWeight: "bold",
        opacity: 1,
        animation: "scaleIn 0.18s ease-out",
        _hover: {
          backgroundColor: "color-primary",
        },
      },
      _disabled: {
        opacity: 0.3,
        cursor: "not-allowed",
        backgroundColor: "transparent",
        transform: "none",
      },
    },
    footer: {
      display: "flex",
      justifyContent: "space-between",
      gap: "8px",
      marginTop: "8px",
      paddingTop: "8px",
      borderTop: "1px solid",
      borderColor: "border-color",
    },
    footerButton: {
      height: "28px",
      padding: "0 10px",
      border: "none",
      borderRadius: "radius-sm",
      backgroundColor: "transparent",
      color: "color-primary",
      fontSize: "13px",
      fontWeight: "600",
      cursor: "pointer",
      transition: CONTROL_TRANSITION,
      _hover: {
        backgroundColor: "color-primary-soft",
      },
      _focusVisible: {
        outline: "none",
        boxShadow: "focus-ring",
      },
      _disabled: {
        opacity: 0.35,
        cursor: "not-allowed",
        backgroundColor: "transparent",
      },
    },
  },
});
