import { CssKeyframes } from "@pandacss/dev";

// Radix measures the content height with its padding; padding-bottom collapses with it
// and its other end comes from the element's own style.
export const accordionKeyframes: CssKeyframes = {
  accordionSlideDown: {
    from: {
      height: 0,
      paddingBottom: 0,
      opacity: 0,
    },
    to: {
      height: "var(--radix-accordion-content-height)",
      opacity: 1,
    },
  },
  accordionSlideUp: {
    from: {
      height: "var(--radix-accordion-content-height)",
      opacity: 1,
    },
    to: {
      height: 0,
      paddingBottom: 0,
      opacity: 0,
    },
  },
};
