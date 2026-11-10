import { defineSlotRecipe } from "@pandacss/dev";
import { pickerPanelStyles } from "../DatePickerMonth/DatePickerMonth.recipe";

const THUMB = {
  position: "absolute",
  width: "16px",
  height: "16px",
  borderRadius: "50%",
  border: "2px solid white",
  boxShadow: "0 0 0 1px rgb(0 0 0 / 0.35), 0 1px 3px rgb(0 0 0 / 0.4)",
  transform: "translate(-50%, -50%)",
  pointerEvents: "none",
};

const SLIDER_FOCUS = {
  _focusVisible: {
    outline: "none",
    boxShadow: "focus-ring",
  },
};

export const colorPickerRecipe = defineSlotRecipe({
  className: "color-picker",
  slots: [
    "trigger",
    "swatch",
    "popoverContent",
    "area",
    "areaThumb",
    "hue",
    "hueThumb",
    "presets",
    "preset",
  ],
  base: {
    // Same box as an Input field, with the colour as its content.
    trigger: {
      display: "inline-grid",
      placeItems: "center",
      flex: "none",
      width: "2.375rem",
      height: "2.375rem",
      padding: "4px",
      border: "1px solid",
      borderColor: "border-color",
      borderRadius: "radius",
      backgroundColor: "background-primary",
      cursor: "pointer",
      transition: "border-color 0.15s ease, box-shadow 0.15s ease",
      _hover: { borderColor: "color-primary" },
      _focusVisible: { outline: "none", boxShadow: "focus-ring" },
      "&[data-state='open']": {
        borderColor: "color-primary",
        boxShadow: "focus-ring",
      },
      _disabled: {
        cursor: "not-allowed",
        opacity: 0.55,
        _hover: { borderColor: "border-color" },
      },
    },
    swatch: {
      width: "100%",
      height: "100%",
      borderRadius: "radius-sm",
      boxShadow: "inset 0 0 0 1px rgb(0 0 0 / 0.12)",
    },
    popoverContent: {
      ...pickerPanelStyles.popoverContent,
      zIndex: "9999",
      width: "15rem",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    area: {
      position: "relative",
      height: "150px",
      borderRadius: "radius-sm",
      cursor: "crosshair",
      touchAction: "none",
      ...SLIDER_FOCUS,
    },
    areaThumb: THUMB,
    hue: {
      position: "relative",
      height: "12px",
      borderRadius: "6px",
      background:
        "linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)",
      cursor: "pointer",
      touchAction: "none",
      ...SLIDER_FOCUS,
    },
    hueThumb: {
      ...THUMB,
      top: "50%",
    },
    presets: {
      display: "flex",
      flexWrap: "wrap",
      gap: "6px",
    },
    preset: {
      width: "22px",
      height: "22px",
      padding: "0",
      border: "none",
      borderRadius: "radius-sm",
      boxShadow: "inset 0 0 0 1px rgb(0 0 0 / 0.15)",
      cursor: "pointer",
      transition: "transform 0.15s ease, box-shadow 0.15s ease",
      _hover: { transform: "scale(1.1)" },
      _focusVisible: { outline: "none", boxShadow: "focus-ring" },
      "&[aria-pressed='true']": {
        boxShadow:
          "0 0 0 2px {colors.background-primary}, 0 0 0 4px {colors.color-primary}",
      },
    },
  },
});
