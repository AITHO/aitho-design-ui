import { defineSlotRecipe } from "@pandacss/dev";

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
      rowGap: "5px",
    },
    itemsWrapper: {
      display: "flex",
      gap: "5px",
      flexWrap: "wrap",
    },
    inputWrapper: {
      border: "1px solid",
      backgroundColor: "background-primary",
      color: "text-primary",
      padding: "0.5rem 1.125rem 0.5rem 0.5rem",
      display: "flex",
      gap: "0.313rem",
      alignItems: "center",
      _hover: {
        backgroundColor: "background-secondary",
        borderColor: "border-color",
      },
    },
    inputField: {
      width: "100%",
      _placeholder: {
        color: "background-popup",
      },
      _focusVisible: {
        outlineWidth: "2px",
        outlineStyle: "solid",
        outlineColor: "color-primary",
        outlineOffset: "2px",
        borderRadius: "radius-sm",
      },
    },
    tagItem: {
      color: "dark",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "max-content",
      backgroundColor: "color-primary-disabled",
      padding: "0.125rem 0.375rem",
      "& p": {
        marginRight: "0.625rem",
      },
      _focusVisible: {
        outlineWidth: "2px",
        outlineStyle: "solid",
        outlineColor: "color-primary",
        outlineOffset: "2px",
        borderRadius: "radius-sm",
      },
    },
    removeButton: {
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      background: "none",
      border: "none",
      padding: "0",
      _focusVisible: {
        outlineWidth: "2px",
        outlineStyle: "solid",
        outlineColor: "color-primary",
        outlineOffset: "2px",
        borderRadius: "radius-sm",
      },
      "[data-panda-theme='dark'] &:focus-visible": {
        outlineColor: "white",
      },
    },
    toggleIcon: {
      color: "text-secondary",
      cursor: "pointer",
      _focusVisible: {
        outline: "2px solid",
        outlineColor: "color-primary",
        outlineOffset: "2px",
        borderRadius: "radius-sm",
      },
    },
    dropdown: {
      display: "flex",
      flexDirection: "column",
      padding: "0px 0.625rem",
      maxHeight: "0px",
      overflow: "hidden",
      transition: "all 0.3s",
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
      padding: "0.438rem",
      backgroundColor: "background-secondary",
      border: "1px solid",
      color: "text-primary",
    },
    dropdownOption: {
      padding: "0.313rem",
      textAlign: "start",
      cursor: "pointer",
      transition: "all 0.3s",
      marginY: "0.125rem",
      _first: {
        marginTop: "0px",
      },
      _last: {
        marginBottom: "0px",
      },
      _hover: {
        backgroundColor: "color-primary-hover",
        color: "text-on-primary",
      },
    },
    selected: {
      color: "dark",
      backgroundColor: "color-primary-disabled",
    },
    highlighted: {
      backgroundColor: "color-primary-hover",
      color: "text-on-primary",
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
        inputWrapper: { borderColor: "border-color" },
        dropdownOpen: { borderColor: "background-contrast" },
      },
      primary: {
        inputWrapper: { borderColor: "color-primary" },
        dropdownOpen: { borderColor: "color-primary" },
      },
      error: {
        inputWrapper: { borderColor: "color-error" },
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
        tagItem: { borderRadius: "radius" },
        dropdownOpen: { borderRadius: "radius" },
        dropdownOption: { borderRadius: "radius" },
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
