import { defineSlotRecipe } from "@pandacss/dev";
import { FIELD_HOVER_BORDER, INVALID_STATE } from "../Input/Input.recipe";

const BASE_STYLES = {
  root: {
    display: "flex",
    flexDirection: "column",
    width: "full",
    position: "relative",
    height: "auto",
    alignItems: "stretch",
    transition: "opacity 0.15s ease",
  },
  label: {
    color: "text-primary",
    fontSize: "0.8125rem",
    fontWeight: "semibold",
    lineHeight: "tight",
    marginBottom: "0.375rem",
    _disabled: {
      color: "text-secondary",
    },
  },
  textarea: {
    width: "full",
    minHeight: "6rem",
    maxHeight: "13.125rem",
    resize: "vertical",
    borderRadius: "radius",
    backgroundColor: "background-primary",
    color: "text-primary",
    border: "1px solid",
    fontSize: "0.875rem",
    lineHeight: "1.5",
    padding: "0.625rem 0.75rem",
    boxSizing: "border-box",
    transition:
      "border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease",
    // Room for the send button placed right after the textarea.
    "&:has(+ button)": {
      paddingRight: "3rem",
    },
    _placeholder: {
      color: "text-secondary",
      opacity: 0.75,
    },
    _focusVisible: {
      outline: "none",
      boxShadow: "focus-ring",
    },
    _disabled: {
      cursor: "not-allowed",
      opacity: 0.55,
      backgroundColor: "background-secondary",
    },
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "0.75rem",
    marginTop: "0.375rem",
    _empty: {
      display: "none",
    },
  },
  counter: {
    fontSize: "0.75rem",
    color: "text-secondary",
    marginLeft: "auto",
    transition: "color 0.15s ease",
    "&[data-state='char-length-exceeded']": {
      color: "color-error",
      fontWeight: "semibold",
    },
  },
  indicator: {
    display: "flex",
    alignItems: "center",
    gap: "1",
    color: "text-secondary",
    fontSize: "0.75rem",
    flex: "1",
  },
  button: {
    position: "absolute",
    right: "0.75rem",
    top: "50%",
    transform: "translateY(-50%)",
    width: "2rem",
    height: "2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    border: "0",
    cursor: "pointer",
    color: "color-primary",
    borderRadius: "radius-sm",
    userSelect: "none",
    transition:
      "background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease",
    _hover: {
      color: "color-primary-hover",
      backgroundColor: "color-primary-soft",
    },
    _active: {
      transform: "translateY(-50%) scale(0.92)",
    },
    _focusVisible: {
      outline: "none",
      boxShadow: "focus-ring",
    },
    _disabled: {
      opacity: 0.5,
      cursor: "not-allowed",
      _hover: {
        backgroundColor: "transparent",
      },
    },
  },
  wrapper: {
    position: "relative",
    width: "full",
    display: "flex",
    alignItems: "stretch",
  },
  sendButton: {
    position: "absolute",
    right: "0.5rem",
    top: "50%",
    transform: "translateY(-50%)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "2rem",
    height: "2rem",
    padding: "0",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "radius-sm",
    color: "color-primary",
    cursor: "pointer",
    userSelect: "none",
    transition:
      "background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease",
    _hover: {
      color: "color-primary",
      backgroundColor: "color-primary-soft",
    },
    _active: {
      transform: "translateY(-50%) scale(0.92)",
    },
    _focusVisible: {
      outline: "none",
      boxShadow: "focus-ring",
    },
    _disabled: {
      opacity: 0.5,
      cursor: "not-allowed",
      color: "text-secondary",
      _hover: {
        backgroundColor: "transparent",
      },
      _active: {
        transform: "translateY(-50%)",
      },
    },
  },
} as const;

