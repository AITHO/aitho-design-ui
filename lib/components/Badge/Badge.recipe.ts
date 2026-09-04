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
      error: {
        badge: {
          color: "white",
          bg: "color-error",
        },
      },
      info: {
        badge: {
          color: "white",
          bg: "color-info",
        },
      },
      success: {
        badge: {
          color: "white",
          bg: "color-success",
        },
      },
      warning: {
        badge: {
          color: "text-primary",
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
