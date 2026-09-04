import { defineSlotRecipe } from "@pandacss/dev";

const BASE_STYLES = {
  root: {
    display: "flex",
    flexDirection: "column",
    width: "full",
    position: "relative",
    height: "auto",
    alignItems: "stretch",
    transition: "opacity 0.2s ease",
  },
  label: {
    color: "text-secondary",
    fontSize: "sm",
    fontWeight: "medium",
    lineHeight: "tight",
    marginBottom: "1",
    transition: "color 0.2s ease",
    _disabled: {
      color: "text-secondary",
    },
  },
  textarea: {
    width: "full",
    minHeight: "4.375rem",
    maxHeight: "13.125rem",
    resize: "none",
    borderRadius: "radius",
    backgroundColor: "background-primary",
    color: "text-primary",
    border: "1px solid",
    fontSize: "1rem",
    padding: "1rem",
    paddingRight: "3rem",
    boxSizing: "border-box",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    _placeholder: {
      color: "text-secondary",
      opacity: 0.6,
    },
    _hover: {
      backgroundColor: "background-secondary",
      borderColor: "color-primary",
      transform: "translateY(-1px)",
    },
    _focusVisible: {
      outlineWidth: "2px",
      outlineStyle: "solid",
      outlineColor: "color-primary",
      outlineOffset: "2px",
      borderRadius: "radius-sm",
    },
    _disabled: {
      cursor: "not-allowed",
      opacity: 0.6,
      backgroundColor: "background-tertiary",
      _hover: {
        transform: "none",
        boxShadow: "none",
      },
    },
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.125rem 0.25rem",
    transition: "opacity 0.2s ease",
  },
  counter: {
    fontSize: "sm",
    color: "text-secondary",
    marginLeft: "auto",
    transition: "color 0.2s ease",
    "&[data-state='char-length-exceeded']": {
      color: "color-error",
      fontWeight: "medium",
    },
  },
  indicator: {
    display: "flex",
    alignItems: "center",
    gap: "1",
    color: "text-secondary",
    fontSize: "sm",
    flex: "1",
    transition: "color 0.2s ease",
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
    borderRadius: "border-radius",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    _hover: {
      color: "color-primary-hover",
      backgroundColor: "background-overlay",
      transform: "translateY(-50%) scale(1.05)",
    },
    _active: {
      color: "color-primary-active",
      transform: "translateY(-50%) scale(0.95)",
    },
    _disabled: {
      opacity: 0.5,
      cursor: "not-allowed",
      _hover: {
        transform: "translateY(-50%)",
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
    right: "0.75rem",
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
    borderRadius: "calc(var(--radius) * 0.8)",
    color: "color-primary",
    cursor: "pointer",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    outline: "none",
    _hover: {
      color: "color-primary-hover",
      backgroundColor: "background-overlay",
      transform: "translateY(-50%) scale(1.05)",
    },
    _active: {
      color: "color-primary-active",
      transform: "translateY(-50%) scale(0.95)",
    },
    _disabled: {
      opacity: 0.5,
      cursor: "not-allowed",
      color: "text-secondary",
      _hover: {
        transform: "translateY(-50%)",
        backgroundColor: "transparent",
      },
    },
    _focus: {
      boxShadow: "0 0 0 2px var(--color-primary)",
      backgroundColor: "background-overlay",
    },
  },
} as const;

const SIZE_VARIANTS = {
  sm: {
    textarea: {
      padding: "0.75rem",
      paddingRight: "2.75rem",
      fontSize: "sm",
      minHeight: "3.75rem",
      borderRadius: "calc(border-radius * 0.8)",
    },
    label: { fontSize: "xs" },
    button: { width: "1.75rem", height: "1.75rem" },
    sendButton: {
      width: "1.75rem",
      height: "1.75rem",
      right: "8px",
      "& svg": {
        width: "1rem",
        height: "1rem",
      },
    },
  },
  md: {
    textarea: {
      padding: "1rem",
      paddingRight: "3rem",
      fontSize: "base",
      minHeight: "5rem",
      borderRadius: "border-radius",
    },
    label: { fontSize: "sm" },
    button: { width: "2rem", height: "2rem" },
    sendButton: {
      width: "2rem",
      height: "2rem",
      right: "0.75rem",
      "& svg": {
        width: "1.125rem",
        height: "1.125rem",
      },
    },
  },
  lg: {
    textarea: {
      padding: "1.25rem",
      paddingRight: "3.25rem",
      fontSize: "lg",
      minHeight: "6.25rem",
      borderRadius: "calc(border-radius * 1.2)",
    },
    label: { fontSize: "base" },
    button: { width: "2.25rem", height: "2.25rem" },
    sendButton: {
      width: "2.25rem",
      height: "2.25rem",
      right: "1rem",
      "& svg": {
        width: "1.25rem",
        height: "1.25rem",
      },
    },
  },
} as const;

const TYPE_VARIANT = {
  outline: {
    textarea: {
      backgroundColor: "background-primary",
      borderColor: "color-primary",
      _hover: {
        backgroundColor: "background-secondary",
        borderColor: "color-primary",
      },
    },
    label: { color: "text-primary" },
    sendButton: {
      color: "text-secondary",
      _hover: {
        color: "color-primary",
      },
    },
  },
  filled: {
    textarea: {
      backgroundColor: "background-secondary",
      borderColor: "transparent",
      _hover: {
        backgroundColor: "background-tertiary",
        borderColor: "transparent",
      },
    },
    label: { color: "text-primary" },
    sendButton: {
      color: "text-secondary",
      _hover: {
        color: "color-primary",
      },
    },
  },
  inputForm: {
    textarea: {
      backgroundColor: "background-primary",
      borderColor: "border-color",
      _hover: {
        backgroundColor: "background-secondary",
        borderColor: "border-color !important",
        transform: "translateY(0px) !important",
      },
      _active: {
        backgroundColor: "background-tertiary",
      },
    },
    label: { color: "text-primary" },
    sendButton: {
      color: "text-secondary",
      _hover: {
        color: "color-primary",
      },
    },
  },
  ghost: {
    textarea: {
      backgroundColor: "transparent",
      borderColor: "transparent",
      _hover: {
        backgroundColor: "background-secondary",
        borderColor: "transparent",
      },
    },
    label: { color: "text-secondary" },
    sendButton: {
      color: "text-secondary",
      _hover: {
        color: "color-primary",
      },
    },
  },
  glass: {
    textarea: {
      backgroundColor: "rgba(var(--background-primary), 0.08)",
      backdropFilter: "blur(8px)",
      border: "none",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), inset 0 0 0 1px rgba(var(--border-color), 0.08)",
      color: "text-primary",
      _hover: {
        backgroundColor: "rgba(var(--background-secondary), 0.12)",
        border: "1px solid",
        borderColor: "color-primary",
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), inset 0 0 0 1px rgba(var(--border-color), 0.12)",
        transform: "translateY(-2px)",
      },
      _disabled: {
        backgroundColor: "rgba(var(--background-tertiary), 0.03)",
        color: "text-secondary",
        boxShadow: "none",
        backdropFilter: "blur(4px)",
        opacity: 0.6,
        _hover: {
          transform: "none",
          boxShadow: "none",
        },
      },
      _placeholder: {
        color: "text-secondary",
        opacity: 0.8,
      },
    },
    label: {
      color: "text-primary",
      textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
    },
    counter: {
      color: "text-secondary",
      textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
      "&[data-state='char-length-exceeded']": {
        color: "color-error",
        fontWeight: "medium",
      },
    },
    indicator: {
      color: "text-secondary",
      textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
    },
    sendButton: {
      color: "text-primary",
      backdropFilter: "blur(8px)",
      backgroundColor: "rgba(var(--background-primary), 0.08)",
      _hover: {
        color: "color-primary",
        backgroundColor: "rgba(var(--background-secondary), 0.15)",
        transform: "translateY(-50%) scale(1.05)",
      },
      _active: {
        backgroundColor: "rgba(var(--background-secondary), 0.2)",
        transform: "translateY(-50%) scale(0.95)",
      },
      _disabled: {
        backgroundColor: "rgba(var(--background-tertiary), 0.03)",
        color: "text-secondary",
        opacity: 0.6,
        _hover: {
          transform: "translateY(-50%)",
          backgroundColor: "rgba(var(--background-tertiary), 0.03)",
        },
      },
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
      base: { textarea: { borderColor: "border-color" } },
      primary: { textarea: { borderColor: "color-primary" } },
      error: { textarea: { borderColor: "color-error" } },
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
