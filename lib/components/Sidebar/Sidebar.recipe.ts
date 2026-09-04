import { defineSlotRecipe } from "@pandacss/dev";

const commonTransitions = {
  transitionProperty: "all",
  transitionDuration: "0.2s",
  transitionTimingFunction: "ease-in-out",
};

const commonItemStates = {
  _hover: {
    backgroundColor: "background-tertiary",
    color: "text-primary",
  },
  _disabled: {
    opacity: 0.5,
    cursor: "not-allowed",
    _hover: {
      backgroundColor: "transparent",
      color: "text-secondary",
    },
  },
};

const commonSidebarSizes = {
  collapsed: "16",
  expanded: "72",
};

export const sidebarRecipe = defineSlotRecipe({
  className: "sidebar",
  slots: [
    "root",
    "overlay",
    "container",
    "header",
    "nav",
    "footer",
    "item",
    "alwaysOpenSubItems",
    "itemContainer",
    "itemIcon",
    "itemText",
    "itemMenuButton",
    "subItems",
    "editContainer",
    "editActions",
    "editButton",
    "itemInput",
  ],
  base: {
    root: {
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "background-secondary",
      borderRight: "1px solid",
      borderColor: "border-color",
      ...commonTransitions,
      zIndex: "50",
    },
    container: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      height: "full",
      overflowX: "hidden",
      overflowY: "auto",
    },
    header: {
      display: "flex",
      alignItems: "center",
      padding: "3",
      minHeight: "16",
      color: "text-secondary",
    },
    nav: {
      flex: "1",
      padding: "2",
      overflowY: "auto",
      overflowX: "hidden",
    },
    footer: {
      padding: "3",
      color: "text-secondary",
    },
    item: {
      display: "flex",
      width: "full",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "3",
      padding: "3",
      borderRadius: "radius",
      color: "text-secondary",
      cursor: "pointer",
      ...commonTransitions,
      ...commonItemStates,
      '&[data-selected="true"]': {
        backgroundColor: "color-primary-dark",
        color: "color-primary",
        fontWeight: "semibold",
      },
      "&[data-disabled='true']": {
        ...commonItemStates._disabled,
      },
    },
    alwaysOpenSubItems: {
      display: "flex",
      width: "full",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "3",
      padding: "3",
      borderRadius: "radius",
      fontWeight: "semibold",
      color: "text-secondary",
      '&[data-selected="true"]': {
        backgroundColor: "color-primary-dark",
        color: "color-primary",
        fontWeight: "semibold",
      },
      "&[data-disabled='true']": {
        ...commonItemStates._disabled,
      },
    },
    itemContainer: {
      display: "flex",
      alignItems: "center",
      gap: "3",
    },
    itemIcon: {
      flexShrink: "0",
      width: "5",
      height: "5",
      alignItems: "center",
      display: "flex",
      '&[data-selected="true"]': {
        backgroundColor: "color-primary-dark",
        color: "color-primary",
        fontWeight: "semibold",
      },
    },
    itemText: {
      fontSize: "lg",
      "&[data-state='open']": {
        wordBreak: "break-word",
      },
      ...commonTransitions,
    },
    itemMenuButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "5",
      height: "5",
      padding: "1",
      borderRadius: "border-radius",
      color: "text-secondary",
      cursor: "pointer",
      ...commonTransitions,
      _hover: {
        backgroundColor: "background-tertiary",
        color: "text-primary",
      },
    },
    subItems: {
      display: "grid",
      gridTemplateRows: "0fr",
      ...commonTransitions,
    },
    editContainer: {
      display: "flex",
      alignItems: "center",
      gap: "2",
      flex: "1",
      position: "relative",
    },
    editActions: {
      display: "flex",
      alignItems: "center",
      gap: "1",
      marginLeft: "2",
    },
    editButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "5",
      height: "5",
      padding: "1",
      borderRadius: "border-radius",
      color: "text-secondary",
      cursor: "pointer",
      backgroundColor: "background-primary",
      ...commonTransitions,
      _hover: {
        backgroundColor: "background-secondary",
        color: "text-primary",
      },
    },
    itemInput: {
      width: "full",
      height: "6",
      padding: "1",
      backgroundColor: "background-primary",
      color: "text-primary",
      borderRadius: "radius",
      border: "1px solid",
      borderColor: "border-color",
      fontSize: "sm",
      ...commonTransitions,
      _focus: {
        outline: "none",
        borderColor: "color-primary",
        backgroundColor: "background-secondary",
      },
    },
  },
  variants: {
    position: {
      fixed: {
        root: {
          position: "fixed",
          top: "0",
        },
      },
      static: {
        root: {
          position: "static",
        },
      },
    },
    anchor: {
      left: {
        root: {
          left: "0",
          borderRight: "1px solid",
          borderLeft: "none",
          borderColor: "border-color",
        },
      },
      right: {
        root: {
          right: "0",
          borderLeft: "1px solid",
          borderRight: "none",
          borderColor: "border-color",
        },
      },
    },
    behaviour: {
      permanent: {
        root: {
          transform: "none",
          width: commonSidebarSizes.expanded,
          minWidth: "64",
        },
        itemText: {
          opacity: "1",
          visibility: "visible",
        },
      },
      toggle: {
        root: {
          width: commonSidebarSizes.expanded,
          transition: "width 0.2s ease-in-out, transform 0.2s ease-in-out",
          "&[data-state='open']": {
            minWidth: "64",
          },
          "&[data-state='closed']": {
            width: 0,
            "&[data-direction='left']": {
              transform: "translateX(-100%)",
            },
            "&[data-direction='right']": {
              transform: "translateX(100%)",
            },
          },
        },
        itemText: {
          transition: "opacity 0.2s ease-in-out, visibility 0.2s ease-in-out",
          "&[data-state='closed']": {
            opacity: "0",
            visibility: "hidden",
          },
          "&[data-state='open']": {
            opacity: "1",
            visibility: "visible",
          },
        },
      },
      drawer: {
        root: {
          position: "fixed",
          top: "0",
          height: "100dvh",
          width: "18.75rem",
          maxWidth: "85vw",
          zIndex: "999",
          transition: "transform 0.2s ease-in-out",
          "&[data-state='open']": {
            transform: "translateX(0)",
          },
          "&[data-state='closed']": {
            transform: "translateX(-100%)",
            "&[data-direction='right']": {
              transform: "translateX(100%)",
            },
          },
        },
        overlay: {
          position: "fixed",
          inset: 0,
          backgroundColor: "background-overlay",
          zIndex: "998",
        },
        itemText: {
          opacity: "1",
          visibility: "visible",
        },
      },
      hover: {
        root: {
          "&[data-state='closed']": {
            width: commonSidebarSizes.collapsed,
            _hover: {
              width: commonSidebarSizes.expanded,
            },
          },
          "&[data-state='open']": {
            width: commonSidebarSizes.expanded,
            minWidth: "64",
          },
        },
        itemText: {
          "&[data-state='closed']": {
            opacity: "0",
            visibility: "hidden",
          },
          "&[data-state='open']": {
            opacity: "1",
            visibility: "visible",
          },
        },
      },
    },
    variant: {
      primary: {
        root: {
          backgroundColor: "background-primary",
        },
      },
      secondary: {
        root: {
          backgroundColor: "background-tertiary",
        },
      },
      tertiary: {
        root: {
          backgroundColor: "transparent",
          borderColor: "transparent",
        },
      },
    },
  },
  defaultVariants: {
    position: "static",
    anchor: "left",
    behaviour: "toggle",
    variant: "primary",
  },
});
