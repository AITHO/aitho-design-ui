import { defineSlotRecipe } from "@pandacss/dev";

export const tabRecipe = defineSlotRecipe({
  className: "tab",
  slots: ["root", "list", "trigger", "content"],
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",
    },
    list: {
      display: "flex",
      flexDirection: "row",
      gap: "0.25rem",
      borderBottom: "1px solid",
      borderColor: "border-color",
    },
    trigger: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      padding: "0.5625rem 0.75rem",
      fontSize: "0.875rem",
      fontWeight: "600",
      whiteSpace: "nowrap",
      userSelect: "none",
      cursor: "pointer",
      color: "text-secondary",
      position: "relative",
      transition:
        "color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease",
      _hover: {
        color: "text-primary",
      },
      _selected: {
        color: "color-primary",
        _hover: {
          color: "color-primary",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: "0",
          left: "0",
          right: "0",
          height: "2px",
          borderRadius: "1px",
          backgroundColor: "color-primary",
          animation: "tabAnimateBorder 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        },
      },
      _disabled: {
        cursor: "not-allowed",
        opacity: 0.45,
        _hover: {
          color: "text-secondary",
        },
      },
      _focusVisible: {
        outline: "none",
        boxShadow: "focus-ring",
        borderRadius: "radius-sm",
      },
    },
    content: {
      padding: "0.875rem 0.125rem 0",
      fontSize: "0.875rem",
      color: "text-secondary",
      backgroundColor: "transparent",
      borderRadius: "radius",
      flexGrow: 1,
      width: "100%",
      height: "100%",
      "&[data-state='active']": {
        animation: "fadeIn 0.2s ease-out",
      },
      _focusVisible: {
        outline: "none",
        boxShadow: "focus-ring",
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
          borderRight: "1px solid",
          borderColor: "border-color",
        },
        trigger: {
          _selected: {
            "&::after": {
              top: "0",
              left: "auto",
              width: "2px",
              height: "auto",
              animationName: "growY",
            },
          },
        },
        content: {
          padding: "0.5625rem 0 0 1rem",
        },
      },
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
});
