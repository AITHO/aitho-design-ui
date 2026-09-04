import { defineSlotRecipe } from "@pandacss/dev";

export const paginationRecipe = defineSlotRecipe({
  className: "pagination",
  slots: ["root"],
  base: {
    root: {
      display: "flex",
      gap: "0.25rem",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "md",
      padding: "0.375rem",
    },
  },
});
