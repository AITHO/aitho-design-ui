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
      color: "color-error",
    },
    inputContainer: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    },
    iconFileInputStyle: {
      flexShrink: 0,
      width: "2.5rem",
      height: "2.5rem",
      padding: "0.75rem",
      borderRadius: "50%",
      backgroundColor: "color-primary-soft",
      color: "color-primary",
    },

    errorText: {
      color: "color-error",
      fontSize: "0.75rem",
    },
    hiddenFileInput: {
      display: "none",
    },
    fileLabel: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.375rem",
      borderWidth: "1.5px",
      borderStyle: "dashed",
      backgroundColor: "background-primary",
      color: "text-primary",
      fontSize: "0.875rem",
      padding: "1.5rem 1rem",
      minWidth: "15.625rem",
      width: "100%",
      textAlign: "center",
      cursor: "pointer",
      userSelect: "none",
      transition:
        "border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease",
      "&:hover:not(:disabled)": {
        backgroundColor: "color-primary-softer",
      },
      "&:active:not(:disabled)": {
        transform: "scale(0.995)",
      },
      _focusVisible: {
        outline: "none",
        boxShadow: "focus-ring",
      },
      "&[data-disabled='true']": {
        cursor: "not-allowed",
        opacity: 0.55,
        backgroundColor: "background-secondary",
      },
    },
    filesContent: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "0.625rem",
      padding: "0.625rem 0.75rem",
      border: "1px solid",
      borderColor: "border-color",
      backgroundColor: "background-primary",
      transition: "background-color 0.15s ease",
      _hover: {
        backgroundColor: "background-secondary",
      },
      "&[data-disabled='true']": {
        cursor: "not-allowed",
        opacity: 0.55,
      },
    },
    fileIcon: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      minWidth: 0,
      fontSize: "0.875rem",
      "& > svg": {
        flexShrink: 0,
        color: "text-secondary",
      },
    },
    fileName: {
      cursor: "default",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    deleteIcon: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      width: "1.75rem",
      height: "1.75rem",
      background: "none",
      border: "none",
      borderRadius: "radius-sm",
      padding: "0",
      cursor: "pointer",
      color: "text-secondary",
      transition:
        "background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease",
      "& svg": {
        width: "1rem",
        height: "1rem",
      },
      "&:hover:not(:disabled)": {
        color: "color-error",
        backgroundColor: "color-error-soft",
      },
      _focusVisible: {
        outline: "none",
        boxShadow: "focus-ring",
      },
      _disabled: {
        cursor: "not-allowed",
      },
    },
  },
  variants: {
    borderColor: {
      base: {
        fileLabel: {
          borderColor: "border-color",
          "&:hover:not(:disabled)": { borderColor: "color-primary" },
          _focusVisible: { borderColor: "color-primary" },
        },
      },
      primary: {
        fileLabel: { borderColor: "color-primary" },
      },
      error: {
        fileLabel: {
          borderColor: "color-error",
          "&:hover:not(:disabled)": { backgroundColor: "color-error-soft" },
          _focusVisible: { boxShadow: "focus-ring-error" },
        },
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
