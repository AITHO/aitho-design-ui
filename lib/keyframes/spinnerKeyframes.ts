import { CssKeyframes } from "@pandacss/dev";

const rotatingDotsColor1 = "var(--color-primary)";
const rotatingDotsColor2 = "var(--color-primary-opacity-50)";

export const spinnerKeyframes: CssKeyframes = {
  spinnerBounce: {
    "0%, 80%, 100%": { transform: "scale(0.6)", opacity: 0.5 },
    "40%": { transform: "scale(1)", opacity: 1 },
  },
  // Progress indicator grow-in: `scale` composes with its inline translateX.
  progressGrowX: {
    from: { scale: "0 1" },
    to: { scale: "1 1" },
  },
  spinnerCircularFlashingDots: {
    "0%": {
      boxShadow:
        "0 -1.5em 0 0.1em, 1em -1em 0 0em, 1.5em 0 0 -0.5em, 1em 1em 0 -0.5em, 0 1.5em 0 -0.5em, -1em 1em 0 -0.5em, -1.5em 0 0 -0.5em, -1em -1em 0 0",
    },
    "100%": {
      boxShadow:
        "0 -1.5em 0 0.1em, 1em -1em 0 0em, 1.5em 0 0 -0.5em, 1em 1em 0 -0.5em, 0 1.5em 0 -0.5em, -1em 1em 0 -0.5em, -1.5em 0 0 -0.5em, -1em -1em 0 0",
    },
    "12.5%": {
      boxShadow:
        "0 -1.5em 0 0, 1em -1em 0 0.1em, 1.5em 0 0 0, 1em 1em 0 -0.5em, 0 1.5em 0 -0.5em, -1em 1em 0 -0.5em, -1.5em 0 0 -0.5em, -1em -1em 0 -0.5em",
    },
    "25%": {
      boxShadow:
        "0 -1.5em 0 -0.5em, 1em -1em 0 0, 1.5em 0 0 0.1em, 1em 1em 0 0, 0 1.5em 0 -0.5em, -1em 1em 0 -0.5em, -1.5em 0 0 -0.5em, -1em -1em 0 -0.5em",
    },
    "37.5%": {
      boxShadow:
        "0 -1.5em 0 -0.5em, 1em -1em 0 -0.5em, 1.5em 0em 0 0, 1em 1em 0 0.1em, 0 1.5em 0 0em, -1em 1em 0 -0.5em, -1.5em 0em 0 -0.5em, -1em -1em 0 -0.5em",
    },
    "50%": {
      boxShadow:
        "0 -1.5em 0 -0.5em, 1em -1em 0 -0.5em, 1.5em 0 0 -0.5em, 1em 1em 0 0em, 0 1.5em 0 0.1em, -1em 1em 0 0, -1.5em 0em 0 -0.5em, -1em -1em 0 -0.5em",
    },
    "62.5%": {
      boxShadow:
        "0 -1.5em 0 -0.5em, 1em -1em 0 -0.5em, 1.5em 0 0 -0.5em, 1em 1em 0 -0.5em, 0 1.5em 0 0, -1em 1em 0 0.1em, -1.5em 0 0 0, -1em -1em 0 -0.5em",
    },
    "75%": {
      boxShadow:
        "0em -1.5em 0 -0.5em, 1em -1em 0 -0.5em, 1.5em 0em 0 -0.5em, 1em 1em 0 -0.5em, 0 1.5em 0 -0.5em, -1em 1em 0 0, -1.5em 0em 0 0.1em, -1em -1em 0 0",
    },
    "87.5%": {
      boxShadow:
        "0em -1.5em 0 0, 1em -1em 0 -0.5em, 1.5em 0em 0 -0.5em, 1em 1em 0 -0.5em, 0em 1.5em 0 -0.5em, -1em 1em 0 -0.5em, -1.5em 0em 0 0, -1em -1em 0 0.1em",
    },
  },
  spinnerRotatingSquares: {
    "0%": {
      width: "48px",
      height: "48px",
      transform: "rotate(0deg)",
    },
    "50%": {
      width: "32px",
      height: "32px",
      transform: "rotate(180deg)",
    },
    "100%": {
      width: "48px",
      height: "48px",
      transform: "rotate(360deg)",
    },
  },
  spinnerRotatingDots: {
    "0%": {
      transform: "rotate(0deg) scale(0.6)",
    },
    "50%": {
      transform: "rotate(360deg) scale(1)",
    },
    "100%": {
      transform: "rotate(720deg) scale(0.6)",
    },
  },
  spinnerRotatingDots1: {
    "0%": {
      boxShadow: `30px 0 0 ${rotatingDotsColor1}`,
    },
    "50%": {
      boxShadow: `0 0 0 ${rotatingDotsColor1}`,
      marginBottom: "0",
      transform: "translate(15px, 15px)",
    },
    "100%": {
      boxShadow: `30px 0 0 ${rotatingDotsColor1}`,
      marginBottom: "10px",
    },
  },
  spinnerRotatingDots2: {
    "0%": {
      boxShadow: `30px 0 0 ${rotatingDotsColor2}`,
    },
    "50%": {
      boxShadow: `0 0 0 ${rotatingDotsColor2}`,
      marginTop: "-20px",
      transform: "translate(15px, 15px)",
    },
    "100%": {
      boxShadow: `30px 0 0 ${rotatingDotsColor2}`,
      marginTop: "0",
    },
  },
};
