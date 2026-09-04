import { CssKeyframes } from "@pandacss/dev";

export const accordionKeyframes: CssKeyframes = {
  accordionSlideDown: {
    from: {
      height: 0,
      padding: 0,
      opacity: 0,
    },
    to: {
      height: "var(--radix-accordion-content-height)",
      opacity: 1,
      padding: "10px",
    },
  },
  accordionSlideUp: {
    from: {
      height: "var(--radix-accordion-content-height)",
      opacity: 1,
      padding: "10px",
    },
    to: {
      height: 0,
      opacity: 0,
      padding: 0,
    },
  },
};
