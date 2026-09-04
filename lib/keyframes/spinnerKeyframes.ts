import { CssKeyframes } from "@pandacss/dev";

const linearFlashingDotsColor1 = "var(--color-primary)";
const linearFlashingDotsColor2 = "var(--accent)";
const rotatingDotsColor1 = "var(--color-primary)";
const rotatingDotsColor2 = "var(--accent)";

export const spinnerKeyframes: CssKeyframes = {
  spinnerSpinningSlashes: {
    "0%, 100%": { boxShadow: ".2em 0px 0 0px" },
    "12%": { boxShadow: ".2em .2em 0 0" },
    "25%": { boxShadow: "0 .2em 0 0px" },
    "37%": { boxShadow: "-.2em .2em 0 0" },
    "50%": { boxShadow: "-.2em 0 0 0" },
    "62%": { boxShadow: "-.2em -.2em 0 0" },
    "75%": { boxShadow: "0px -.2em 0 0" },
    "87%": { boxShadow: ".2em -.2em 0 0" },
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
  spinnerLinearFlashingDots: {
    "0%": {
      backgroundColor: linearFlashingDotsColor2,
      boxShadow: `32px 0 ${linearFlashingDotsColor2}, -32px 0 ${linearFlashingDotsColor1}`,
    },
    "50%": {
      backgroundColor: linearFlashingDotsColor1,
      boxShadow: `32px 0 ${linearFlashingDotsColor2}, -32px 0 ${linearFlashingDotsColor2}`,
    },
    "100%": {
      backgroundColor: linearFlashingDotsColor2,
      boxShadow: `32px 0 ${linearFlashingDotsColor1}, -32px 0 ${linearFlashingDotsColor2}`,
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
