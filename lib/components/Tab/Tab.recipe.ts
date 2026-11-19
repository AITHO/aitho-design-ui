import { defineSlotRecipe } from "@pandacss/dev";

export const tabRecipe = defineSlotRecipe({
  className: "tab",
  slots: ["root", "list", "trigger", "content", "indicator"],
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",
    },
    list: {
      position: "relative",
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
      _focusVisible: {
        outline: "none",
        boxShadow: "focus-ring",
      },
    },
    // The underline of the selected tab, one for the whole list: it slides to the new tab while the
    // panel changes at once, so it shows where the selection went without making anyone wait.
    indicator: {
      position: "absolute",
      top: "0",
      left: "0",
      width: "0",
      height: "2px",
      borderRadius: "1px",
      backgroundColor: "color-primary",
      pointerEvents: "none",
      "&[data-ready]": {
        transition:
          "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), width 0.2s cubic-bezier(0.4, 0, 0.2, 1), height 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      },
      "@media (prefers-reduced-motion: reduce)": {
        "&[data-ready]": { transition: "none" },
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
        indicator: {
          width: "2px",
          height: "0",
        },
        content: {
          padding: "0.5625rem 0 0 1rem",
        },
      },
    },
    // Many tabs go onto more rows instead of pushing the page sideways; the indicator follows the
    // selected tab on whatever row it lands.
    wrap: {
      true: { list: { flexWrap: "wrap" } },
      false: {},
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    wrap: false,
  },
});
