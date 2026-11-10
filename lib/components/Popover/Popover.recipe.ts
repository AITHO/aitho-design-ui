import { defineSlotRecipe } from "@pandacss/dev";

export const popoverRecipe = defineSlotRecipe({
  className: "popover",
  slots: ["trigger", "content", "close", "arrow"],
  base: {
    content: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      width: "max-content",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "border-color",
      boxShadow: "overlay",
      outline: "none",
      transformOrigin: "var(--radix-popover-content-transform-origin)",
      _open: { animation: "popIn 0.14s ease-out" },
      _closed: { animation: "popOut 0.1s ease-in" },
    },

    // Always rendered: the content's right padding keeps text clear of it.
    close: {
      position: "absolute",
      right: "8px",
      top: "8px",
      display: "grid",
      placeItems: "center",
      width: "24px",
      height: "24px",
      borderRadius: "radius-sm",
      cursor: "pointer",
      userSelect: "none",
      transition:
        "background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease",
      _hover: {
        backgroundColor: "color-primary-soft",
        color: "text-primary",
      },
      _focusVisible: { outline: "none", boxShadow: "focus-ring" },
    },
    arrow: {
      fill: "border-color",
    },
  },
  variants: {
    variant: {
      primary: {
        content: {
          backgroundColor: "background-secondary",
          color: "text-primary",
        },
        close: {
          color: "text-secondary",
        },
      },
      secondary: {
        content: {
          backgroundColor: "background-secondary",
          color: "text-secondary",
        },
        close: {
          color: "text-secondary",
        },
      },
    },
    size: {
      sm: {
        content: {
          padding: "10px 36px 10px 12px",
          maxWidth: "12.5rem",
          fontSize: "sm",
        },
        arrow: { width: "0.5rem", height: "0.25rem" },
      },
      md: {
        content: {
          padding: "14px 40px 14px 14px",
          maxWidth: "18.75rem",
          fontSize: "md",
        },
        arrow: { width: "0.75rem", height: "0.5rem" },
      },
      lg: {
        content: {
          padding: "16px 42px 16px 16px",
          maxWidth: "25rem",
          fontSize: "lg",
        },
        arrow: { width: "1rem", height: "0.625rem" },
      },
      xl: {
        content: {
          padding: "20px 46px 20px 20px",
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
