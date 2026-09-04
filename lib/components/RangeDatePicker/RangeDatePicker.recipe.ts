import { defineSlotRecipe } from "@pandacss/dev";

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
    transition: "all 0.2s ease-in-out",
    backgroundColor: "background-primary",
    color: "text-primary",
    _hover: {
      borderColor: "color-primary",
      backgroundColor: "background-secondary",
    },
    "&[data-disabled='true']": {
      cursor: "not-allowed",
      opacity: 0.6,
      backgroundColor: "background-tertiary",
    },
  },
  inputButton: {
    cursor: "pointer",
    _disabled: {
      cursor: "not-allowed",
      opacity: 0.6,
    },
    _focusVisible: {
      outlineWidth: "2px",
      outlineStyle: "solid",
      outlineColor: "color-primary",
      outlineOffset: "2px",
      borderRadius: "radius-sm",
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
  },
  inputText: {
    flex: "1",
    textAlign: "left",
    whiteSpace: "nowrap",
  },
  clearButton: {
    textAlign: "right",
    cursor: "pointer",
    color: "background-popup",
    opacity: "0.5",
    _hover: {
      opacity: "1",
    },
    _focusVisible: {
      outlineWidth: "2px",
      outlineStyle: "solid",
      outlineColor: "color-primary",
      outlineOffset: "2px",
      borderRadius: "radius-sm",
    },
    '&[data-clear-button="true"]': {
      opacity: "1",
      color: "text-primary",
    },
    "&[data-disabled='true']": {
      cursor: "not-allowed",
      opacity: "0.3",
      _hover: {
        opacity: "0.3",
      },
    },
  },
  calendar: {
    position: "absolute",
    marginTop: "2",
    backgroundColor: "background-primary",
    border: "1px solid",
    borderColor: "border-color",
    borderRadius: "radius",
    boxShadow: "lg",
    padding: "4",
    zIndex: "10",
    display: "flex",
    gap: "8",
    width: "fit-content",
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
    padding: "0 2",
  },
  buttonContainer: {
    display: "flex",
    alignItems: "center",
    gap: "1",
  },
  navigationIcon: {
    width: "4",
    height: "4",
  },
  monthTitle: {
    fontSize: "sm",
    fontWeight: "medium",
    color: "text-primary",
    flex: "1",
    textAlign: "center",
  },
  navigationButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "8",
    height: "8",
    padding: "0",
    borderRadius: "full",
    color: "text-secondary",
    _hover: {
      backgroundColor: "background-secondary",
      color: "color-primary",
    },
    _disabled: {
      opacity: 0.3,
      cursor: "not-allowed",
      _hover: {
        backgroundColor: "transparent",
        color: "text-secondary",
      },
    },
    _focusVisible: {
      outlineWidth: "2px",
      outlineStyle: "solid",
      outlineColor: "color-primary",
      outlineOffset: "0px",
    },
  },
  superNavigationButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "8",
    height: "8",
    padding: "0",
    borderRadius: "full",
    color: "text-secondary",
    _hover: {
      backgroundColor: "background-secondary",
      color: "color-primary",
    },
    _focusVisible: {
      outlineWidth: "2px",
      outlineStyle: "solid",
      outlineColor: "color-primary",
      outlineOffset: "0px",
    },
  },
  daysGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "1",
  },
  dayHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "text-secondary",
    fontSize: "sm",
    fontWeight: "medium",
    height: "8",
  },
  day: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "radius-sm",
    cursor: "pointer",
    position: "relative",
    color: "text-primary",
    _hover: {
      backgroundColor: "background-secondary",
    },
    '&[data-selected="true"]': {
      backgroundColor: "color-primary",
      color: "text-on-primary",
      _hover: {
        backgroundColor: "color-primary-hover",
      },
    },
    '&[data-in-range="true"]': {
      backgroundColor: "background-tertiary",
      color: "text-primary",
      borderRadius: "none",
      _before: {
        content: '""',
        position: "absolute",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        backgroundColor: "color-primary",
        opacity: "0.1",
        zIndex: "-1",
      },
    },
    '&[data-range-start="true"]': {
      borderTopLeftRadius: "radius-sm",
      borderBottomLeftRadius: "radius-sm",
    },
    '&[data-range-end="true"]': {
      borderTopRightRadius: "radius-sm",
      borderBottomRightRadius: "radius-sm",
    },
    '&[data-disabled="true"]': {
      color: "text-secondary",
      cursor: "not-allowed",
      backgroundColor: "transparent",
      opacity: 0.5,
      _hover: {
        backgroundColor: "transparent",
      },
    },
    '&[data-today="true"]': {
      fontWeight: "bold",
      _before: {
        content: '""',
        position: "absolute",
        width: "1",
        height: "1",
        borderRadius: "full",
        backgroundColor: "color-primary",
        bottom: "1",
      },
    },
    '&[data-out-of-month="true"]': {
      color: "text-secondary",
      opacity: 0.5,
    },
    _focusVisible: {
      outlineWidth: "2px",
      outlineStyle: "solid",
      outlineColor: "color-primary",
      outlineOffset: "0px",
    },
  },
};

const SIZE_VARIANTS = {
  sm: {
    input: {
      padding: "2",
      fontSize: "sm",
      height: "8",
    },
    day: {
      height: "6",
      width: "6",
      fontSize: "xs",
    },
    monthTitle: {
      fontSize: "xs",
    },
  },
  md: {
    input: {
      padding: "3",
      fontSize: "base",
      height: "10",
    },
    day: {
      height: "8",
      width: "8",
      fontSize: "sm",
    },
    monthTitle: {
      fontSize: "sm",
    },
  },
  lg: {
    input: {
      padding: "4",
      fontSize: "lg",
      height: "12",
    },
    day: {
      height: "10",
      width: "10",
      fontSize: "base",
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
      _hover: {
        borderColor: "color-primary",
        backgroundColor: "background-secondary",
      },
      _focus: {
        borderColor: "color-primary",
        boxShadow: "0 0 0 2px var(--focus-ring)",
      },
    },
  },
  filled: {
    input: {
      backgroundColor: "background-secondary",
      borderColor: "transparent",
      _hover: {
        backgroundColor: "background-tertiary",
      },
      _focus: {
        borderColor: "color-primary",
        boxShadow: "0 0 0 2px var(--focus-ring)",
      },
    },
  },
  ghost: {
    input: {
      backgroundColor: "transparent",
      borderColor: "transparent",
      _hover: {
        backgroundColor: "background-secondary",
      },
      _focus: {
        borderColor: "color-primary",
        boxShadow: "0 0 0 2px var(--focus-ring)",
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
