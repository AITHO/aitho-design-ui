import { defineSlotRecipe } from "@pandacss/dev";

export const popoverRecipe = defineSlotRecipe({
  className: "popover",
  slots: ["trigger", "content", "close", "arrow"],
  base: {
    content: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      borderRadius: "md",
      width: "max-content",
    },

    close: {
      position: "absolute",
      right: "0.625rem",
      top: "0.625rem",
      cursor: "pointer",
      _focusVisible: {
        outlineWidth: "2px",
        outlineStyle: "solid",
        outlineColor: "color-primary",
        outlineOffset: "2px",
        borderRadius: "radius-sm",
      },
    },
    arrow: {
      fill: "border-color",
    },
  },
  variants: {
    variant: {
      primary: {
        content: {
          backgroundColor: "background-primary",
          color: "text-primary",
          border: "1px solid var(--border-color)",
        },
        close: {
          color: "text-primary",
        },
      },
      secondary: {
        content: {
          backgroundColor: "background-secondary",
          color: "text-secondary",
          border: "1px solid var(--border-color)",
        },
        close: {
          color: "text-secondary",
        },
      },
    },
    size: {
      sm: {
        content: { padding: "6", maxWidth: "12.5rem", fontSize: "sm" },
        arrow: { width: "0.5rem", height: "0.25rem" },
      },
      md: {
        content: { padding: "8", maxWidth: "18.75rem", fontSize: "md" },
        arrow: { width: "0.75rem", height: "0.5rem" },
      },
      lg: {
        content: {
          padding: "8",
          maxWidth: "25rem",
          fontSize: "lg",
        },
        arrow: { width: "1rem", height: "0.625rem" },
      },
      xl: {
        content: {
          padding: "10",
          maxWidth: "31.25rem",
          fontSize: "xl",
        },
        arrow: { width: "1.25rem", height: "1.25rem" },
      },
    },
    borderRadius: {
      sm: { content: { borderRadius: "radius-sm" } },
      md: { content: { borderRadius: "radius" } },
      lg: { content: { borderRadius: "radius-lg" } },
    },
  },
  defaultVariants: {
    size: "md",
    variant: "primary",
    borderRadius: "md",
  },
});
