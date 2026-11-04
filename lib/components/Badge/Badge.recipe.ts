import { defineSlotRecipe } from "@pandacss/dev";

export const badgeRecipe = defineSlotRecipe({
  className: "badge",
  slots: ["root", "badge"],
  base: {
    root: {
      position: "relative",
      display: "inline-flex",
    },
    badge: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      borderRadius: "full",
      fontSize: "xs",
      padding: "1",
      zIndex: "1",
    },
  },
  variants: {
    placement: {
      "top-right": {
        badge: {
          top: "0",
          right: "0",
          transform: "scale(1) translate(50%, -50%)",
          transformOrigin: "100% 0%",
        },
      },
      "top-left": {
        badge: {
          top: "0",
          left: "0",
          transform: "scale(1) translate(-50%, -50%)",
          transformOrigin: "0% 0%",
        },
      },
      "bottom-right": {
        badge: {
          bottom: "0",
          right: "0",
          transform: "scale(1) translate(50%, 50%)",
          transformOrigin: "100% 100%",
        },
      },
      "bottom-left": {
        badge: {
          bottom: "0",
          left: "0",
          transform: "scale(1) translate(-50%, 50%)",
          transformOrigin: "0% 100%",
        },
      },
    },
    variant: {
      primary: {
        badge: {
          color: "text-primary",
          bg: "color-attention",
        },
      },
      // Status colors are dark in the light theme and bright in the dark one:
      // text-on-primary flips with them (white / near-black) to keep 4.5:1.
      error: {
        badge: {
          color: "text-on-primary",
          bg: "color-error",
        },
      },
      info: {
        badge: {
          color: "text-on-primary",
          bg: "color-info",
        },
      },
      success: {
        badge: {
          color: "text-on-primary",
          bg: "color-success",
        },
      },
      // Warning is a bright yellow in both themes, so its text stays dark.
      warning: {
        badge: {
          color: "dark",
          bg: "color-warning",
        },
      },
    },
    type: {
      standard: {
        badge: {
          minWidth: "5",
          height: "5",
        },
      },
      dot: {
        badge: {
          width: "2",
          height: "2",
          padding: "0",
        },
      },
    },
    overlap: {
      rectangular: {
        badge: {
          transform: "scale(1) translate(50%, -50%)",
        },
      },
      circular: {
        badge: {
          transform: "scale(1) translate(50%, -50%)",
        },
      },
    },
  },
  defaultVariants: {
    variant: "primary",
    type: "standard",
    overlap: "rectangular",
    placement: "top-right",
  },
});
