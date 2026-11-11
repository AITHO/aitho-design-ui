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
    "caption",
    ...POSITIONS,
  ],
  base: {
    root: {
      display: "block",
      // Containing block of the sideways scrollbar Table.tsx draws over the table.
      position: "relative",
      width: "100%",
      color: "text-primary",
    },
    caption: {
      srOnly: true,
    },
    tableContainer: {
      overflowX: "auto",
      borderRadius: "radius",
      bg: "background-primary",
      // Only when the table is wider than its box (data attributes set by Table.tsx):
      // the first column stays put while the rest scrolls under it.
      "&[data-overflow] tr > :first-child": {
        position: "sticky",
        left: 0,
        zIndex: 1,
        bg: "background-primary",
        transition: "box-shadow 0.15s ease",
      },
      "&[data-overflow] thead tr > :first-child": {
        zIndex: 2,
        bg: "background-secondary",
      },
      // The row tint has to sit on an opaque base, or the scrolled cells show through.
      "&[data-overflow] tbody tr:hover > :first-child": {
        backgroundImage:
          "linear-gradient({colors.color-primary-softer}, {colors.color-primary-softer})",
      },
      // A border-coloured edge plus a soft shadow: the line still reads on dark themes.
      "&[data-scrolled] tr > :first-child": {
        boxShadow:
          "1px 0 0 {colors.border-color}, 6px 0 10px -6px rgb(0 0 0 / 0.5)",
      },
    },
    table: {
      display: "table",
      width: "100%",
      fontSize: "sm",
    },
    header: {
      position: "relative",
      padding: "10px 14px",
      textAlign: "left",
      // Labels wrap instead of running into the next column when columns are narrow.
      whiteSpace: "normal",
      overflowWrap: "break-word",
      fontSize: "xs",
      fontWeight: "semibold",
      color: "text-secondary",
      bg: "background-secondary",
      borderBottom: "1px solid",
      borderColor: "border-color",
      transition: "box-shadow 0.15s ease",
      // The sort button sits inside a scrolling container: an inset ring on the
      // cell is never clipped, unlike the button's own outer ring.
      "&:has(:focus-visible)": {
        boxShadow: "inset 0 0 0 2px {colors.color-primary}",
      },
      "& button:focus-visible": {
        outline: "none",
        boxShadow: "none",
      },
      "& .header-content": {
        display: "flex",
        alignItems: "center",
        gap: "6px",
      },
    },
    sortIcons: {
      display: "flex",
      color: "text-secondary",
      transition: "color 0.15s ease",
      "th[aria-sort] &": {
        color: "color-primary",
      },
    },
    row: {
      display: "table-row",
    },
    cell: {
      display: "table-cell",
      padding: "12px 14px",
      transition: "background-color 0.12s ease",
      // On the cells so the tint also covers the striped rows, whose
      // background comes from a compound variant.
      "tbody tr:hover > &": {
        bg: "color-primary-softer",
      },
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
        row: {
          borderColor: "border-color",
        },
      },
      secondary: {
        tableContainer: {
          bg: "table-base-color",
          "&[data-overflow] tbody tr > :first-child": {
            bg: "table-base-color",
          },
          "&[data-overflow] thead tr > :first-child": {
            bg: "background-tertiary",
          },
        },
        header: {
          color: "text-primary",
          bg: "background-tertiary",
        },
        row: {
          borderColor: "border-color",
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
          borderColor: "border-color",
          // The wrapper border closes the table: the last row needs no separator.
          "& tbody tr:last-child": {
            borderBottom: "none",
          },
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
          borderColor: "border-color",
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
      css: {
        root: {
          "& tr:nth-child(even)": { bg: "table-striped-color" },
          // The fixed first cell takes its striped row's colour.
          "& [data-overflow] tbody tr:nth-child(even) > :first-child": {
            bg: "table-striped-color",
          },
        },
      },
    },
    {
      variant: "secondary",
      striped: true,
      css: {
        root: {
          "& tr:nth-child(even)": { bg: "background-secondary" },
          "& [data-overflow] tbody tr:nth-child(even) > :first-child": {
            bg: "background-secondary",
          },
        },
      },
    },
  ],

  defaultVariants: {
    paginationPosition: "bottom",
    variant: "primary",
    // Framed by default: a table without its own border blends into the card around it.
    sideBorders: true,
    bottomBorders: true,
  },
});
