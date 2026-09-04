import { defineSlotRecipe } from "@pandacss/dev";

export const bottomSheetRecipe = defineSlotRecipe({
  className: "bottom-sheet",
  slots: [
    "root",
    "overlay",
    "panel",
    "grabberRow",
    "grabber",
    "header",
    "title",
    "close",
    "body",
    "footer",
  ],
  base: {
    root: {
      position: "fixed",
      inset: 0,
      zIndex: "999",
    },
    overlay: {
      position: "absolute",
      inset: 0,
      backgroundColor: "background-overlay",
    },
    panel: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      flexDirection: "column",
      backgroundColor: "background-primary",
      outline: "none",
      animation: "bottomSheetSlideIn 250ms ease-in-out",
    },
    grabberRow: {
      display: "flex",
      justifyContent: "center",
      padding: "0.625rem 0 0.125rem",
      flexShrink: 0,
      touchAction: "none",
    },
    grabber: {
      width: "2.5rem",
      height: "0.25rem",
      borderRadius: "999px",
      backgroundColor: "background-tertiary",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "2",
      padding: "0.5rem 1.25rem 0.75rem",
      borderBottom: "1px solid",
      borderColor: "border-color",
      flexShrink: 0,
    },
    title: {
      fontSize: "1.063rem",
      fontWeight: "bold",
      color: "text-primary",
      minWidth: 0,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    close: {
      width: "2.75rem",
      height: "2.75rem",
      marginRight: "-0.75rem",
      border: "none",
      backgroundColor: "transparent",
      color: "text-secondary",
      fontSize: "1.25rem",
      cursor: "pointer",
      borderRadius: "radius",
      flexShrink: 0,
      _focusVisible: {
        outlineWidth: "2px",
        outlineStyle: "solid",
        outlineColor: "color-primary",
        outlineOffset: "2px",
      },
    },
    body: {
      flex: 1,
      minHeight: 0,
      overflowY: "auto",
      WebkitOverflowScrolling: "touch",
      overscrollBehavior: "contain",
    },
    footer: {
      display: "flex",
      gap: "0.625rem",
      padding:
        "0.875rem 1.25rem calc(0.875rem + env(safe-area-inset-bottom, 0.75rem))",
      borderTop: "1px solid",
      borderColor: "border-color",
      backgroundColor: "background-primary",
      flexShrink: 0,
    },
  },
  variants: {
    fullScreen: {
      false: {
        panel: {
          borderRadius: "1rem 1rem 0 0",
          boxShadow: "0 -2px 12px rgba(0, 0, 0, 0.15)",
          maxHeight: "88dvh",
        },
      },
      true: {
        panel: {
          top: 0,
          maxHeight: "none",
          borderRadius: 0,
        },
        header: {
          paddingTop: "0.875rem",
        },
      },
    },
  },
  defaultVariants: {
    fullScreen: false,
  },
});
