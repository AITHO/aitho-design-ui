import { CssKeyframes } from "@pandacss/dev";

// Generic motion shared by every component: entering content, selections, overlays.
export const commonKeyframes: CssKeyframes = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  // Driven by a scroll timeline: fades the edges of a list that still have content behind them.
  scrollEdgeFade: {
    from: { "--aitho-fade-top": "0px", "--aitho-fade-bottom": "28px" },
    "12%": { "--aitho-fade-top": "28px" },
    "88%": { "--aitho-fade-bottom": "28px" },
    to: { "--aitho-fade-top": "28px", "--aitho-fade-bottom": "0px" },
  },
  fadeOut: {
    from: { opacity: 1 },
    to: { opacity: 0 },
  },
  fadeDown: {
    from: { opacity: 0, transform: "translateY(-4px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
  popIn: {
    from: { opacity: 0, transform: "translateY(-4px) scale(0.98)" },
    to: { opacity: 1, transform: "translateY(0) scale(1)" },
  },
  popOut: {
    from: { opacity: 1, transform: "translateY(0) scale(1)" },
    to: { opacity: 0, transform: "translateY(-4px) scale(0.98)" },
  },
  scaleIn: {
    from: { transform: "scale(0.85)" },
    to: { transform: "scale(1)" },
  },
  growX: {
    from: { transform: "scaleX(0)" },
    to: { transform: "scaleX(1)" },
  },
  growY: {
    from: { transform: "scaleY(0)" },
    to: { transform: "scaleY(1)" },
  },
  fromBelow: {
    from: { opacity: 0, transform: "translateY(6px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
  fromAbove: {
    from: { opacity: 0, transform: "translateY(-6px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  },
  fromRight: {
    from: { opacity: 0, transform: "translateX(8px)" },
    to: { opacity: 1, transform: "translateX(0)" },
  },
  fromLeft: {
    from: { opacity: 0, transform: "translateX(-8px)" },
    to: { opacity: 1, transform: "translateX(0)" },
  },
};
