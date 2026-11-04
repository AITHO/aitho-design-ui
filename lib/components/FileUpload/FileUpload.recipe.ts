import { defineSlotRecipe } from "@pandacss/dev";

export const fileUploadRecipe = defineSlotRecipe({
  className: "fileUpload",
  slots: [
    "inputWrapper",
    "labelContainer",
    "requiredMark",
    "inputContainer",
    "iconFileInputStyle",
    "errorText",
    "hiddenFileInput",
    "fileLabel",
    "filesContent",
    "fileIcon",
    "fileName",
    "deleteIcon",
  ],
  base: {
    inputWrapper: {
      display: "flex",
      gap: "0.938rem",
      width: "full",
    },
    labelContainer: {
      display: "flex",
      alignItems: "center",
      height: "2.5rem",
    },
    requiredMark: {
      color: "red.500",
    },
    inputContainer: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
    },
    iconFileInputStyle: {
      position: "absolute",
      zIndex: 20,
      color: "text-secondary",
      height: "1.063rem",
      width: "1.063rem",
      cursor: "pointer",
      right: "0.625rem",
      top: "50%",
      transform: "translateY(-50%)",
      "&[data-disabled='true']": {
        cursor: "not-allowed",
        opacity: 0.5,
      },
    },

    errorText: {
      color: "color-error",
      fontSize: "0.75rem",
    },
    hiddenFileInput: {
      display: "none",
    },
    fileLabel: {
      display: "block",
      border: "1px solid",
      backgroundColor: "background-primary",
      color: "background-popup",
      padding: "0.5rem 0.5rem 0.5rem 1.25rem",
      transitionProperty: "all",
      minWidth: "15.625rem",
      width: "100%",
      maxHeight: "2.5rem",
      textAlign: "justify",
      position: "relative",
      transitionDuration: "300ms",
      cursor: "pointer",
      "&[data-disabled='true']": {
        cursor: "not-allowed",
        opacity: 0.5,
      },
      _hover: {
        bg: "background-secondary",
      },
      _focusVisible: {
        outlineWidth: "2px",
        outlineStyle: "solid",
        outlineColor: "color-primary",
        outlineOffset: "2px",
        borderRadius: "radius-sm",
      },
    },
    filesContent: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0.5rem",
      transitionDuration: "300ms",
      _hover: {
        bg: "background-secondary",
        "& [class*='deleteIcon']": {
          opacity: "1",
        },
      },
      "&:focus-within": {
        "& [class*='deleteIcon']": {
          opacity: "1",
        },
      },
      "&[data-disabled='true']": {
        cursor: "not-allowed",
        opacity: 0.5,
      },
    },
    fileIcon: {
      display: "flex",
      alignItems: "center",
      gap: "0.313rem",
    },
    fileName: {
      cursor: "default",
      borderRadius: "radius",
      _focusVisible: {
        outlineWidth: "2px",
        outlineStyle: "solid",
        outlineColor: "color-primary",
        outlineOffset: "2px",
        borderRadius: "radius-sm",
      },
    },
    deleteIcon: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      background: "none",
      border: "none",
      padding: "0",
      cursor: "pointer",
      color: "color-primary",
      opacity: "0",
      transition: "opacity 0.3s ease",
      _focusVisible: {
        outlineWidth: "2px",
        outlineStyle: "solid",
        outlineColor: "color-primary",
        outlineOffset: "1px",
        borderRadius: "radius-sm",
      },
      "&[data-disabled='true']": {
        cursor: "not-allowed",
        opacity: 0.5,
      },
    },
  },
  variants: {
    borderColor: {
      base: {
        fileLabel: { borderColor: "border-color" },
      },
      primary: {
        fileLabel: { borderColor: "color-primary" },
      },
      error: {
        fileLabel: { borderColor: "color-error" },
      },
    },
    borderRadius: {
      none: {
        fileLabel: { borderRadius: "0" },
        filesContent: { borderRadius: "0" },
      },
      rounded: {
        fileLabel: { borderRadius: "radius" },
        filesContent: { borderRadius: "radius" },
      },
    },
  },
  defaultVariants: {
    borderColor: "base",
    borderRadius: "rounded",
  },
});
