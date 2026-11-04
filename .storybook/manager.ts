import { addons } from "storybook/manager-api";
import { create } from "storybook/theming/create";

const myTheme = create({
  base: "dark",
  brandTitle: "UI Component Library",
  brandTarget: "_self",
  appBg: "#1A1A1A",
  appContentBg: "#2B2B2B",
  appBorderColor: "#3A3A3A",
  appBorderRadius: 6,
  fontBase: "system-ui, sans-serif",
  fontCode: "ui-monospace, monospace",
  textColor: "#E0E0E0",
  textInverseColor: "#1A1A1A",
  barTextColor: "#999999",
  // barSelectedColor: '#00D9EA',
  barBg: "#1A1A1A",
  inputBg: "#3A3A3A",
  inputBorder: "#4A4A4A",
  inputTextColor: "#E0E0E0",
  inputBorderRadius: 4,
  colorPrimary: "#3377FF",
  // colorSecondary: '#00D9EA',
  buttonBg: "#FFF",
  buttonBorder: "transparent",
  booleanBg: "#3A3A3A",
  // booleanSelectedBg: '#00D9EA',
});

addons.setConfig({
  theme: myTheme,
});
