import { defineSlotRecipe } from "@pandacss/dev";

export const scrollbarRecipe = defineSlotRecipe({
  className: "scrollbar",
  slots: ["thumb"],
  base: {
    thumb: {
      position: "absolute",
      // Above the sticky first column of a table (z-index 1, 2 in the header).
      zIndex: 3,
      borderRadius: "3px",
      backgroundColor: "var(--scrollbar-thumb)",
      touchAction: "none",
      transition: "background-color 0.15s ease",
      "&:hover, &[data-dragging]": {
        backgroundColor: "var(--scrollbar-thumb-hover)",
      },
    },
  },
});
