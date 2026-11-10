import { defineSlotRecipe } from "@pandacss/dev";

export const scrollbarRecipe = defineSlotRecipe({
  className: "scrollbar",
  slots: ["thumb"],
  base: {
    thumb: {
      position: "absolute",
      zIndex: 1,
      width: "6px",
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
