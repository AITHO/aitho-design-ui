import { defineSlotRecipe } from "@pandacss/dev";

// A shade darker than the page, derived from the theme colors.
const lightCodeBg =
  "color-mix(in srgb, {colors.background-primary} 94%, {colors.text-primary})";
const darkCodeBg = "color-mix(in srgb, {colors.background-primary} 80%, black)";

export const codeBlockRecipe = defineSlotRecipe({
  className: "code-block",
  slots: [
    "root",
    "container",
    "pre",
    "lineNumbers",
    "caption",
    "captionContainer",
    "copyButton",
  ],
  base: {
    root: {
      width: "full",
      borderRadius: "radius",
      position: "relative",
      overflow: "hidden",
      backgroundColor: lightCodeBg,
      border: "1px solid",
      borderColor: "border-color",
    },
    container: {
      display: "flex",
      width: "full",
      overflowX: "auto",
      fontFamily: "mono",
    },
    pre: {
      margin: "0",
      padding: "0",
      flex: "1",
      fontSize: "13px",
      lineHeight: "1.7",
      // Shiki paints its theme background inline on its <pre>, and main.css pads
      // .shiki outside any layer: both need !important to match the line numbers.
      "& pre": {
        margin: "0",
        padding: "12px 14px !important",
        backgroundColor: "transparent !important",
        fontFamily: "inherit",
      },
      // Inset so the scrolling container does not clip it.
      "& pre:focus-visible, &:focus-visible": {
        outline: "none",
        boxShadow: "inset 0 0 0 2px {colors.color-primary}",
      },
    },
    lineNumbers: {
      display: "flex",
      flexDirection: "column",
      minWidth: "40px",
      paddingBlock: "12px",
      paddingLeft: "14px",
      fontSize: "13px",
      lineHeight: "1.7",
      textAlign: "right",
      color: "text-secondary",
      opacity: 0.5,
      userSelect: "none",
    },
    caption: {
      flex: "1",
      fontSize: "12px",
      color: "text-secondary",
      lineHeight: "1.5",
    },
    captionContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "8px",
      minHeight: "40px",
      padding: "6px 8px 6px 14px",
      borderBottom: "1px solid",
      borderColor: "border-color",
      userSelect: "none",
    },
    copyButton: {
      display: "flex",
      justifyContent: "flex-end",
    },
  },
  variants: {
    size: {
      sm: {
        pre: { fontSize: "12px" },
        lineNumbers: { fontSize: "12px" },
        caption: { fontSize: "11px" },
      },
      md: {
        pre: { fontSize: "13px" },
        lineNumbers: { fontSize: "13px" },
        caption: { fontSize: "12px" },
      },
      lg: {
        pre: { fontSize: "15px" },
        lineNumbers: { fontSize: "15px" },
        caption: { fontSize: "13px" },
      },
    },
    theme: {
      light: {
        root: {
          bg: lightCodeBg,
        },
      },
      dark: {
        root: {
          bg: darkCodeBg,
        },
      },
    },
  },

  defaultVariants: {
    size: "md",
  },
});
