import { defineSlotRecipe } from "@pandacss/dev";

export const selectRecipe = defineSlotRecipe({
  className: "select",
  slots: ["value", "trigger", "icon", "content", "viewport", "item", "input"],
  base: {
    input: {
      marginBottom: "0.5rem",
    },
    trigger: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: "radius",
      padding: "0 0.938rem 0 0.5rem",
      gap: "0.5rem",
      width: "100%",
      maxWidth: "100%",
      cursor: "pointer",
      overflow: "hidden",
      color: "text-primary",
      _focusVisible: {
        outlineWidth: "2px",
        outlineStyle: "solid",
        outlineColor: "color-primary",
        outlineOffset: "2px",
        borderRadius: "radius-sm",
      },
      "& .select-trigger-content": {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "0.5rem",
        flex: 1,
      },
      "& .select-trigger-icon": {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      },
      _placeholder: {
        color: "background-popup",
      },
    },

    content: {
      color: "text-primary",
      width: "var(--radix-select-trigger-width)",
      maxHeight: "var(--radix-select-content-available-height)",
      position: "relative",
      transform: "translateY(0)",
      overflowY: "auto",
      borderRadius: "radius",
      borderStyle: "solid",
      borderWidth: "1px",
      padding: "0.438rem",
      zIndex: "9999",
      "& [data-state='hidden']": {
        display: "none",
      },
    },
    viewport: {
      overflow: "auto",
    },

    item: {
      position: "relative",
      padding: "0 0.75rem",
      height: "2.188rem",
      cursor: "pointer",
      outline: "none",
      display: "flex",
      alignItems: "center",
      width: "100%",
      borderRadius: "radius",
      marginY: "0.125rem",
      _first: {
        marginTop: "0px",
      },
      _last: {
        marginBottom: "0px",
      },
      "& .select-item-content": {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "0.5rem",
        height: "100%",
      },

      "&[data-state='checked']": {
        backgroundColor: "color-primary-disabled",
        color: "text-on-primary",
        "&:hover": {
          backgroundColor: "color-primary-hover",
          color: "text-on-primary",
        },
      },

      "&[data-highlighted]:not([data-state='checked'])": {
        backgroundColor: "color-primary-disabled",
        color: "text-on-primary",
        "&:hover": {
          backgroundColor: "color-primary-hover",
          color: "text-on-primary",
        },
      },

      "&[data-disabled]": {
        cursor: "not-allowed",
        opacity: "0.5",
        color: "text-secondary",
      },
    },

    icon: {
      "& svg": {
        strokeWidth: "0.013rem",
        stroke: "currentColor",
        width: "100%",
        height: "100%",
      },
    },
  },

  variants: {
    borderColor: {
      base: {
        trigger: { borderColor: "border-color" },
        content: { borderColor: "background-contrast" },
      },
      primary: {
        trigger: { borderColor: "color-primary" },
        content: { borderColor: "color-primary" },
      },
      error: {
        trigger: { borderColor: "color-error" },
        content: { borderColor: "border-color" },
      },
    },
    size: {
      xs: {
        trigger: {
          height: "1.875rem",
          fontSize: "0.875rem",
          minWidth: "min(7.5rem, 100%)",
          width: "7.5rem",
        },
        icon: {
          height: "0.875rem",
          width: "0.875rem",
        },
        content: {
          fontSize: "0.875rem",
        },
      },
      sm: {
        trigger: {
          height: "1.875rem",
          fontSize: "0.875rem",
          minWidth: "min(12.5rem, 100%)",
        },
        icon: {
          height: "0.875rem",
          width: "0.875rem",
        },
        content: {
          fontSize: "0.875rem",
        },
      },
      md: {
        trigger: {
          height: "2.5rem",
          fontSize: "1rem",
          minWidth: "min(15.625rem, 100%)",
        },
        icon: {
          height: "1.125rem",
          width: "1.125rem",
        },
        content: {
          fontSize: "1rem",
        },
      },
      lg: {
        trigger: {
          minHeight: "3.125rem",
          fontSize: "1.125rem",
          minWidth: "min(18.75rem, 100%)",
        },
        icon: {
          height: "1.375rem",
          width: "1.375rem",
        },
        value: {
          fontSize: "1.125rem",
        },
      },
      xl: {
        trigger: {
          minHeight: "3.75rem",
          fontSize: "1.25rem",
          minWidth: "min(21.875rem, 100%)",
        },
        icon: {
          height: "1.625rem",
          width: "1.625rem",
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
          border: "1px solid",
          "&[data-disabled]": {
            cursor: "not-allowed",
            backgroundColor: "background-secondary",
            color: "text-secondary",
            opacity: "0.6",
          },
          _hover: {
            backgroundColor: "background-secondary",
            borderColor: "border-color",
          },
          _active: {
            backgroundColor: "background-tertiary",
          },
          _focus: {
            backgroundColor: "background-secondary",
            borderColor: "border-color",
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
