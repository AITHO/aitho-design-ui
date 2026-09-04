import { defineSlotRecipe } from "@pandacss/dev";

export const loginButtonRecipe = defineSlotRecipe({
  className: "login-button",
  slots: ["root", "icon", "text"],
  base: {
    root: {
      height: "2.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.625rem",
      transition: "colors",
      bg: "background-primary",
      borderRadius: "radius",
      borderWidth: "1px",
      borderColor: "border-color",
      padding: "0.75rem",
      cursor: "pointer",
      _hover: {
        bg: "background-secondary",
      },
      _active: {
        bg: "background-tertiary",
      },
      _focusVisible: {
        outlineWidth: "2px",
        outlineStyle: "solid",
        outlineColor: "color-primary",
        outlineOffset: "2px",
      },
    },
    icon: {
      height: "1.25rem",
      width: "1.25rem",
    },
    text: {
      color: "text-primary",
      padding: "0",
      margin: "0",
    },
  },
  variants: {},
  defaultVariants: {},
});
