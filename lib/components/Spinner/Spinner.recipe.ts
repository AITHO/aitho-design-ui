import { defineSlotRecipe } from "@pandacss/dev";

export const SIZES = ["sm", "md", "lg", "xl"] as const;

export type SizeVariant = (typeof SIZES)[number];

const SIZE_MAPS = {
  sm: { fontSize: "sm", transform: "scale(0.5)" },
  md: { fontSize: "base", transform: "scale(1)" },
  lg: { fontSize: "lg", transform: "scale(1.5)" },
  xl: { fontSize: "xl", transform: "scale(2)" },
} as const;

export const TYPES = [
  "linearFlashingDots",
  "spinningSlashes",
  "circularFlashingDots",
  "rotatingSquares",
  "rotatingDots",
] as const;

export type TypeVariant = (typeof TYPES)[number];

const bouncingDot = (delay: string) => ({
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  backgroundColor: "color-primary",
  animation: `spinnerBounce 1s ${delay} infinite ease-in-out`,
});

const secondaryTone = "var(--color-primary-opacity-50)";

const TYPE_MAPS = {
  // Three bouncing dots: the root's ::before and ::after flank the element.
  linearFlashingDots: {
    root: {
      gap: "5px",
      "&::before": { content: "''", ...bouncingDot("0s") },
      "&::after": { content: "''", ...bouncingDot("0.3s") },
    },
    element: bouncingDot("0.15s"),
  },
  // Ring: soft track with a primary arc.
  spinningSlashes: {
    element: {
      width: "24px",
      height: "24px",
      borderRadius: "50%",
      borderWidth: "2.5px",
      borderStyle: "solid",
      borderColor:
        "{colors.color-primary} {colors.color-primary-soft} {colors.color-primary-soft} {colors.color-primary-soft}",
      animation: "spin 0.7s linear infinite",
    },
  },
  circularFlashingDots: {
    element: {
      color: "color-primary",
      // The keyframes draw the dots in em: this sets an 8px dot.
      fontSize: "8px",
      width: "1em",
      height: "1em",
      borderRadius: "50%",
      position: "relative",
      animation: "spinnerCircularFlashingDots 1.3s infinite linear",
      transform: "translateZ(0)",
    },
  },
  rotatingSquares: {
    element: {
      position: "relative",
      backgroundImage: `linear-gradient(${secondaryTone} 1rem, transparent 0), linear-gradient(var(--color-primary) 1rem, transparent 0), linear-gradient(var(--color-primary) 1rem, transparent 0), linear-gradient(${secondaryTone} 1rem, transparent 0)`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "1rem 1rem",
      backgroundPosition: "left top , left bottom , right top , right bottom",
      animation: "spinnerRotatingSquares 1s linear infinite",
    },
  },
  rotatingDots: {
    element: {
      animation: "spinnerRotatingDots 1.3s infinite",
      height: "50px",
      width: "50px",
      "&:before, &:after": {
        borderRadius: "50%",
        content: "''",
        display: "block",
        height: "1.25rem",
        width: "1.25rem",
      },
      "&:before": {
        animation: "spinnerRotatingDots1 1.3s infinite",
        backgroundColor: secondaryTone,
        boxShadow: `30px 0 0 ${secondaryTone}`,
        marginBottom: "0.625rem",
      },
      "&:after": {
        animation: "spinnerRotatingDots2 1.3s infinite",
        backgroundColor: "color-primary",
        boxShadow: "30px 0 0 var(--color-primary)",
      },
    },
  },
} as const;

export const spinnerRecipe = defineSlotRecipe({
  className: "spinner",
  slots: ["root", "element"],
  base: {
    root: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "3rem",
      height: "3rem",
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
    type: Object.fromEntries(TYPES.map((type) => [type, TYPE_MAPS[type]])),
  },
  defaultVariants: {
    size: "md",
    type: "linearFlashingDots",
  },
});
