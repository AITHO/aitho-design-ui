import { CssKeyframes } from "@pandacss/dev";

export const bottomSheetKeyframes: CssKeyframes = {
  bottomSheetSlideIn: {
    from: {
      transform: "translateY(24%)",
      opacity: 0.6,
    },
    to: {
      transform: "translateY(0)",
      opacity: 1,
    },
  },
};
