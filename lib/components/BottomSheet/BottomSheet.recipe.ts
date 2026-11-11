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
      // Same fixed scrim as Dialog.
      backgroundColor: "rgb(5 10 18 / 0.55)",
      backdropFilter: "blur(2px)",
      animation: "fadeIn 0.24s ease-out",
    },
    panel: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      display: "flex",
      flexDirection: "column",
      backgroundColor: "background-secondary",
      color: "text-primary",
      outline: "none",
      animation: "bottomSheetSlideIn 0.24s cubic-bezier(0.2, 0.8, 0.2, 1)",
    },
    grabberRow: {
      display: "flex",
      justifyContent: "center",
      padding: "12px 0 6px",
      flexShrink: 0,
      touchAction: "none",
    },
    grabber: {
      width: "40px",
      height: "4px",
      borderRadius: "2px",
      backgroundColor: "border-color",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "2",
      padding: "8px 20px 8px",
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
      display: "grid",
      placeItems: "center",
      border: "none",
      backgroundColor: "transparent",
      color: "text-secondary",
      fontSize: "1.25rem",
      cursor: "pointer",
      borderRadius: "radius-sm",
      flexShrink: 0,
      userSelect: "none",
      transition:
        "background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease",
      _hover: {
        backgroundColor: "color-primary-soft",
        color: "text-primary",
      },
      _focusVisible: { outline: "none", boxShadow: "focus-ring" },
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
      backgroundColor: "background-secondary",
      flexShrink: 0,
    },
  },
  variants: {
    fullScreen: {
      false: {
        panel: {
          width: "min(560px, 100%)",
          marginX: "auto",
          maxHeight: "88dvh",
          borderWidth: "1px 1px 0",
          borderStyle: "solid",
          borderColor: "border-color",
          borderTopRadius: "radius-lg",
          boxShadow: "overlay",
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
