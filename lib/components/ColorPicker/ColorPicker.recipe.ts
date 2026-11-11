import { defineSlotRecipe } from "@pandacss/dev";

const focusRing = {
  outlineWidth: "2px",
  outlineStyle: "solid",
  outlineColor: "color-primary",
  outlineOffset: "2px",
} as const;

// White ring plus dark shadow: the thumbs sit on arbitrary colors, so they need both to stay
// visible on light and dark areas alike. These are not theme colors on purpose.
const thumbBase = {
  position: "absolute",
  borderRadius: "full",
  border: "2px solid #ffffff",
  boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.35), 0 1px 3px rgba(0, 0, 0, 0.4)",
  pointerEvents: "none",
  transform: "translate(-50%, -50%)",
} as const;

export const colorPickerRecipe = defineSlotRecipe({
  className: "color-picker",
  slots: [
    "trigger",
    "triggerSwatch",
    "visuallyHidden",
    "content",
    "saturation",
    "saturationThumb",
    "controls",
    "preview",
    "hue",
    "hueThumb",
    "eyeDropper",
    "format",
    "formatOption",
    "hexField",
    "rgbFields",
    "swatches",
    "swatch",
  ],
  base: {
    trigger: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "3rem",
      height: "2.25rem",
      padding: "0.25rem",
      borderRadius: "radius",
      border: "1px solid var(--border-color)",
      backgroundColor: "background-primary",
      cursor: "pointer",
      transition: "border-color 150ms ease-in-out",
      _hover: { borderColor: "color-primary" },
      _focusVisible: focusRing,
      _disabled: {
        cursor: "not-allowed",
        opacity: 0.5,
        _hover: { borderColor: "border-color" },
      },
    },
    triggerSwatch: {
      display: "block",
      width: "100%",
      height: "100%",
      borderRadius: "radius-sm",
      boxShadow: "inset 0 0 0 1px rgba(0, 0, 0, 0.1)",
    },
    visuallyHidden: {
      srOnly: true,
    },
    content: {
      zIndex: "10",
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
      width: "15rem",
      padding: "0.75rem",
      borderRadius: "radius",
      border: "1px solid var(--border-color)",
      backgroundColor: "background-secondary",
      color: "text-primary",
      boxShadow: "0 4px 16px 0 rgba(0, 0, 0, 0.16)",
      animationDuration: "200ms",
      animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      willChange: "transform, opacity",
    },
    saturation: {
      position: "relative",
      width: "100%",
      height: "9.5rem",
      borderRadius: "radius-sm",
      backgroundImage:
        "linear-gradient(to top, #000000, transparent), linear-gradient(to right, #ffffff, transparent)",
      cursor: "crosshair",
      touchAction: "none",
      _focusVisible: focusRing,
    },
    saturationThumb: {
      ...thumbBase,
      width: "0.875rem",
      height: "0.875rem",
    },
    controls: {
      display: "flex",
      alignItems: "center",
      gap: "0.625rem",
    },
    preview: {
      flexShrink: 0,
      width: "1.75rem",
      height: "1.75rem",
      borderRadius: "full",
      boxShadow: "inset 0 0 0 1px rgba(0, 0, 0, 0.15)",
    },
    hue: {
      position: "relative",
      flex: "1",
      height: "0.625rem",
      borderRadius: "full",
      backgroundImage:
        "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
      cursor: "pointer",
      touchAction: "none",
      _focusVisible: focusRing,
    },
    hueThumb: {
      ...thumbBase,
      top: "50%",
      width: "1rem",
      height: "1rem",
    },
    eyeDropper: {
      flexShrink: 0,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: "1.75rem",
      height: "1.75rem",
      borderRadius: "radius-sm",
      color: "text-primary",
      cursor: "pointer",
      _hover: { backgroundColor: "background-tertiary" },
      _focusVisible: focusRing,
    },
    // The library Input has a 15.625rem min-width, wider than the panel: let it shrink here.
    // HEX | RGB: a small segmented switch, the pressed option raised on the tinted track.
    format: {
      // A <fieldset>: no browser margin, border or min-width.
      display: "inline-flex",
      alignSelf: "flex-start",
      gap: "0.125rem",
      margin: 0,
      padding: "0.125rem",
      minWidth: 0,
      border: "none",
      borderRadius: "radius-sm",
      backgroundColor: "background-tertiary",
    },
    formatOption: {
      height: "1.5rem",
      paddingInline: "0.625rem",
      borderRadius: "radius-sm",
      fontSize: "0.75rem",
      fontWeight: "600",
      letterSpacing: "0.02em",
      color: "text-secondary",
      cursor: "pointer",
      _hover: { color: "text-primary" },
      _focusVisible: focusRing,
      "&[aria-pressed=true]": {
        backgroundColor: "background-secondary",
        color: "text-primary",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.16)",
      },
    },
    hexField: {
      "& input": {
        minWidth: "0",
        fontFamily: "mono",
      },
    },
    rgbFields: {
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      gap: "0.5rem",
      // Three fields side by side: each label goes above its field, which keeps the full width.
      // `> div` outweighs the Input recipe's own row layout.
      "& > div": {
        flexDirection: "column",
        alignItems: "stretch",
        gap: "0.25rem",
        minWidth: "0",
      },
      "& input": {
        minWidth: "0",
        fontFamily: "mono",
      },
    },
    swatches: {
      // A <fieldset>: reset the browser's default margin, padding, border and min-width.
      display: "grid",
      gridTemplateColumns: "repeat(8, 1fr)",
      gap: "0.375rem",
      margin: 0,
      padding: 0,
      paddingTop: "0.75rem",
      minWidth: 0,
      border: "none",
      borderTop: "1px solid var(--border-color)",
    },
    swatch: {
      width: "100%",
      aspectRatio: "1 / 1",
      borderRadius: "radius-sm",
      boxShadow: "inset 0 0 0 1px rgba(0, 0, 0, 0.15)",
      cursor: "pointer",
      _focusVisible: focusRing,
      _pressed: {
        outlineWidth: "2px",
        outlineStyle: "solid",
        outlineColor: "text-primary",
        outlineOffset: "2px",
      },
    },
  },
});
