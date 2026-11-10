import { defineSlotRecipe } from "@pandacss/dev";

const commonTransitions = {
  transitionProperty: "all",
  transitionDuration: "0.2s",
  transitionTimingFunction: "ease-in-out",
};

const itemTransitions = {
  transition:
    "background-color 0.15s ease, color 0.15s ease, box-shadow 0.15s ease",
};

const commonItemStates = {
  _hover: {
    backgroundColor: "color-primary-softer",
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
    "itemAction",
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
      marginInline: "2",
      padding: "0.75rem 0.5rem",
      borderTop: "1px solid",
      borderColor: "border-color",
      color: "text-secondary",
    },
    item: {
      // Positioning context for the stretched hit area of itemAction.
      position: "relative",
      display: "flex",
      width: "full",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "3",
      padding: "0.5625rem 0.625rem",
      // 4px between rows: with 2px the hovered and selected backgrounds touched.
      marginBlock: "2px",
      borderRadius: "radius-sm",
      color: "text-secondary",
      fontWeight: "medium",
      userSelect: "none",
      cursor: "pointer",
      ...itemTransitions,
      ...commonItemStates,
      '&[data-selected="true"]': {
        backgroundColor: "color-primary-soft",
        color: "color-primary",
        fontWeight: "bold",
        _hover: {
          backgroundColor: "color-primary-soft",
          color: "color-primary",
        },
      },
      // Bar on the current page only (not on the parents of a selected sub-item),
      // in the nav padding.
      "&:has(> [aria-current='page'])::before": {
        content: '""',
        position: "absolute",
        left: "-0.5rem",
        top: "2",
        bottom: "2",
        width: "3px",
        borderRadius: "0 3px 3px 0",
        backgroundColor: "color-primary",
        animation: "growY 0.2s ease-out",
      },
      // The focusable element is the row's inner button: the ring goes on the row.
      "&:has(> .aitho-sidebar__itemAction:focus-visible)": {
        boxShadow: "focus-ring",
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
      padding: "0.5625rem 0.625rem",
      borderRadius: "radius-sm",
      fontWeight: "semibold",
      color: "text-secondary",
      '&[data-selected="true"]': {
        backgroundColor: "color-primary-soft",
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
    itemAction: {
      // The item's primary action is a native <button>: reset its UA styles
      // so it looks like the row it sits in.
      flex: "1",
      minWidth: "0",
      padding: "0",
      border: "none",
      background: "transparent",
      color: "inherit",
      font: "inherit",
      textAlign: "left",
      cursor: "inherit",
      borderRadius: "radius-sm",
      _focusVisible: {
        outline: "none",
      },
      // Stretched hit area: covers the whole row (padding included) so the
      // row is clickable without a mouse-only handler on the row itself.
      _after: {
        content: '""',
        position: "absolute",
        inset: "0",
      },
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
      fontSize: "sm",
      "&[data-state='open']": {
        wordBreak: "break-word",
      },
      ...commonTransitions,
    },
    itemMenuButton: {
      // Above the item's stretched hit area, so the menu stays clickable.
      position: "relative",
      zIndex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "5",
      height: "5",
      padding: "1",
      borderRadius: "radius-sm",
      color: "text-secondary",
      cursor: "pointer",
      ...itemTransitions,
      _hover: {
        backgroundColor: "color-primary-soft",
        color: "text-primary",
      },
      _focusVisible: {
        outline: "none",
        boxShadow: "focus-ring",
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
      borderRadius: "radius-sm",
      color: "text-secondary",
      cursor: "pointer",
      backgroundColor: "background-primary",
      ...itemTransitions,
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
      borderRadius: "radius-sm",
      border: "1px solid",
      borderColor: "border-color",
      fontSize: "sm",
      ...itemTransitions,
      _focus: {
        outline: "none",
        borderColor: "color-primary",
        boxShadow: "focus-ring",
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
