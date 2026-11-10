import { defineSlotRecipe } from "@pandacss/dev";

// The thumb sits 3px from every edge; the track radius is half its height.
const size = (width: number, height: number) => {
  const thumb = height - 6;
  return {
    root: {
      width: `${width}px`,
      height: `${height}px`,
      borderRadius: `${height / 2}px`,
    },
    thumb: {
      width: `${thumb}px`,
      height: `${thumb}px`,
      transform: "translateX(3px)",
      _checked: { transform: `translateX(${width - thumb - 3}px)` },
    },
  };
};

export const toggleSwitchRecipe = defineSlotRecipe({
  className: "toggleSwitch",
  slots: ["root", "thumb"],
  base: {
    root: {
      flexShrink: "0",
      position: "relative",
      WebkitTapHighlightColor: "rgba(0, 0, 0, 0)",
      transition: "background-color 0.2s ease, box-shadow 0.15s ease",
      cursor: "pointer",
      userSelect: "none",
      overflow: "hidden",
      backgroundColor: "background-tertiary",
      _checked: { backgroundColor: "color-primary" },
      _disabled: {
        cursor: "not-allowed",
        opacity: "0.45",
      },
      _focusVisible: {
        outline: "none",
        boxShadow: "focus-ring",
      },
    },
    thumb: {
      display: "block",
      backgroundColor: "white",
      borderRadius: "50%",
      boxShadow: "0 1px 3px rgb(0 0 0 / 0.3)",
      transition: "transform 0.2s cubic-bezier(0.3, 1.3, 0.6, 1)",
      willChange: "transform",
    },
  },
  variants: {
    size: {
      sm: size(32, 18),
      md: size(40, 22),
      lg: size(48, 26),
    },
  },
  defaultVariants: {
    size: "md",
  },
} as const);
