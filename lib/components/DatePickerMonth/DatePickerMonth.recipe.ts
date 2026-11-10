import { defineSlotRecipe } from "@pandacss/dev";

const CONTROL_TRANSITION =
  "background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease, opacity 0.15s ease";

// Shared with DatePickerYear, whose popover has the same anatomy.
export const pickerPanelStyles = {
  popoverContent: {
    zIndex: "10",
    width: "16.25rem",
    padding: "12px",
    backgroundColor: "background-primary",
    border: "1px solid",
    borderColor: "border-color",
    borderRadius: "radius-lg",
    boxShadow: "overlay",
    willChange: "transform, opacity",
    _open: {
      animation: "popIn 0.14s ease-out",
    },
    "&[data-state='open'][data-side='top']": {
      animation: "fromBelow 0.14s ease-out",
    },
    _closed: {
      animation: "popOut 0.1s ease-in",
    },
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
    userSelect: "none",
    // The arrows are library Buttons: restyled here as compact icon buttons.
    "& > button": {
      display: "grid",
      placeItems: "center",
      width: "30px",
      height: "30px",
      padding: "0",
      border: "none",
      borderRadius: "radius-sm",
      backgroundColor: "transparent",
      color: "text-primary",
      cursor: "pointer",
      transition: CONTROL_TRANSITION,
      "& svg": {
        width: "15px",
        height: "15px",
        padding: "0",
        color: "inherit",
      },
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
  },
  yearHeader: {
    fontWeight: "bold",
    fontSize: "0.875rem",
    fontVariantNumeric: "tabular-nums",
    color: "text-primary",
  },
  clearButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "3px",
    border: "none",
    borderRadius: "radius-sm",
    backgroundColor: "transparent",
    color: "text-secondary",
    cursor: "pointer",
    position: "absolute",
    right: "0.5rem",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 1,
    transition: CONTROL_TRANSITION,
    _hover: {
      backgroundColor: "color-primary-soft",
      color: "text-primary",
    },
    _focusVisible: {
      outline: "none",
      boxShadow: "focus-ring",
    },
  },
};

export const pickerGridStyles = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "4px",
  // The cells are library Buttons: restyled here as calendar cells.
  "& > button": {
    width: "100%",
    height: "36px",
    padding: "0",
    border: "none",
    borderRadius: "radius-sm",
    backgroundColor: "transparent",
    color: "text-primary",
    boxShadow: "none",
    fontSize: "13px",
    fontWeight: "normal",
    fontVariantNumeric: "tabular-nums",
    textTransform: "capitalize",
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
    _disabled: {
      opacity: 0.35,
      cursor: "not-allowed",
      backgroundColor: "transparent",
      transform: "none",
    },
  },
  // The selected cell is the only one rendered with Button's primary variant.
  "& > button.aitho-button__root--variant_primary": {
    backgroundColor: "color-primary",
    color: "text-on-primary",
    fontWeight: "bold",
    animation: "scaleIn 0.18s ease-out",
    _hover: {
      backgroundColor: "color-primary",
    },
  },
};

export const datePickerMonthRecipe = defineSlotRecipe({
  className: "date-picker-month",
  slots: ["popoverContent", "header", "monthGrid", "yearHeader", "clearButton"],
  base: {
    ...pickerPanelStyles,
    monthGrid: pickerGridStyles,
  },
});
