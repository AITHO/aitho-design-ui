import { CssKeyframes } from "@pandacss/dev";

// The dialog is centered with translate(-50%, -50%), so every frame keeps it.
export const dialogKeyframes: CssKeyframes = {
  dialogFadeIn: {
    from: {
      opacity: 0,
      transform: "translate(-50%, calc(-50% + 10px)) scale(0.97)",
    },
    to: {
      opacity: 1,
      transform: "translate(-50%, -50%) scale(1)",
    },
  },
  dialogFadeOut: {
    from: {
      opacity: 1,
      transform: "translate(-50%, -50%) scale(1)",
    },
    to: {
      opacity: 0,
      transform: "translate(-50%, calc(-50% + 10px)) scale(0.97)",
    },
  },
};
