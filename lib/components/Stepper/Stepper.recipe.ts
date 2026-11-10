import { defineSlotRecipe } from "@pandacss/dev";

export const stepperRecipe = defineSlotRecipe({
  className: "stepper",
  slots: ["root", "step", "separator", "content", "indicator"],
  base: {
    root: {
      display: "flex",
      width: "full",
      userSelect: "none",
    },
    step: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      _focusVisible: {
        outline: "none",
        boxShadow: "focus-ring",
        borderRadius: "radius",
      },
    },
    separator: {
      border: "none",
      borderRadius: "1px",
      transition: "background-color 0.2s ease",
    },
    content: {
      fontSize: "0.8125rem",
      fontWeight: "600",
      transition: "color 0.2s ease",
    },
    indicator: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "32px",
      height: "32px",
      borderRadius: "50%",
      borderWidth: "2px",
      fontSize: "0.8125rem",
      fontWeight: "700",
      transition:
        "background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease",
      flexShrink: "0",
    },
  },
  variants: {
    orientation: {
      // Steps share the width and each one draws the line to the next indicator
      // (::after, 6px from both circles), as the separators can't know the step widths.
      horizontal: {
        root: {
          flexDirection: "row",
          alignItems: "flex-start",
        },
        step: {
          flex: "1",
          position: "relative",
          flexDirection: "column",
          alignItems: "center",
          "&:not(:last-child)::after": {
            content: '""',
            position: "absolute",
            top: "15px",
            left: "calc(50% + 22px)",
            right: "calc(-50% + 22px)",
            height: "2px",
            borderRadius: "1px",
            transition: "background-color 0.2s ease",
          },
        },
        separator: {
          display: "none",
        },
        content: {
          textAlign: "center",
          whiteSpace: "nowrap",
        },
      },
      vertical: {
        root: {
          flexDirection: "column",
          alignItems: "stretch",
          gap: "0.375rem",
        },
        step: {
          flexDirection: "row",
          gap: "0.75rem",
        },
        separator: {
          width: "2px",
          marginLeft: "15px",
          minHeight: "1.25rem",
        },
        content: {
          textAlign: "left",
        },
      },
    },
    status: {
      active: {
        indicator: {
          borderColor: "color-primary",
          bg: "background-primary",
          color: "color-primary",
          boxShadow: "focus-ring",
        },
        content: {
          color: "text-primary",
        },
        step: {
          _after: { bg: "border-color" },
        },
        separator: {
          bg: "border-color",
        },
      },
      complete: {
        indicator: {
          borderColor: "color-primary",
          bg: "color-primary",
          color: "text-on-primary",
        },
        content: {
          color: "text-primary",
        },
        step: {
          _after: { bg: "color-primary" },
        },
        separator: {
          bg: "color-primary",
        },
      },
      incomplete: {
        indicator: {
          borderColor: "border-color",
          bg: "background-primary",
          color: "text-secondary",
        },
        content: {
          color: "text-secondary",
        },
        step: {
          _after: { bg: "border-color" },
        },
        separator: {
          bg: "border-color",
        },
      },
    },
  },
  defaultVariants: {
    status: "incomplete",
    orientation: "horizontal",
  },
});
