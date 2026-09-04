import { CssKeyframes } from "@pandacss/dev";

export const datePickerYearKeyframes: CssKeyframes = {
  slideUpAndFade: {
    from: {
      opacity: 0,
      transform: "translateY(2px)",
    },
    to: {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
  slideRightAndFade: {
    from: {
      opacity: 0,
      transform: "translateX(-2px)",
    },
    to: {
      opacity: 1,
      transform: "translateX(0)",
    },
  },
  slideDownAndFade: {
    from: {
      opacity: 0,
      transform: "translateY(-2px)",
    },
    to: {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
  slideLeftAndFade: {
    from: {
      opacity: 0,
      transform: "translateX(2px)",
    },
    to: {
      opacity: 1,
      transform: "translateX(0)",
    },
  },
};
