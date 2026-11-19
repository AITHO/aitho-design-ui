import { defineSlotRecipe } from "@pandacss/dev";

export const pdfPreviewRecipe = defineSlotRecipe({
  className: "pdf-preview",
  slots: ["root", "page", "status"],
  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
      width: "100%",
    },
    // A PDF page is white paper in both themes, like in any viewer.
    page: {
      margin: "0",
      overflow: "hidden",
      bg: "white",
      borderRadius: "0.25rem",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
      "& canvas": {
        display: "block",
        width: "100%",
        height: "auto",
      },
    },
    status: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "12rem",
      color: "text-secondary",
      textAlign: "center",
    },
  },
});
