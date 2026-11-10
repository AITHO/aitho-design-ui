import { CssKeyframes } from "@pandacss/dev";

export const checkboxKeyframes: CssKeyframes = {
  check: {
    from: {
      transform: "scale(0)",
    },
    to: {
      transform: "scale(1)",
    },
  },
  uncheck: {
    from: {
      transform: "scale(1)",
    },
    to: {
      transform: "scale(0)",
    },
  },
};
