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

const TYPE_MAPS = {
  spinningSlashes: {
    transform: "rotateZ(45deg)",
    perspective: "62.5rem",
    borderRadius: "50%",
    width: "100%",
    height: "100%",
    color: "color-primary",
    "&:before, &:after": {
      content: "''",
      display: "block",
      position: "absolute",
      top: "0",
      left: "0",
      width: "inherit",
      height: "inherit",
      borderRadius: "50%",
      animation: "spinnerSpinningSlashes 1s linear infinite",
    },
    "&:before": {
      transform: "rotateX(70deg)",
    },
    "&:after": {
      color: "accent",
      transform: "rotateY(70deg)",
      animationDelay: ".4s",
    },
  },
  circularFlashingDots: {
    color: "color-primary",
    width: "1rem",
    height: "1rem",
    borderRadius: "50%",
    position: "relative",
    animation: "spinnerCircularFlashingDots 1.3s infinite linear",
    transform: "translateZ(0)",
  },
  linearFlashingDots: {
    width: "1rem",
    height: "1rem",
    borderRadius: "50%",
    backgroundColor: "background-primary",
    position: "relative",
    animation: "spinnerLinearFlashingDots 1s ease-out infinite alternate",
  },
  rotatingSquares: {
    position: "relative",
    backgroundImage:
      "linear-gradient(var(--accent) 1rem, transparent 0), linear-gradient(var(--color-primary) 1rem, transparent 0), linear-gradient(var(--color-primary) 1rem, transparent 0), linear-gradient(var(--accent) 1rem, transparent 0)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "1rem 1rem",
    backgroundPosition: "left top , left bottom , right top , right bottom",
    animation: "spinnerRotatingSquares 1s linear infinite",
  },
  rotatingDots: {
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
      backgroundColor: "accent",
      boxShadow: "30px 0 0 var(--accent)",
      marginBottom: "0.625rem",
    },
    "&:after": {
      animation: "spinnerRotatingDots2 1.3s infinite",
      backgroundColor: "color-primary",
      boxShadow: "30px 0 0 var(--color-primary)",
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
    type: Object.fromEntries(
      TYPES.map((type) => [
        type,
        {
          element: TYPE_MAPS[type],
        },
      ]),
    ),
  },
  defaultVariants: {
    size: "md",
    type: "linearFlashingDots",
  },
});
