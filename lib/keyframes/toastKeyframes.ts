import { CssKeyframes } from "@pandacss/dev";

export const toastKeyframes: CssKeyframes = {
  toastSwipeInRight: {
    from: {
      transform: "translateX(100%)",
    },
    to: {
      transform: "translateX(0)",
    },
  },
  toastSwipeInLeft: {
    from: {
      transform: "translateX(-100%)",
    },
    to: {
      transform: "translateX(0)",
    },
  },
  toastSwipeInTop: {
    from: {
      transform: "translateY(-100%)",
    },
    to: {
      transform: "translateY(0)",
    },
  },
  toastSwipeInBottom: {
    from: {
      transform: "translateY(100%)",
    },
    to: {
      transform: "translateY(0)",
    },
  },
  toastSwipeOutRight: {
    from: {
      transform: "translateX(0)",
    },
    to: {
      transform: "translateX(100%)",
    },
  },
  toastSwipeOutLeft: {
    from: {
      transform: "translateX(0)",
    },
    to: {
      transform: "translateX(-100%)",
    },
  },
  toastSwipeOutTop: {
    from: {
      transform: "translateY(0)",
    },
    to: {
      transform: "translateY(-100%)",
    },
  },
  toastSwipeOutBottom: {
    from: {
      transform: "translateY(0)",
    },
    to: {
      transform: "translateY(100%)",
    },
  },
};
