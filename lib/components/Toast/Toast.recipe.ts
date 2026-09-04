// Toast.recipe.ts
import { defineSlotRecipe } from "@pandacss/dev";

const SIZES = ["sm", "md", "lg"] as const;
const VARIANTS = ["base", "primary", "secondary", "warning", "alert"] as const;
const BORDERS = ["flat", "rounded", "pills"] as const;

const SIZE_MAPS = {
  sm: { padding: "2", fontSize: "sm" },
  md: { padding: "3", fontSize: "base" },
  lg: { padding: "4", fontSize: "lg" },
} as const;

const VARIANT_MAPS = {
  base: {
    bg: "white",
    color: "dark",
    closeAreaColor: "dark",
  },
  primary: {
    bg: "color-primary",
    color: "text-on-primary",
    closeAreaColor: "text-on-primary",
  },
  secondary: {
    bg: "color-attention",
    color: "text-primary",
    closeAreaColor: "text-primary",
  },
  warning: {
    bg: "color-warning",
    color: "dark",
    closeAreaColor: "dark",
  },
  alert: {
    bg: "color-error",
    color: "text-on-primary",
    closeAreaColor: "text-on-primary",
  },
} as const;

const BORDERS_MAPS = {
  flat: {
    borderRadius: "0",
  },
  rounded: {
    borderRadius: "radius",
  },
  pills: {
    borderRadius: "radius-lg",
  },
};

export const toastRecipe = defineSlotRecipe({
  className: "toast",
  slots: ["root", "content", "viewport", "closeArea", "clickable"],
  base: {
    root: {
      display: "flex",
      flexDirection: "row",
      maxWidth: "18.75rem",
      boxShadow: "0 1px 10px 0 rgba(0,0,0,.1),0 2px 15px 0 rgba(0,0,0,.05)",
      "&[data-state='open']": {
        animation: "toastSwipeIn 0.15s",
      },
      "&[data-state='closed']": {
        animation: "toastSwipeOutRight 0.3s",
      },
    },
    content: {
      display: "flex",
      flexDirection: "column",
    },
    closeArea: {},
    clickable: {
      cursor: "pointer",
    },
  },
  variants: {
    size: Object.fromEntries(
      SIZES.map((size) => [
        size,
        {
          root: SIZE_MAPS[size],
        },
      ]),
    ),
    variant: Object.fromEntries(
      VARIANTS.map((variant) => [
        variant,
        {
          root: {
            bg: VARIANT_MAPS[variant].bg,
            color: VARIANT_MAPS[variant].color,
          },
          closeArea: {
            color: VARIANT_MAPS[variant].closeAreaColor,
            "& button": {
              color: "inherit",
              "& svg": {
                color: "inherit",
              },
            },
          },
        },
      ]),
    ),
    borders: Object.fromEntries(
      BORDERS.map((border) => [
        border,
        {
          root: BORDERS_MAPS[border],
        },
      ]),
    ),
    position: {
      "top-left": {
        root: {
          "&[data-state='open']": {
            animation: "toastSwipeInLeft 0.15s",
          },
          "&[data-state='closed']": {
            animation: "toastSwipeOutLeft 0.3s",
          },
        },
      },
      left: {
        root: {
          "&[data-state='open']": {
            animation: "toastSwipeInLeft 0.15s",
          },
          "&[data-state='closed']": {
            animation: "toastSwipeOutLeft 0.3s",
          },
        },
      },
      "bottom-left": {
        root: {
          "&[data-state='open']": {
            animation: "toastSwipeInLeft 0.15s",
          },
          "&[data-state='closed']": {
            animation: "toastSwipeOutLeft 0.3s",
          },
        },
      },
      "top-right": {
        root: {
          "&[data-state='open']": {
            animation: "toastSwipeInRight 0.15s",
          },
          "&[data-state='closed']": {
            animation: "toastSwipeOutRight 0.3s",
          },
        },
      },
      right: {
        root: {
          "&[data-state='open']": {
            animation: "toastSwipeInRight 0.15s",
          },
          "&[data-state='closed']": {
            animation: "toastSwipeOutRight 0.3s",
          },
        },
      },
      "bottom-right": {
        root: {
          "&[data-state='open']": {
            animation: "toastSwipeInRight 0.15s",
          },
          "&[data-state='closed']": {
            animation: "toastSwipeOutRight 0.3s",
          },
        },
      },
      top: {
        root: {
          "&[data-state='open']": {
            animation: "toastSwipeInTop 0.15s",
          },
          "&[data-state='closed']": {
            animation: "toastSwipeOutTop 0.3s",
          },
        },
      },
      bottom: {
        root: {
          "&[data-state='open']": {
            animation: "toastSwipeInBottom 0.15s",
          },
          "&[data-state='closed']": {
            animation: "toastSwipeOutBottom 0.3s",
          },
        },
      },
    },
  },
  defaultVariants: {
    size: "md",
    variant: "base",
    position: "bottom-right",
    borders: "rounded",
  },
});
