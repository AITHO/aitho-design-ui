import { defineSlotRecipe } from "@pandacss/dev";

const CONTROL_TRANSITION =
  "background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease, opacity 0.15s ease";

// Hover of the trigger: never while disabled, and the focus border keeps precedence.
const INPUT_HOVER = "&:hover:not([data-disabled='true'], :focus-within)";

const NAVIGATION_BUTTON = {
  display: "grid",
  placeItems: "center",
  width: "30px",
  height: "30px",
  padding: "0",
  borderRadius: "radius-sm",
  color: "text-primary",
  cursor: "pointer",
  userSelect: "none",
  transition: CONTROL_TRANSITION,
  _hover: {
    backgroundColor: "color-primary-soft",
    color: "color-primary",
  },
  _active: {
    transform: "scale(0.92)",
  },
  _disabled: {
    opacity: 0.35,
    cursor: "not-allowed",
    transform: "none",
    _hover: {
      backgroundColor: "transparent",
      color: "text-primary",
    },
  },
  _focusVisible: {
    outline: "none",
    boxShadow: "focus-ring",
  },
};

const BASE_STYLES = {
  root: {
    position: "relative",
    display: "inline-block",
    width: "auto",
  },
  input: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "2",
    width: "100%",
    minWidth: "17.5rem",
    cursor: "pointer",
    border: "1px solid",
    borderColor: "border-color",
    borderRadius: "radius",
    transition:
      "border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease",
    backgroundColor: "background-primary",
    color: "text-primary",
    _focusWithin: {
      borderColor: "color-primary",
      boxShadow: "focus-ring",
    },
    "&[data-disabled='true']": {
      cursor: "not-allowed",
      opacity: 0.55,
      backgroundColor: "background-secondary",
    },
  },
  inputButton: {
    flex: "1",
    alignSelf: "stretch",
    minWidth: 0,
    cursor: "pointer",
    userSelect: "none",
    _disabled: {
      cursor: "not-allowed",
    },
    // The whole field shows the focus ring (see input).
    _focusVisible: {
      outline: "none",
    },
  },
  inputContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    gap: "2",
  },
  inputIcon: {
    width: "4",
    height: "4",
    flexShrink: 0,
    color: "text-secondary",
  },
  inputText: {
    flex: "1",
    textAlign: "left",
    whiteSpace: "nowrap",
  },
  clearButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    padding: "3px",
    borderRadius: "radius-sm",
    textAlign: "right",
    cursor: "pointer",
    color: "text-secondary",
    opacity: "0.5",
    transition: CONTROL_TRANSITION,
    _hover: {
      opacity: "1",
      color: "text-primary",
      backgroundColor: "color-primary-soft",
    },
    _focusVisible: {
      outline: "none",
      boxShadow: "focus-ring",
    },
    '&[data-clear-button="true"]': {
      opacity: "1",
    },
    "&[data-disabled='true']": {
      cursor: "not-allowed",
      opacity: "0.3",
      _hover: {
        opacity: "0.3",
        color: "text-secondary",
        backgroundColor: "transparent",
      },
    },
  },
  calendar: {
    position: "absolute",
    marginTop: "1.5",
    backgroundColor: "background-primary",
    border: "1px solid",
    borderColor: "border-color",
    borderRadius: "radius-lg",
    boxShadow: "overlay",
    padding: "3",
    zIndex: "10",
    display: "flex",
    gap: "6",
    width: "fit-content",
    animation: "popIn 0.14s ease-out",
  },
  monthContainer: {
    display: "flex",
    flexDirection: "column",
  },
  monthHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "2",
    userSelect: "none",
  },
  buttonContainer: {
    display: "flex",
    alignItems: "center",
    gap: "2px",
  },
  navigationIcon: {
    width: "4",
    height: "4",
  },
  monthTitle: {
    fontSize: "sm",
    fontWeight: "bold",
    color: "text-primary",
    flex: "1",
    textAlign: "center",
  },
  navigationButton: NAVIGATION_BUTTON,
  superNavigationButton: NAVIGATION_BUTTON,
  daysGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    // No column gap, so a selected range reads as one continuous band.
    gap: "2px 0",
  },
  dayHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "text-secondary",
    fontSize: "11px",
    fontWeight: "600",
    height: "6",
    userSelect: "none",
  },
  day: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0",
    borderRadius: "radius-sm",
    cursor: "pointer",
    position: "relative",
    color: "text-primary",
    fontVariantNumeric: "tabular-nums",
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
    '&[data-today="true"]': {
      boxShadow: "inset 0 0 0 1px {colors.color-primary}",
      _focusVisible: {
        boxShadow:
          "inset 0 0 0 1px {colors.color-primary}, {shadows.focus-ring}",
      },
    },
    '&[data-in-range="true"]': {
      backgroundColor: "color-primary-soft",
      color: "text-primary",
      borderRadius: "0",
    },
    '&[data-selected="true"]': {
      backgroundColor: "color-primary",
      color: "text-on-primary",
      fontWeight: "bold",
      animation: "scaleIn 0.18s ease-out",
      _hover: {
        backgroundColor: "color-primary",
      },
    },
    // Square the inner corners only where the range continues beside the cell.
    '&[data-range-start="true"]:has(+ [data-in-range="true"], + [data-range-end="true"])':
      {
        borderTopRightRadius: "0",
        borderBottomRightRadius: "0",
      },
    'button[data-in-range="true"] + &[data-range-end="true"]': {
      borderTopLeftRadius: "0",
      borderBottomLeftRadius: "0",
    },
    'button[data-range-start="true"] + &[data-range-end="true"]': {
      borderTopLeftRadius: "0",
      borderBottomLeftRadius: "0",
    },
    '&[data-disabled="true"]': {
      color: "text-secondary",
      cursor: "not-allowed",
      backgroundColor: "transparent",
      opacity: 0.45,
      transform: "none",
      _hover: {
        backgroundColor: "transparent",
      },
    },
    '&[data-out-of-month="true"]': {
      color: "text-secondary",
      opacity: 0.45,
      cursor: "default",
      _hover: {
        backgroundColor: "transparent",
      },
      _active: {
        transform: "none",
      },
    },
  },
};

