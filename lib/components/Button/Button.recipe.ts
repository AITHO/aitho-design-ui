import { defineSlotRecipe } from "@pandacss/dev";

// Sizes only set these custom properties; the base consumes them, so the
// pill radius and the icon-only square follow the height without compound variants.
const size = (
  height: number,
  paddingX: number,
  gap: number,
  fontSize: string,
  iconSize: number,
) => ({
  root: {
    "--button-height": `${height}px`,
    "--button-px": `${paddingX}px`,
    "--button-gap": `${gap}px`,
    fontSize,
  },
  icon: { width: `${iconSize}px`, height: `${iconSize}px` },
});

export const buttonRecipe = defineSlotRecipe({
  className: "button",
  slots: ["root", "icon", "content"],
  base: {
    root: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "var(--button-gap)",
      minHeight: "var(--button-height)",
      paddingBlock: "0",
      paddingInline: "var(--button-px)",
      borderWidth: "1px",
      borderStyle: "solid",
      borderColor: "transparent",
      fontWeight: "600",
      lineHeight: "1.2",
      whiteSpace: "nowrap",
      userSelect: "none",
      cursor: "pointer",
      transition:
        "background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease, transform 0.05s ease",
      _focusVisible: {
        outline: "none",
        boxShadow: "focus-ring",
      },
      "&:active:not(:disabled)": {
        transform: "translateY(1px)",
      },
      "&:has(> svg:only-child)": {
        width: "var(--button-height)",
        paddingInline: "0",
      },
    },
    icon: {
      display: "inline-flex",
      flexShrink: "0",
    },
    content: {
      whiteSpace: "nowrap",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      // Icons passed as children get the same spacing as the icon prop.
      gap: "var(--button-gap)",
    },
  },
  variants: {
    size: {
      xxs: size(22, 6, 4, "0.6875rem", 12),
      xs: size(26, 8, 6, "0.75rem", 14),
      sm: size(30, 10, 6, "0.8125rem", 14),
      md: size(36, 14, 8, "0.875rem", 16),
      lg: size(44, 20, 8, "0.9375rem", 18),
      xl: size(52, 24, 10, "1.0625rem", 20),
    },
    borderRadius: {
      flat: {
        root: { borderRadius: "0" },
      },
      rounded: {
        root: { borderRadius: "radius" },
      },
      pills: {
        root: { borderRadius: "calc(var(--button-height) / 2)" },
      },
    },
    variant: {
      primary: {
        root: {
          backgroundColor: "color-primary",
          color: "text-on-primary",
          boxShadow: "raised",
          "&:hover:not(:disabled)": {
            backgroundColor: "color-primary-hover",
          },
          _focusVisible: {
            boxShadow: "focus-ring",
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
          "&:hover:not(:disabled)": {
            backgroundColor: "color-primary-soft",
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
          // Stronger than the plain border colour, so it still reads on striped or tinted rows.
          borderColor:
            "color-mix(in srgb, var(--border-color) 45%, var(--text-secondary))",
          "&:hover:not(:disabled)": {
            borderColor: "color-primary",
            backgroundColor: "color-primary-softer",
          },
        },
        icon: {
          color: "text-primary",
        },
      },
      neutral: {
        root: {
          backgroundColor: "background-tertiary",
          color: "text-primary",
          "&:hover:not(:disabled)": {
            backgroundColor:
              "color-mix(in srgb, {colors.background-tertiary} 80%, {colors.text-primary})",
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
          borderColor: "color-error/55",
          "&:hover:not(:disabled)": {
            backgroundColor: "color-error-soft",
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
          "&:hover:not(:disabled)": {
            backgroundColor: "color-error-hover",
          },
        },
        icon: {
          color: "text-on-primary",
        },
      },
    },
    layout: {
      horizontal: {
        root: { flexDirection: "row" },
      },
      vertical: {
        root: {
          flexDirection: "column",
          paddingBlock: "0.5rem",
          gap: "0.25rem",
        },
      },
    },
    disabled: {
      true: {
        root: {
          cursor: "not-allowed",
          opacity: "0.45",
        },
      },
      false: {},
    },
    compact: {
      true: {
        root: {
          width: "auto",
          height: "auto",
          minHeight: "0",
          padding: "0",
          // icon-only stays a square, so it keeps a usable hit area
          "&:has(> svg:only-child)": {
            width: "var(--button-height)",
            height: "var(--button-height)",
          },
        },
        content: { padding: "0.25rem 0.5rem" },
      },
      false: {},
    },
  },
  compoundVariants: [
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
