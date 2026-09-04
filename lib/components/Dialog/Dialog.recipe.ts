import { defineSlotRecipe } from "@pandacss/dev";

export const dialogRecipe = defineSlotRecipe({
  className: "dialog",
  slots: [
    "overlay",
    "content",
    "header",
    "title",
    "description",
    "close",
    "body",
    "footer",
  ],
  base: {
    overlay: {
      backgroundColor: "background-overlay",
      position: "fixed",
      inset: 0,
      zIndex: "999",
    },
    content: {
      maxHeight: "90%",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "background-primary",
      color: "text-primary",
      boxShadow: [
        "background-contrast 0px 10px 38px -10px",
        "background-contrast 0px 10px 20px -15px",
      ],
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      padding: "1.563rem",
      borderRadius: "radius",
      zIndex: "999",
      animation: "dialogFadeIn 300ms cubic-bezier(0.16, 1, 0.3, 1)",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      pb: "2",
    },
    title: {
      fontSize: "lg",
      fontWeight: "bold",
      color: "text-primary",
    },
    description: {
      fontSize: "0.875rem",
      color: "text-secondary",
    },
    close: {
      bg: "transparent",
      fontSize: "lg",
      cursor: "pointer",
      position: "absolute",
      right: "0.75rem",
      top: "0.75rem",
      _focusVisible: {
        outlineWidth: "2px",
        outlineStyle: "solid",
        outlineColor: "color-primary",
        outlineOffset: "2px",
        borderRadius: "radius-sm",
      },
    },
    body: {
      py: "4",
      flexGrow: 1,
      overflowY: "auto",
    },
    footer: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "2",
      pt: "2",
    },
  },
  variants: {
    width: {
      sm: { content: { maxWidth: "35rem", width: "63vw" } },
      md: { content: { maxWidth: "50rem", width: "90vw" } },
      lg: { content: { maxWidth: "71.875rem", width: "95vw" } },
    },
  },
  defaultVariants: {
    width: "md",
  },
});