const SIZE_VARIANTS = {
  sm: {
    input: {
      padding: "0 10px",
      fontSize: "13px",
      height: "8",
    },
    day: {
      height: "7",
      width: "7",
      fontSize: "xs",
    },
    monthTitle: {
      fontSize: "13px",
    },
  },
  md: {
    input: {
      padding: "0 12px",
      fontSize: "sm",
      height: "38px",
    },
    day: {
      height: "34px",
      width: "34px",
      fontSize: "13px",
    },
    monthTitle: {
      fontSize: "sm",
    },
  },
  lg: {
    input: {
      padding: "0 14px",
      fontSize: "15px",
      height: "11",
    },
    day: {
      height: "10",
      width: "10",
      fontSize: "sm",
    },
    monthTitle: {
      fontSize: "base",
    },
  },
};

const VARIANT_STYLES = {
  outline: {
    input: {
      backgroundColor: "background-primary",
      borderColor: "border-color",
      [INPUT_HOVER]: {
        borderColor:
          "color-mix(in srgb, {colors.border-color} 55%, {colors.text-secondary})",
      },
    },
  },
  filled: {
    input: {
      backgroundColor: "background-secondary",
      borderColor: "transparent",
      [INPUT_HOVER]: {
        borderColor: "border-color",
      },
    },
  },
  ghost: {
    input: {
      backgroundColor: "transparent",
      borderColor: "transparent",
      [INPUT_HOVER]: {
        backgroundColor: "background-secondary",
      },
    },
  },
};

export const rangeDatePickerRecipe = defineSlotRecipe({
  className: "rangeDatePicker",
  slots: [
    "root",
    "input",
    "inputButton",
    "inputContent",
    "inputIcon",
    "inputText",
    "clearButton",
    "calendar",
    "monthContainer",
    "monthHeader",
    "buttonContainer",
    "navigationIcon",
    "monthTitle",
    "navigationButton",
    "superNavigationButton",
    "daysGrid",
    "dayHeader",
    "day",
  ],
  base: BASE_STYLES,
  variants: {
    size: SIZE_VARIANTS,
    type: VARIANT_STYLES,
  },
  defaultVariants: {
    size: "md",
    type: "outline",
  },
});
