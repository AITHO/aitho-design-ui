import { defineSlotRecipe } from "@pandacss/dev";

const transition =
  "background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease";

export const filterChipBarRecipe = defineSlotRecipe({
  className: "filter-chip-bar",
  slots: ["root", "filtersButton", "count", "chip", "chipLabel", "chipRemove"],
  base: {
    root: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      overflowX: "auto",
      WebkitOverflowScrolling: "touch",
      scrollbarWidth: "none",
      // Room for the focus ring, which the scrolling row would clip.
      padding: "3px",
      minWidth: 0,
      "&::-webkit-scrollbar": {
        display: "none",
      },
    },
    filtersButton: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      height: "30px",
      padding: "0 10px",
      border: "1px solid",
      borderColor: "color-primary",
      borderRadius: "radius",
      backgroundColor: "transparent",
      color: "color-primary",
      fontFamily: "inherit",
      fontSize: "13px",
      fontWeight: "semibold",
      whiteSpace: "nowrap",
      cursor: "pointer",
      flexShrink: 0,
      userSelect: "none",
      transition,
      _hover: {
        backgroundColor: "color-primary-softer",
      },
      _active: {
        transform: "translateY(1px)",
      },
      _focusVisible: {
        outline: "none",
        boxShadow: "focus-ring",
      },
    },
    count: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: "18px",
      height: "18px",
      padding: "0 5px",
      borderRadius: "9px",
      backgroundColor: "color-primary",
      color: "text-on-primary",
      fontSize: "11px",
      fontWeight: "bold",
      lineHeight: "1",
      fontVariantNumeric: "tabular-nums",
    },
    chip: {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      height: "30px",
      padding: "0 6px 0 12px",
      border: "1px solid",
      borderColor: "border-color",
      borderRadius: "radius",
      backgroundColor: "background-primary",
      color: "text-primary",
      fontSize: "13px",
      whiteSpace: "nowrap",
      flexShrink: 0,
      userSelect: "none",
      transition,
      // Highlights the filter its remove button is about to clear.
      "&:has(button:hover), &:has(button:focus-visible)": {
        borderColor: "color-primary",
        backgroundColor: "color-primary-softer",
      },
    },
    chipLabel: {
      maxWidth: "11.25rem",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    chipRemove: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "20px",
      height: "20px",
      padding: "0",
      border: "none",
      borderRadius: "50%",
      backgroundColor: "background-tertiary",
      color: "text-primary",
      cursor: "pointer",
      flexShrink: 0,
      transition,
      "& svg": {
        width: "12px",
        height: "12px",
      },
      _hover: {
        backgroundColor:
          "color-mix(in srgb, {colors.background-tertiary} 80%, {colors.text-primary})",
      },
      _focusVisible: {
        outline: "none",
        boxShadow: "focus-ring",
      },
    },
  },
});
