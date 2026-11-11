// Toast.recipe.ts
import { defineSlotRecipe } from "@pandacss/dev";

const SIZES = ["sm", "md", "lg"] as const;
const VARIANTS = ["base", "primary", "secondary", "warning", "alert"] as const;
const BORDERS = ["flat", "rounded", "pills"] as const;

const SIZE_MAPS = {
  sm: { padding: "8px 8px 8px 10px", gap: "8px", fontSize: "0.8125rem" },
  md: { padding: "12px 12px 12px 14px", gap: "10px", fontSize: "sm" },
  lg: { padding: "16px 16px 16px 18px", gap: "12px", fontSize: "md" },
} as const;

// Left border tone. Only warning and alert carry meaning; the others stay neutral, because apps
// usually put their own status icon in the title (a blue edge on a success toast reads wrong).
const VARIANT_TONES = {
  base: "border-color",
  primary: "border-color",
  secondary: "border-color",
  warning: "color-warning",
  alert: "color-error",
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

// Restyles the Button inside. Kept in a variant, not in base: base styles sit in
// a lower cascade layer than Button's own variant styles and would lose.
const CLOSE_AREA = {
  "& button": {
    width: "24px",
    height: "24px",
    minWidth: "24px",
    minHeight: "24px",
    padding: 0,
    borderRadius: "radius-sm",
    color: "text-secondary",
    transition: "background-color 0.15s ease, color 0.15s ease",
    _hover: {
      backgroundColor: "color-primary-soft",
      color: "text-primary",
    },
    "& svg": {
      color: "inherit",
    },
  },
};

// Enter from the edge the toast stacks against, leave towards its side.
const POSITION_ANIMATIONS = {
  "top-left": ["Top", "Left"],
  left: ["Left", "Left"],
  "bottom-left": ["Bottom", "Left"],
  "top-right": ["Top", "Right"],
  right: ["Right", "Right"],
  "bottom-right": ["Bottom", "Right"],
  top: ["Top", "Top"],
  bottom: ["Bottom", "Bottom"],
} as const;

export const toastRecipe = defineSlotRecipe({
  className: "toast",
  slots: ["root", "content", "viewport", "closeArea", "clickable"],
  base: {
    root: {
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      // Room for a sentence-long message without wrapping every few words.
      maxWidth: "24rem",
      backgroundColor: "background-secondary",
      color: "text-primary",
      borderWidth: "1px 1px 1px 3px",
      borderStyle: "solid",
      borderColor: "border-color",
      boxShadow: "overlay",
    },
    content: {
      display: "flex",
      flexDirection: "column",
      // At least as tall as the close button and centred: a one-line toast reads balanced.
      justifyContent: "center",
      minHeight: "24px",
      gap: "2px",
      flex: 1,
      minWidth: 0,
      lineHeight: "1.45",
      // Description under a title.
      "& > * + *": {
        color: "text-secondary",
        fontSize: "0.93em",
      },
    },
    closeArea: {
      flexShrink: 0,
      marginLeft: "auto",
    },
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
            borderLeftColor: VARIANT_TONES[variant],
          },
          closeArea: CLOSE_AREA,
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
    position: Object.fromEntries(
      Object.entries(POSITION_ANIMATIONS).map(([position, [enter, exit]]) => [
        position,
        {
          root: {
            "&[data-state='open']": {
              animation: `toastSwipeIn${enter} 0.2s ease-out`,
            },
            "&[data-state='closed']": {
              animation: `toastSwipeOut${exit} 0.2s ease-in forwards`,
            },
          },
        },
      ]),
    ),
  },
  defaultVariants: {
    size: "md",
    variant: "base",
    position: "bottom-right",
    borders: "rounded",
  },
});
