import { defineSlotRecipe } from "@pandacss/dev";

// Hover border of every text field: a step stronger than the resting border.
export const FIELD_HOVER_BORDER =
  "color-mix(in srgb, {colors.border-color} 55%, {colors.text-secondary})";

const FIELD_TRANSITION =
  "border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease";

// Border states live in the variants: Panda emits variants after base, so a base
// :hover/:focus border would always lose to the variant's resting border color.
export const INVALID_STATE = {
  "&[aria-invalid=true]": { borderColor: "color-error" },
  "&[aria-invalid=true]:focus-visible": { boxShadow: "focus-ring-error" },
};

export const inputRecipe = defineSlotRecipe({
  className: "input",
  slots: [
    "inputWrapper",
    "requiredMark",
    "inputContainer",
    "iconStyle",
    "iconStyleDelete",
    "inputField",
    "errorText",
  ],
  base: {
    inputWrapper: {
      display: "flex",
      alignItems: "center",
      gap: "0.938rem",
      width: "full",
    },
    requiredMark: {
      color: "color-error",
    },
    inputContainer: {
      position: "relative",
      width: "100%",
    },
    iconStyle: {
      position: "absolute",
      zIndex: 20,
      color: "text-secondary",
      height: "1rem",
      width: "1rem",
      cursor: "pointer",
      right: "0.75rem",
      top: "50%",
      transform: "translateY(-50%)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      background: "none",
      border: "none",
      borderRadius: "radius-sm",
      padding: "0",
      transition: "color 0.15s ease, box-shadow 0.15s ease",
      _hover: {
        color: "text-primary",
      },
      _focusVisible: {
        outline: "none",
        boxShadow: "focus-ring",
      },
    },
    inputField: {
      border: "1px solid",
      backgroundColor: "background-primary",
      color: "text-primary",
      height: "2.375rem",
      padding: "0 0.75rem",
      fontSize: "0.875rem",
      minWidth: "15.625rem",
      width: "100%",
      transition: FIELD_TRANSITION,
      // Room for the search / password icon placed right after the input.
      "&:has(+ *)": {
        paddingRight: "2.25rem",
      },
      _disabled: {
        cursor: "not-allowed",
        opacity: "0.55",
        backgroundColor: "background-secondary",
      },
      _focusVisible: {
        outline: "none",
        boxShadow: "focus-ring",
      },
      _placeholder: {
        color: "text-secondary",
        opacity: 0.75,
      },
      "&::-webkit-calendar-picker-indicator": {
        cursor: "pointer",
        borderRadius: "radius-sm",
        marginRight: "0.125rem",
        filter: "invert(0.7)",
      },
      "&::-ms-clear": {
        display: "none",
      },
      "&::-ms-reveal": {
        display: "none",
      },
    },
    errorText: {
      color: "color-error",
      fontSize: "0.75rem",
    },
  },
  variants: {
    borderColor: {
      base: {
        inputField: {
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
        inputField: { borderColor: "color-primary", ...INVALID_STATE },
      },
      error: {
        inputField: {
          borderColor: "color-error",
          _focusVisible: { boxShadow: "focus-ring-error" },
        },
      },
    },
    borderRadius: {
      none: { inputField: { borderRadius: "0px" } },
      rounded: { inputField: { borderRadius: "radius" } },
    },
  },
  defaultVariants: {
    borderColor: "base",
    borderRadius: "rounded",
  },
});