const SIZE_VARIANTS = {
  sm: {
    textarea: {
      padding: "0.5rem 0.625rem",
      fontSize: "0.8125rem",
      minHeight: "4.5rem",
      "&:has(+ button)": { paddingRight: "2.5rem" },
    },
    label: { fontSize: "0.75rem" },
    button: { width: "1.75rem", height: "1.75rem" },
    sendButton: {
      width: "1.75rem",
      height: "1.75rem",
      right: "0.375rem",
      "& svg": {
        width: "1rem",
        height: "1rem",
      },
    },
  },
  md: {
    textarea: {
      padding: "0.625rem 0.75rem",
      fontSize: "0.875rem",
      minHeight: "6rem",
      "&:has(+ button)": { paddingRight: "3rem" },
    },
    label: { fontSize: "0.8125rem" },
    button: { width: "2rem", height: "2rem" },
    sendButton: {
      width: "2rem",
      height: "2rem",
      right: "0.5rem",
      "& svg": {
        width: "1.125rem",
        height: "1.125rem",
      },
    },
  },
  lg: {
    textarea: {
      padding: "0.75rem 0.875rem",
      fontSize: "1rem",
      minHeight: "7.5rem",
      borderRadius: "radius-lg",
      "&:has(+ button)": { paddingRight: "3.5rem" },
    },
    label: { fontSize: "0.9375rem" },
    button: { width: "2.25rem", height: "2.25rem" },
    sendButton: {
      width: "2.25rem",
      height: "2.25rem",
      right: "0.625rem",
      "& svg": {
        width: "1.25rem",
        height: "1.25rem",
      },
    },
  },
} as const;

// Border colors (resting, hover, focus) belong to the borderColor variant;
// types only set the surface so the two never fight over the same property.
const TYPE_VARIANT = {
  outline: {
    textarea: {
      backgroundColor: "background-primary",
    },
  },
  filled: {
    textarea: {
      backgroundColor: "background-secondary",
      borderColor: "transparent",
      "&:hover:not(:disabled)": {
        backgroundColor: "background-tertiary",
      },
      _focusVisible: {
        backgroundColor: "background-primary",
      },
    },
  },
  inputForm: {
    textarea: {
      backgroundColor: "background-primary",
    },
  },
  ghost: {
    textarea: {
      backgroundColor: "transparent",
      borderColor: "transparent",
      "&:hover:not(:disabled)": {
        backgroundColor: "background-secondary",
      },
    },
    label: { color: "text-secondary" },
  },
  glass: {
    textarea: {
      backgroundColor: "background-primary/10",
      backdropFilter: "blur(8px)",
      boxShadow: "raised",
      "&:hover:not(:disabled)": {
        backgroundColor: "background-primary/20",
      },
      _focusVisible: {
        boxShadow: "focus-ring",
      },
      _disabled: {
        backgroundColor: "background-tertiary/10",
        boxShadow: "none",
      },
    },
    label: {
      textShadow: "0 1px 2px rgb(0 0 0 / 0.1)",
    },
    counter: {
      textShadow: "0 1px 2px rgb(0 0 0 / 0.1)",
    },
    indicator: {
      textShadow: "0 1px 2px rgb(0 0 0 / 0.1)",
    },
    sendButton: {
      backdropFilter: "blur(8px)",
    },
  },
} as const;

export const textAreaRecipe = defineSlotRecipe({
  className: "textArea",
  slots: [
    "root",
    "label",
    "textarea",
    "footer",
    "counter",
    "indicator",
    "button",
    "wrapper",
    "sendButton",
  ],
  base: BASE_STYLES,
  variants: {
    size: SIZE_VARIANTS,
    type: TYPE_VARIANT,
    borderColor: {
      base: {
        textarea: {
          borderColor: "border-color",
          "&:hover:not(:disabled, :focus-visible, [aria-invalid=true])": {
            borderColor: FIELD_HOVER_BORDER,
          },
          "&:focus-visible:not([aria-invalid=true])": {
            borderColor: "color-primary",
          },
          ...INVALID_STATE,
        },
      },
      primary: {
        textarea: { borderColor: "color-primary", ...INVALID_STATE },
      },
      error: {
        textarea: {
          borderColor: "color-error",
          _focusVisible: { boxShadow: "focus-ring-error" },
        },
      },
    },
  },
  defaultVariants: {
    size: "md",
    type: "outline",
    borderColor: "base",
  },
});

export type TextAreaSlots = keyof typeof BASE_STYLES;

export const textAreaStyles = {
  base: BASE_STYLES,
  sizes: SIZE_VARIANTS,
  types: TYPE_VARIANT,
} as const;
