import { defineSlotRecipe } from "@pandacss/dev";

export const stepperRecipe = defineSlotRecipe({
  className: "stepper",
  slots: ["root", "step", "separator", "content", "indicator"],
  base: {
    root: {
      display: "flex",
      width: "full",
      gap: "4",
    },
    step: {
      display: "flex",
      alignItems: "center",
      gap: "2",
      flex: "1",
      _focusVisible: {
        outlineWidth: "2px",
        outlineStyle: "solid",
        outlineColor: "color-primary",
        outlineOffset: "2px",
        borderRadius: "radius",
      },
    },
    separator: {
      flex: "1",
      transition: "colors",
    },
    content: {
      fontSize: "sm",
      fontWeight: "medium",
      transition: "colors",
    },
    indicator: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "8",
      height: "8",
      borderRadius: "full",
      borderWidth: "2px",
      transition: "all",
      flexShrink: "0",
    },
  },
  variants: {
    orientation: {
      horizontal: {
        root: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
        step: {
          flexDirection: "column",
          alignItems: "center",
        },
        separator: {
          width: "full",
          height: "1px",
          minWidth: "1.25rem",
        },
        content: {
          textAlign: "center",
        },
      },
      vertical: {
        root: {
          flexDirection: "column",
          alignItems: "stretch",
        },
        step: {
          flexDirection: "row",
        },
        separator: {
          width: "1px",
          height: "full",
          marginLeft: "4",
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
          bg: "color-primary",
          color: "text-on-primary",
        },
        content: {
          color: "color-primary",
        },
        separator: {
          bg: "border-color",
        },
      },
      complete: {
        indicator: {
          borderColor: "color-success",
          bg: "color-success",
          color: "text-on-primary",
        },
        content: {
          color: "color-success",
        },
        separator: {
          bg: "color-success",
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
