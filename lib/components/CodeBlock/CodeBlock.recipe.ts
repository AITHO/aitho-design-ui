import { defineSlotRecipe } from "@pandacss/dev";

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
      fontFamily: "mono",
      position: "relative",
      overflowX: "scroll",
      backgroundColor: "background",
      border: "1px solid",
      borderColor: "border-color",
      boxShadow: "sm",
      _focusVisible: {
        outlineWidth: "2px",
        outlineStyle: "solid",
        outlineColor: "color-primary",
        outlineOffset: "2px",
      },
    },
    container: {
      display: "flex",
      width: "full",
      borderBottomRadius: "radius",
    },
    pre: {
      margin: "0",
      padding: "0",
      flex: "1",
      fontSize: "sm",
      lineHeight: "1.5",
      "& pre:focus-visible, &:focus-visible": {
        outlineWidth: "2px",
        outlineStyle: "solid",
        outlineColor: "color-primary",
        outlineOffset: "-2px",
        borderRadius: "radius-sm",
      },
    },
    lineNumbers: {
      display: "flex",
      flexDirection: "column",
      paddingInline: "4",
      borderRightWidth: "1px",
      fontSize: "sm",
      userSelect: "none",
      textAlign: "right",
      paddingBlock: "0.5rem",
      color: "text-primary",
    },
    caption: {
      width: "full",
      fontSize: "sm",
      fontWeight: "medium",
      color: "text-primary",
      paddingBlock: "2",
      paddingInline: "4",
      minHeight: "12",
      lineHeight: "2",
    },
    captionContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    copyButton: {
      display: "flex",
      justifyContent: "flex-end",
      paddingInline: "4",
      paddingBlock: "2",
    },
  },
  variants: {
    size: {
      sm: {
        pre: { fontSize: "xs" },
        lineNumbers: { fontSize: "xs" },
        caption: { fontSize: "xs" },
      },
      md: {
        pre: { fontSize: "sm" },
        lineNumbers: { fontSize: "sm" },
        caption: { fontSize: "sm" },
      },
      lg: {
        pre: { fontSize: "md" },
        lineNumbers: { fontSize: "md" },
        caption: { fontSize: "md" },
      },
    },
    theme: {
      light: {
        root: {
          bg: "background-primary",
        },
      },
      dark: {
        root: {
          bg: "background-tertiary",
        },
      },
    },
  },

  defaultVariants: {
    size: "md",
  },
});
