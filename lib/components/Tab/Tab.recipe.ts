import { defineSlotRecipe } from "@pandacss/dev";

export const tabRecipe = defineSlotRecipe({
  className: "tab",
  slots: ["root", "list", "trigger", "content"],
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      gap: "0.25rem",
      width: "100%",
      height: "100%",
    },
    list: {
      display: "flex",
      flexDirection: "row",
      borderBottom: "1px solid",
      borderColor: "border-color",
    },
    trigger: {
      display: "flex",
      alignItems: "center",
      padding: "0.5rem 1rem",
      fontSize: "0.875rem",
      fontWeight: "medium",
      cursor: "pointer",
      color: "text-secondary",
      borderBottom: "1px solid transparent",
      transition: "color 300ms",
      position: "relative",
      gap: "0.5rem",
      _hover: {
        color: "color-primary-hover",
      },
      _selected: {
        color: "color-primary-hover",
        "&::after": {
          marginBottom: "-0.125rem",
          content: '""',
          position: "absolute",
          bottom: "0",
          left: "0",
          right: "0",
          height: "0.125rem",
          backgroundColor: "color-primary-hover",
          animation: "tabAnimateBorder 300ms ease-in-out",
        },
      },
      _disabled: {
        cursor: "not-allowed",
        color: "color-primary-disabled",
        _hover: {
          color: "color-primary-disabled",
        },
      },
      _focusVisible: {
        outlineWidth: "2px",
        outlineStyle: "solid",
        outlineColor: "color-primary",
        outlineOffset: "2px",
        borderRadius: "radius-sm",
      },
    },
    content: {
      padding: "1rem",
      fontSize: "0.875rem",
      color: "text-primary",
      backgroundColor: "transparent",
      borderRadius: "radius",
      flexGrow: 1,
      width: "100%",
      height: "100%",
      _focusVisible: {
        outlineWidth: "2px",
        outlineStyle: "solid",
        outlineColor: "color-primary",
        outlineOffset: "2px",
        borderRadius: "radius-sm",
      },
    },
  },
  variants: {
    orientation: {
      horizontal: {
        root: { flexDirection: "column" },
        list: { flexDirection: "row" },
      },
      vertical: {
        root: { flexDirection: "row" },
        list: {
          flexDirection: "column",
          borderBottom: "none",
          borderRight: "2px solid",
          borderColor: "border-color",
        },
      },
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});
