import { defineSlotRecipe } from "@pandacss/dev";
import { FIELD_HOVER_BORDER } from "../Input/Input.recipe";
import { CHECK_MARK } from "../Select/Select.recipe";

export const selectTagsRecipe = defineSlotRecipe({
  className: "selectTags",
  slots: [
    "wrapper",
    "itemsWrapper",
    "inputField",
    "inputWrapper",
    "tagItem",
    "removeButton",
    "toggleIcon",
    "dropdown",
    "dropdownOpen",
    "dropdownOption",
    "selected",
    "highlighted",
    "dropdownUp",
  ],
  base: {
    wrapper: {
      display: "flex",
      flexDirection: "column",
      rowGap: "0.375rem",
    },
    itemsWrapper: {
      display: "flex",
      gap: "0.375rem",
      flexWrap: "wrap",
      _empty: {
        display: "none",
      },
    },
    inputWrapper: {
      border: "1px solid",
      backgroundColor: "background-primary",
      color: "text-primary",
      minHeight: "2.375rem",
      padding: "0.25rem 0.625rem 0.25rem 0.75rem",
      display: "flex",
      gap: "0.5rem",
      alignItems: "center",
      transition:
        "border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease",
      _focusWithin: {
        boxShadow: "focus-ring",
      },
    },
    inputField: {
      flex: 1,
      minWidth: 0,
      width: "100%",
      fontSize: "0.875rem",
      color: "inherit",
      backgroundColor: "transparent",
      border: "none",
      outline: "none",
      _placeholder: {
        color: "text-secondary",
        opacity: 0.75,
      },
    },
    tagItem: {
      color: "color-primary",
      display: "inline-flex",
      alignItems: "center",
      gap: "0.25rem",
      width: "max-content",
      height: "1.5rem",
      padding: "0 0.25rem 0 0.5rem",
      fontSize: "0.75rem",
      fontWeight: "semibold",
      backgroundColor: "color-primary-soft",
      userSelect: "none",
      transition: "background-color 0.15s ease, color 0.15s ease",
    },
    removeButton: {
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "1.125rem",
      height: "1.125rem",
      borderRadius: "50%",
      background: "transparent",
      color: "inherit",
      border: "none",
      padding: "0",
      transition: "background-color 0.15s ease, box-shadow 0.15s ease",
      "& svg": {
        width: "0.75rem",
        height: "0.75rem",
      },
      _hover: {
        backgroundColor: "color-primary-soft",
      },
      _focusVisible: {
        outline: "none",
        boxShadow: "focus-ring",
      },
    },
    toggleIcon: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      color: "text-secondary",
      cursor: "pointer",
      background: "none",
      border: "none",
      padding: "0",
      borderRadius: "radius-sm",
      transition: "color 0.15s ease, box-shadow 0.15s ease",
      _hover: {
        color: "text-primary",
      },
      _focusVisible: {
        outline: "none",
        boxShadow: "focus-ring",
      },
    },
    dropdown: {
      display: "flex",
      flexDirection: "column",
      padding: "0 0.25rem",
      maxHeight: "0px",
      overflow: "hidden",
      transition: "all 0.2s ease",
      zIndex: "999",
      width: "100%",

      "&::-webkit-scrollbar": {
        width: "0.75rem",
        height: "0.75rem",
      },
      "&::-webkit-scrollbar-track": {
        background: "background-tertiary",
        borderRadius: "radius",
      },
      "&::-webkit-scrollbar-thumb": {
        background: "color-primary",
        borderRadius: "radius",
        cursor: "pointer",
      },
    },
    dropdownOpen: {
      overflow: "auto",
      padding: "0.25rem",
      backgroundColor: "background-secondary",
      border: "1px solid",
      boxShadow: "overlay",
      color: "text-primary",
      animation: "popIn 0.14s ease-out",
    },
    dropdownOption: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "0.5rem",
      flexShrink: 0,
      padding: "0.438rem 0.625rem",
      fontSize: "0.875rem",
      textAlign: "start",
      cursor: "pointer",
      userSelect: "none",
      transition: "background-color 0.15s ease, color 0.15s ease",
      _hover: {
        backgroundColor: "color-primary-soft",
      },
      _focusVisible: {
        outline: "none",
        boxShadow: "focus-ring",
      },
    },
    selected: {
      fontWeight: "semibold",
      _after: CHECK_MARK,
    },
    highlighted: {
      backgroundColor: "color-primary-soft",
      outline: "none",
    },
    dropdownUp: {
      top: "auto",
      bottom: "100%",
      marginBottom: "0.5rem",
    },
  },
  variants: {
    borderColor: {
      base: {
        inputWrapper: {
          borderColor: "border-color",
          "&:hover:not(:focus-within)": { borderColor: FIELD_HOVER_BORDER },
          _focusWithin: { borderColor: "color-primary" },
        },
        dropdownOpen: { borderColor: "border-color" },
      },
      primary: {
        inputWrapper: { borderColor: "color-primary" },
        dropdownOpen: { borderColor: "color-primary" },
      },
      error: {
        inputWrapper: {
          borderColor: "color-error",
          _focusWithin: { boxShadow: "focus-ring-error" },
        },
        dropdownOpen: { borderColor: "border-color" },
      },
    },
    roundness: {
      none: {
        inputWrapper: { borderRadius: "0px" },
        tagItem: { borderRadius: "0px" },
        dropdownOpen: { borderRadius: "0px" },
        dropdownOption: { borderRadius: "0px" },
      },
      rounded: {
        inputWrapper: { borderRadius: "radius" },
        tagItem: { borderRadius: "radius-sm" },
        dropdownOpen: { borderRadius: "radius" },
        dropdownOption: { borderRadius: "radius-sm" },
      },
    },
    height: {
      xs: { dropdownOpen: { maxHeight: "12.5rem" } },
      sm: { dropdownOpen: { maxHeight: "15.625rem" } },
      md: { dropdownOpen: { maxHeight: "18.75rem" } },
      lg: { dropdownOpen: { maxHeight: "21.875rem" } },
      xl: { dropdownOpen: { maxHeight: "25rem" } },
    },
  },
  defaultVariants: {
    roundness: "rounded",
    height: "md",
    borderColor: "base",
  },
});
