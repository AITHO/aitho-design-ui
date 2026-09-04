import { CssKeyframes } from "@pandacss/dev";

export const dialogKeyframes: CssKeyframes = {
  dialogFadeIn: {
    from: {
      opacity: 0,
      transform: "translate(-50%, -40%)",
    },
    to: {
      opacity: 1,
      transform: "translate(-50%, -50%)",
    },
  },
};
