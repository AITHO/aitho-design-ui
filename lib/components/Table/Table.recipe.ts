import { defineSlotRecipe } from "@pandacss/dev";

const POSITIONS = [
  "top-left",
  "top-right",
  "top",
  "bottom-left",
  "bottom-right",
  "bottom",
] as const;

const POSITION_MAPS = {
  "top-left": {
    top: "0",
    left: "0",
    bottom: "auto",
    right: "auto",
    justifyContent: "flex-start",
  },
  "top-right": {
    top: "0",
    right: "0",
    bottom: "auto",
    left: "auto",
    justifyContent: "flex-end",
  },
  top: {
    top: "0",
    left: "50%",
    right: "auto",
    bottom: "auto",
  },
  "bottom-left": {
    bottom: "0",
    left: "0",
    right: "auto",
    top: "auto",
    justifyContent: "flex-start",
  },
  "bottom-right": {
    bottom: "0",
    right: "0",
    left: "auto",
    top: "auto",
    justifyContent: "flex-end",
  },
  bottom: {
    bottom: "0",
    left: "50%",
    right: "auto",
    top: "auto",
  },
};

export const tableRecipe = defineSlotRecipe({
  className: "table",
  slots: [
    "root",
    "row",
    "cell",
    "table",
    "tableContainer",
    "header",
    "sortIcons",
    "pagination",
    ...POSITIONS,
  ],
  base: {
    root: {
      display: "block",
      width: "100%",
    },
    table: {
      display: "table",
      width: "100%",
    },
    header: {
      fontWeight: "bold",
      textAlign: "left",
      padding: "3",
      position: "relative",
      _focusWithin: {
        outlineWidth: "2px",
        outlineStyle: "solid",
        outlineColor: "color-primary",
        outlineOffset: "2px",
        borderRadius: "radius-sm",
        zIndex: "999999",
      },
      "& button:focus-visible": {
        outline: "none",
      },
      "& .header-content": {
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
      },
      "&:not(:last-child)::after": {
        content: '""',
        position: "absolute",
        top: "25%",
        bottom: "25%",
        right: "0",
        width: "1px",
        bg: "border-color",
      },
      _first: {
        borderTopLeftRadius: "radius",
      },
      _last: {
        borderTopRightRadius: "radius",
      },
    },
    sortIcons: {
      color: "text-on-primary",
    },
    row: {
      display: "table-row",
    },
    cell: {
      display: "table-cell",
      padding: "3",
    },
    pagination: {
      display: "flex",
      justifyContent: "center",
      padding: "0.625rem 0",
      marginTop: "0.313rem",
    },
  },
  variants: {
    variant: {
      primary: {
        root: {
          color: "text-primary",
          borderColor: "color-primary",
        },
        header: {
          color: "text-on-primary",
          bg: "color-primary",
        },
        row: {
          borderColor: "color-primary",
          bg: "table-base-color",
        },
      },
      secondary: {
        root: {
          color: "text-contrast",
          borderColor: "dark",
        },
        header: {
          bg: "background-popup",
          color: "text-on-primary",
        },
        row: {
          color: "text-primary",
          borderColor: "dark",
          bg: "background-tertiary",
        },
      },
    },
    paginationPosition: Object.fromEntries(
      POSITIONS.map((position) => [
        position,
        {
          pagination: POSITION_MAPS[position],
        },
      ]),
    ),
    striped: {
      true: {},
      false: {},
    },
    sideBorders: {
      true: {
        tableContainer: {
          border: "1px solid",
          borderBottom: "none",
          borderColor: "color-primary",
          borderTopLeftRadius: "0.5rem",
          borderTopRightRadius: "0.5rem",
        },
      },
      false: {
        tableContainer: {
          borderLeft: "none",
          borderRight: "none",
        },
      },
    },
    bottomBorders: {
      true: {
        row: {
          borderBottom: "1px solid",
          borderColor: "color-primary",
        },
      },
      false: {
        row: {
          borderBottom: "none",
        },
      },
    },
  },
  compoundVariants: [
    {
      variant: "primary",
      striped: true,
      css: { root: { "& tr:nth-child(even)": { bg: "table-striped-color" } } },
    },
    {
      variant: "secondary",
      striped: true,
      css: { root: { "& tr:nth-child(even)": { bg: "background-secondary" } } },
    },
  ],

  defaultVariants: {
    paginationPosition: "bottom",
    variant: "primary",
    sideBorders: false,
    bottomBorders: true,
  },
});
