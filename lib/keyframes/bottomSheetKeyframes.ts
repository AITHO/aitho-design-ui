import { CssKeyframes } from "@pandacss/dev";

export const bottomSheetKeyframes: CssKeyframes = {
  bottomSheetSlideIn: {
    from: {
      transform: "translateY(100%)",
    },
    to: {
      transform: "translateY(0)",
    },
  },
};
