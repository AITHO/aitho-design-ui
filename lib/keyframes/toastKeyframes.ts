import { CssKeyframes } from "@pandacss/dev";

// Toast.tsx and ToastProvider detect the exit by the "toastSwipe" name prefix.
export const toastKeyframes: CssKeyframes = {
  toastSwipeInRight: {
    from: { opacity: 0, transform: "translateX(12px)" },
    to: { opacity: 1, transform: "translateX(0)" },
  },
  toastSwipeInLeft: {
    from: { opacity: 0, transform: "translateX(-12px)" },
    to: { opacity: 1, transform: "translateX(0)" },
  },
  toastSwipeInTop: {
    from: { opacity: 0, transform: "translateY(-8px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
  toastSwipeInBottom: {
    from: { opacity: 0, transform: "translateY(8px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
  toastSwipeOutRight: {
    from: { opacity: 1, transform: "translateX(0)" },
    to: { opacity: 0, transform: "translateX(12px)" },
  },
  toastSwipeOutLeft: {
    from: { opacity: 1, transform: "translateX(0)" },
    to: { opacity: 0, transform: "translateX(-12px)" },
  },
  toastSwipeOutTop: {
    from: { opacity: 1, transform: "translateY(0)" },
    to: { opacity: 0, transform: "translateY(-8px)" },
  },
  toastSwipeOutBottom: {
    from: { opacity: 1, transform: "translateY(0)" },
    to: { opacity: 0, transform: "translateY(8px)" },
  },
};
