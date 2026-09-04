import { defineSlotRecipe } from "@pandacss/dev";

export const buttonRecipe = defineSlotRecipe({
  className: "button",
  slots: ["root", "icon", "content"],
  base: {
    root: {
      padding: "0.5rem 1rem",
      fontSize: "1rem",
      fontWeight: "700",
      cursor: "pointer",
      transition: "background-color 300ms",
      alignItems: "center",
      _focusVisible: {
        outlineWidth: "2px",
        outlineStyle: "solid",
        outlineColor: "color-primary",
        outlineOffset: "2px",
        borderRadius: "radius-sm",
      },
      "&[data-full-start='true']": {
        display: "grid",
        gridTemplateColumns: "0.2fr 1fr",
      },
      "&[data-full-end='true']": {
        display: "grid",
        gridTemplateColumns: "1fr 0.2fr",
      },
    },
    icon: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "end",
      padding: "0 0.5rem 0 0.5rem",
    },
    content: {
      whiteSpace: "nowrap",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  },
  variants: {
    size: {
      xxs: {
        root: {
          fontSize: "2xs",
          padding: "0",
        },
        icon: {
          width: "1.5rem",
          height: "1.5rem",
        },
      },
      xs: {
        root: {
          fontSize: "sm",
          padding: "0",
        },
        icon: {
          width: "1.75rem",
          height: "1.75rem",
        },
      },
      sm: {
        root: {
          fontSize: "sm",
          padding: "0.25rem 0.5rem",
        },
        icon: {
          width: "2rem",
          height: "2rem",
        },
      },
      md: {
        root: {
          fontSize: "base",
          padding: "0.5rem 1rem",
        },
        icon: {
          width: "2.25rem",
          height: "2.25rem",
        },
      },
      lg: {
        root: {
          fontSize: "lg",
          padding: "0.75rem 1.5rem",
        },
        icon: {
          width: "2.625rem",
          height: "2.625rem",
        },
      },
      xl: {
        root: {
          fontSize: "xl",
          padding: "1rem 2rem",
        },
        icon: {
          width: "3rem",
          height: "3rem",
        },
      },
    },
    borderRadius: {
      flat: {
        root: { borderRadius: "0" },
      },
      rounded: {
        root: { borderRadius: "radius" },
      },
      pills: {
        root: { borderRadius: "full" },
      },
    },
    variant: {
      primary: {
        root: {
          backgroundColor: "color-primary",
          color: "text-on-primary",
          borderColor: "border-color",
          _hover: {
            backgroundColor: "color-primary-hover",
          },
          _active: {
            backgroundColor: "color-primary-opacity-50",
          },
        },
        icon: {
          color: "text-on-primary",
        },
      },
      transparent: {
        root: {
          backgroundColor: "transparent",
          color: "text-primary",
          _hover: {
            backgroundColor: "rgba(0, 0, 0, 0.05)",
          },
          _active: {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          },
        },
        icon: {
          color: "text-primary",
        },
      },
      outline: {
        root: {
          backgroundColor: "transparent",
          color: "text-primary",
          borderColor: "color-primary",
          borderWidth: "1px",
          _hover: {
            backgroundColor: "rgba(0, 0, 0, 0.1)",
          },
          _active: {
            backgroundColor: "color-primary-opacity-20",
          },
        },
        icon: {
          color: "color-primary",
        },
      },
      neutral: {
        root: {
          backgroundColor: "background-tertiary",
          color: "text-primary",
          _hover: {
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          },
          _active: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        },
        icon: {
          color: "text-primary",
        },
      },
      outlineError: {
        root: {
          backgroundColor: "transparent",
          color: "color-error",
          borderColor: "color-error",
          borderWidth: "1px",
          _hover: {
            backgroundColor: "rgba(255, 0, 0, 0.05)",
          },
          _active: {
            backgroundColor: "rgba(255, 0, 0, 0.2)",
          },
        },
        icon: {
          color: "color-error",
        },
      },
      error: {
        root: {
          backgroundColor: "color-error",
          color: "text-on-primary",
          borderColor: "color-error",
          borderWidth: "1px",
          _hover: {
            backgroundColor: "color-error-hover",
          },
          _active: {
            backgroundColor: "color-error-opacity-80",
          },
        },
        icon: {
          color: "text-on-primary",
        },
      },
    },
    layout: {
      horizontal: {
        root: { flexDirection: "row", padding: "0.5rem 1rem" },
        content: { padding: "0.25rem 1rem" },
      },
      vertical: {
        root: { flexDirection: "column", padding: "0.75rem 0.75rem" },
        content: { padding: "0.25rem 0.25rem" },
      },
    },
    disabled: {
      true: {
        root: {
          backgroundColor: "color-primary-disabled",
          cursor: "not-allowed",
          opacity: "0.5",
        },
      },
      false: {},
    },
    compact: {
      true: {
        root: {
          width: "auto",
          height: "auto",
          padding: "0",
        },
      },
      false: {},
    },
  },
  compoundVariants: [
    {
      variant: "primary",
      disabled: true,
      css: {
        root: {
          backgroundColor: "color-primary-disabled",
        },
      },
    },
    {
      variant: "transparent",
      disabled: true,
      css: {
        root: {
          backgroundColor: "transparent",
          borderColor: "transparent",
        },
      },
    },
    {
      variant: "outline",
      disabled: true,
      css: {
        icon: {
          color: "text-primary",
        },
      },
    },
  ],
  defaultVariants: {
    size: "md",
    borderRadius: "rounded",
    variant: "primary",
    layout: "horizontal",
    disabled: false,
  },
});
