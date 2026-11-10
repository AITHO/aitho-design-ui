import { defineSlotRecipe } from "@pandacss/dev";
import { FIELD_HOVER_BORDER } from "../Input/Input.recipe";

// The item has no indicator element, so the selected check is drawn with a mask.
export const CHECK_MARK = {
  content: '""',
  flexShrink: 0,
  width: "0.875rem",
  height: "0.875rem",
  backgroundColor: "color-primary",
  maskImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='black' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M3.5 8.5l3 3 6-7'/%3E%3C/svg%3E\")",
  maskSize: "contain",
  maskRepeat: "no-repeat",
};

const OPEN = "&:is(:focus-visible, [data-state=open])";

export const selectRecipe = defineSlotRecipe({
  className: "select",
  slots: ["value", "trigger", "icon", "content", "viewport", "item", "input"],
  base: {
    input: {
      marginBottom: "0.25rem",
    },
    trigger: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: "radius",
      padding: "0 0.625rem 0 0.75rem",
      gap: "0.5rem",
      width: "100%",
      maxWidth: "100%",
      cursor: "pointer",
      overflow: "hidden",
      color: "text-primary",
      textAlign: "left",
      userSelect: "none",
      transition:
        "border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease",
      _focusVisible: {
        outline: "none",
      },
      [OPEN]: {
        boxShadow: "focus-ring",
      },
      "& .select-trigger-content": {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "0.5rem",
        flex: 1,
        minWidth: 0,
      },
      "& .select-trigger-icon": {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      },
      _placeholder: {
        color: "text-secondary",
      },
    },

    content: {
      color: "text-primary",
      // As wide as its longest option: never narrower than the trigger, never off screen.
      width: "max-content",
      minWidth: "var(--radix-select-trigger-width)",
      maxWidth:
        "var(--radix-select-content-available-width, calc(100vw - 16px))",
      // About eight options, then the list scrolls (it used to grow to the whole screen).
      maxHeight: "min(20rem, var(--radix-select-content-available-height))",
      "@media (max-width: 767.98px)": {
        maxHeight: "50dvh",
      },
      position: "relative",
      transform: "translateY(0)",
      overflowY: "auto",
      borderRadius: "radius",
      borderStyle: "solid",
      borderWidth: "1px",
      padding: "0.25rem",
      boxShadow: "overlay",
      zIndex: "9999",
      animation: "popIn 0.14s ease-out",
      "&[data-side=bottom]": {
        marginTop: "0.375rem",
      },
      "&[data-side=top]": {
        marginBottom: "0.375rem",
        animation: "fromBelow 0.14s ease-out",
      },
      "& [data-state='hidden']": {
        display: "none",
      },
    },
    viewport: {
      overflow: "auto",
      // The edge with more options behind it fades out, so a long list reads as scrollable; a list
      // that fits has no active scroll timeline and no fade.
      "@supports (animation-timeline: scroll())": {
        maskImage:
          "linear-gradient(to bottom, transparent 0, #000 var(--aitho-fade-top), #000 calc(100% - var(--aitho-fade-bottom)), transparent 100%)",
        animationName: "scrollEdgeFade",
        animationTimingFunction: "linear",
        animationFillMode: "both",
        animationDuration: "auto",
        animationTimeline: "scroll(self)",
      },
    },

    item: {
      position: "relative",
      padding: "0 0.625rem",
      // Transparent 1px edges + padding-box background: adjacent filled rows (hover next to
      // selected) get a 2px gap without changing the row height Select.tsx relies on.
      borderBlock: "1px solid transparent",
      backgroundClip: "padding-box",
      // Matches the per-option height Select.tsx uses to compute optionsShows.
      height: "2.188rem",
      cursor: "pointer",
      outline: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "0.5rem",
      width: "100%",
      borderRadius: "radius-sm",
      userSelect: "none",
      transition: "background-color 0.15s ease, color 0.15s ease",
      "& .select-item-content": {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "0.5rem",
        height: "100%",
        minWidth: 0,
        // Fills the row, so an indicator pushed with margin-left: auto lands on the right edge.
        flex: 1,
      },

      _highlighted: {
        backgroundColor: "color-primary-soft",
      },

      "&[data-state='checked']": {
        fontWeight: "semibold",
      },
      // Draw our check only when the item doesn't render its own indicator (forks like Crew's do).
      "&[data-state='checked']:not(:has(.select-item-indicator))": {
        _after: CHECK_MARK,
      },

      "&[data-disabled]": {
        cursor: "not-allowed",
        opacity: "0.5",
        color: "text-secondary",
      },
    },

    icon: {
      display: "inline-flex",
      flexShrink: 0,
      color: "text-secondary",
      transition: "transform 0.2s ease",
      "[data-state=open] > &": {
        transform: "rotate(180deg)",
      },
      // No stroke: icon sets like react-icons ship an invisible full-size bounding path that a
      // stroke would draw as a box around the chevron.
      "& svg": {
        width: "100%",
        height: "100%",
      },
    },
  },

  variants: {
    borderColor: {
      base: {
        trigger: {
          borderColor: "border-color",
          "&:hover:not(:disabled, :focus-visible, [data-state=open])": {
            borderColor: FIELD_HOVER_BORDER,
          },
          [OPEN]: { borderColor: "color-primary" },
        },
        content: { borderColor: "border-color" },
      },
      primary: {
        trigger: { borderColor: "color-primary" },
        content: { borderColor: "color-primary" },
      },
      error: {
        trigger: {
          borderColor: "color-error",
          [OPEN]: { boxShadow: "focus-ring-error" },
        },
        content: { borderColor: "border-color" },
      },
    },
    size: {
      xs: {
        trigger: {
          height: "1.875rem",
          fontSize: "0.8125rem",
          padding: "0 0.5rem 0 0.625rem",
          minWidth: "min(7.5rem, 100%)",
          width: "7.5rem",
        },
        icon: {
          height: "0.875rem",
          width: "0.875rem",
        },
        content: {
          fontSize: "0.8125rem",
        },
      },
      sm: {
        trigger: {
          height: "2rem",
          fontSize: "0.8125rem",
          minWidth: "min(12.5rem, 100%)",
        },
        icon: {
          height: "0.875rem",
          width: "0.875rem",
        },
        content: {
          fontSize: "0.8125rem",
        },
      },
      md: {
        trigger: {
          height: "2.375rem",
          fontSize: "0.875rem",
          minWidth: "min(15.625rem, 100%)",
        },
        icon: {
          height: "1rem",
          width: "1rem",
        },
        content: {
          fontSize: "0.875rem",
        },
      },
      lg: {
        trigger: {
          minHeight: "3.125rem",
          fontSize: "1.125rem",
          padding: "0 0.875rem 0 1rem",
          minWidth: "min(18.75rem, 100%)",
        },
        icon: {
          height: "1.25rem",
          width: "1.25rem",
        },
        value: {
          fontSize: "1.125rem",
        },
      },
      xl: {
        trigger: {
          minHeight: "3.75rem",
          fontSize: "1.25rem",
          padding: "0 1rem 0 1.125rem",
          minWidth: "min(21.875rem, 100%)",
        },
        icon: {
          height: "1.5rem",
          width: "1.5rem",
        },
        value: {
          fontSize: "1.25rem",
        },
      },
    },
    variant: {
      primary: {
        trigger: {
          backgroundColor: "background-primary",
          borderWidth: "1px",
          borderStyle: "solid",
          "&[data-disabled]": {
            cursor: "not-allowed",
            backgroundColor: "background-secondary",
            opacity: "0.55",
          },
        },

        content: {
          backgroundColor: "background-secondary",
        },
      },
    },
  },
  defaultVariants: {
    size: "md",
    variant: "primary",
    borderColor: "base",
  },
});
