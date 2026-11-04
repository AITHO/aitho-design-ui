import * as React from "react";
import { useCallback, useMemo, useState } from "react";
import { table, type TableVariantProps } from "@styled/recipes";
import { Button } from "../Button/Button";
import { Checkbox } from "../Checkbox/Checkbox";
import { Pagination, type PaginationProps } from "../Pagination/Pagination";
import { Spinner } from "../Spinner/Spinner";
import {
  CaretSortIcon,
  CaretDownIcon,
  CaretUpIcon,
} from "@radix-ui/react-icons";

export interface DataItem {
  /** A unique identifier for the data item.
   */
  id: string;
  /** A key-value pair representing the data to display in the table.
   */
  [key: string]: React.ReactNode;
}

export type TableSortDirection = "ascend" | "descend" | undefined;

export interface IColumn {
  /** A string representing the title of the column.
   */
  title: string;

  /** A string representing the key of the data item to display in the column.
   */
  dataIndex: string;

  /** *(optional)*
   * A callback function that renders the content of the column. Receives the data, row, and index as arguments.
   */
  render?: (
    /** The data to display in the column.
     */
    data: React.ReactNode,
    /** The data item to display in the row.
     */
    row: DataItem,
    /** The index of the row in the table.
     */
    index: number,
  ) => React.ReactNode;

  /** *(optional)*
   * A callback function triggered when the column is sorted. Receives the sort direction as an argument.
   */
  onSort?: (direction?: TableSortDirection) => void;

  /** *(optional)*
   * A string representing the initial sort direction of the column. Options: 'ascend', 'descend' or undefined.
   */
  sortDirection?: TableSortDirection;

  /** *(optional)* An object containing three custom icons for sort states. */
  sortIcons?: {
    /** An icon to display when the column is sorted in ascending order.
     */
    ascendIcon?: React.ReactNode;
    /** An icon to display when the column is sorted in descending order.
     */
    descendIcon?: React.ReactNode;
    /** An icon to display when the column is sorted in undefined order.
     */
    undefinedIcon?: React.ReactNode;
  };
}

export type TableProps = TableVariantProps & {
  /** An array of strings representing the column names of the table.
   * @default []
   */
  columns: IColumn[];

  /** An array of objects containing the data to display in the table.
   * @default []
   */
  data: DataItem[];

  /** *(optional)*
   * The total number of items the table represents, primarily used for pagination.
   */
  numberOfItems?: number;

  /** *(optional)*
   * If true, applies alternating styles to the rows of the table (striped).
   * @default false
   */
  striped?: boolean;

  /**
   * If true, shows a border-bottom on each row. If false, hides it.
   * @default true
   */
  bottomBorders?: boolean;

  /** *(optional)*
   * If true, displays side borders on the table.
   * @default false
   */
  sideBorders?: boolean;

  /** *(optional)*
   * If true, displays pagination controls below the table.
   * @default false
   */
  showPagination?: boolean;

  /** *(optional)*
   * Specifies the number of rows displayed per page.
   */
  rowsPerPage?: number;

  /** *(optional)*
   * A partial object of PaginationProps for configuring the pagination behavior.
   */
  paginationProps?: Partial<PaginationProps>;

  /** *(optional)*
   * A callback function triggered when the current page changes. Receives the new page number as an argument.
   */
  onPageChange?: (newPage: number) => void;

  /** *(optional)*
   * If true, indicates that the table is loading data and display a loading indicator.
   * @default false
   */
  isLoading?: boolean;

  /** *(optional)*
   * If true, adds a checkbox column for row selection.
   * @default false
   */
  checkable?: boolean;

  /** *(optional)*
   * Callback fired when row selection changes.
   */
  onSelectionChange?: (selectedRows: DataItem[]) => void;

  /** *(optional)*
   * Array of row IDs to pre-selezionare all'inizializzazione della tabella
   * e quando questo prop cambia
   */
  selectedRows?: string[];

  /** *(optional)*
   * Visually hidden caption that gives the table an accessible name.
   */
  caption?: string;

  /** *(optional)*
   * Function that builds the accessible label of a column's sort button.
   * @default (columnTitle) => `Sort by ${columnTitle}`
   */
  sortLabel?: (columnTitle: string) => string;

  /** *(optional)*
   * Accessible label of the "select all rows" checkbox.
   * @default "Select all rows"
   */
  selectAllLabel?: string;

  /** *(optional)*
   * Function that builds the accessible label of a row's selection checkbox.
   * @default (row, index) => `Select row ${index + 1}`
   */
  selectRowLabel?: (row: DataItem, index: number) => string;
};

const ARIA_SORT: Record<
  NonNullable<TableSortDirection>,
  "ascending" | "descending"
> = {
  ascend: "ascending",
  descend: "descending",
};

// Module-level defaults: inline arrow defaults would be new functions on every render.
const defaultSortLabel = (columnTitle: string) => `Sort by ${columnTitle}`;
const defaultSelectRowLabel = (_row: DataItem, index: number) =>
  `Select row ${index + 1}`;

/**
 * A table displays rows of data.
 *
 * @param columns - An array of objects containing the data to display in the columns of the table.
 * @param data - An array of objects containing the data to display in the table.
 * @param numberOfItems - *(optional)* The total number of items the table represents, primarily used for pagination.
 * @param striped - *(optional)* If true, applies alternating styles to the rows of the table (striped).
 * @param sideBorders - *(optional)* If true, displays side borders on the table.
 * @param bottomBorders - *(optional)* If true, shows a border-bottom on each row. If false, hides it.
 * @param showPagination - *(optional)* If true, displays pagination controls below the table.
 * @param rowsPerPage - *(optional)* Specifies the number of rows displayed per page.
 * @param paginationProps - *(optional)* A partial object of PaginationProps for configuring the pagination behavior.
 * @param onPageChange - *(optional)* A callback function triggered when the current page changes. Receives the new page number as an argument.
 * @param isLoading - *(optional)* If true, indicates that the table is loading data and display a loading indicator.
 * @param paginationPosition - *(optional)* The position of the pagination. Options: 'bottom-left', 'bottom-right', 'bottom', 'top-left', 'top-right', 'top'.
 * @param variant - *(optional)* The visual style variant. Options: 'primary', 'secondary'.
 * @param checkable - *(optional)* If true, adds a checkbox column to allow row selection.
 * @param onSelectionChange - *(optional)* Callback fired when row selection changes, provides array of selected row data.
 * @param selectedRows - *(optional)* Array of row IDs to pre-selezionare when the table renders or when this prop changes.
 * @param caption - *(optional)* Visually hidden caption that gives the table an accessible name.
 * @param sortLabel - *(optional)* Function that builds the accessible label of a column's sort button.
 * @param selectAllLabel - *(optional)* Accessible label of the "select all rows" checkbox.
 * @param selectRowLabel - *(optional)* Function that builds the accessible label of a row's selection checkbox.
 */

export const Table: React.FC<TableProps> = ({
  columns,
  data,
  numberOfItems,
  showPagination,
  rowsPerPage,
  paginationProps,
  isLoading,
  paginationPosition,
  variant,
  striped,
  sideBorders,
  bottomBorders = true,
  onPageChange,
  checkable = false,
  onSelectionChange,
  selectedRows = [],
  caption,
  sortLabel = defaultSortLabel,
  selectAllLabel = "Select all rows",
  selectRowLabel = defaultSelectRowLabel,
  ...props
}) => {
  const classes = table({
    paginationPosition,
    variant,
    striped,
    sideBorders,
    bottomBorders,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [sortDirections, setSortDirections] = useState<
    Record<string, TableSortDirection>
  >({});

  const [selectedRowIds, setSelectedRowIds] = useState<string[]>(selectedRows);
  const [prevSelectedRows, setPrevSelectedRows] = useState(selectedRows);

  const rowsChanged =
    prevSelectedRows.length !== selectedRows.length ||
    prevSelectedRows.some((v, i) => v !== selectedRows[i]);

  // Update state during render when selectedRows prop changes
  if (selectedRows && rowsChanged) {
    setPrevSelectedRows(selectedRows);
    setSelectedRowIds(selectedRows);
  }

  const handleSort = useCallback((column: IColumn) => {
    setSortDirections((prev) => {
      const newDirections: Record<string, TableSortDirection> = {};

      Object.keys(prev).forEach((key) => {
        newDirections[key] = undefined;
      });

      const currentDirection = prev[column.dataIndex];
      let newDirection: TableSortDirection;

      if (currentDirection === undefined) {
        newDirection = "ascend";
      } else if (currentDirection === "ascend") {
        newDirection = "descend";
      } else {
        newDirection = "ascend";
      }

      newDirections[column.dataIndex] = newDirection;

      setTimeout(() => {
        column.onSort?.(newDirection);
      }, 0);

      return newDirections;
    });
  }, []);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    onPageChange?.(newPage);
  };

  const handleRowSelect = (rowId: string) => {
    setSelectedRowIds((prev) => {
      const isSelected = prev.includes(rowId);
      const newSelection = isSelected
        ? prev.filter((id) => id !== rowId)
        : [...prev, rowId];

      if (onSelectionChange) {
        const selectedItems = data.filter((item) =>
          newSelection.includes(item.id),
        );
        onSelectionChange(selectedItems);
      }

      return newSelection;
    });
  };

  const handleSelectAll = () => {
    const paginatedIds = paginatedData.map((row) => row.id);
    const areAllCurrentPageSelected =
      paginatedIds.length > 0 &&
      paginatedIds.every((id) => selectedRowIds.includes(id));

    setSelectedRowIds((prev) => {
      let newSelection;

      if (areAllCurrentPageSelected) {
        newSelection = prev.filter((id) => !paginatedIds.includes(id));
      } else {
        const currentSelected = new Set(prev);
        paginatedIds.forEach((id) => currentSelected.add(id));
        newSelection = Array.from(currentSelected);
      }

      if (onSelectionChange) {
        const selectedItems = data.filter((item) =>
          newSelection.includes(item.id),
        );
        onSelectionChange(selectedItems);
      }

      return newSelection;
    });
  };

  const getColorFromVariant = (variant: TableProps["variant"]) => {
    if (variant === "primary") {
      return "outline";
    } else {
      return "neutral";
    }
  };

  const renderPagination = () => {
    return (
      <div data-testid="table-pagination" className={`${classes.pagination}`}>
        <Pagination
          totalItems={numberOfItems ?? data.length}
          itemsPerPage={rowsPerPage ?? data.length}
          onPageChange={handlePageChange}
          showPrevNext={true}
          variant={getColorFromVariant(variant ?? "primary")}
          {...paginationProps}
        />
      </div>
    );
  };

  // eslint-disable-next-line react-hooks/preserve-manual-memoization -- Manual memoization needed for pagination performance
  const paginatedData = useMemo(() => {
    if (showPagination && rowsPerPage && data.length > rowsPerPage) {
      return data.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage,
      );
    }
    return data;
  }, [showPagination, rowsPerPage, data, currentPage]);

  const areAllRowsSelected = useMemo(
    () =>
      paginatedData.length > 0 &&
      paginatedData.every((row) => selectedRowIds.includes(row.id)),
    [paginatedData, selectedRowIds],
  );

  if (isLoading) {
    return <Spinner data-testid="table-loading" />;
  }

  const getSortIcon = (
    column: IColumn,
    direction?: TableSortDirection,
  ): React.ReactNode => {
    if (column.sortIcons) {
      const { ascendIcon, descendIcon, undefinedIcon } = column.sortIcons;

      let icon: React.ReactNode;

      if (direction === "ascend") {
        icon = ascendIcon;
      } else if (direction === "descend") {
        icon = descendIcon;
      } else {
        icon = undefinedIcon;
      }

      return icon;
    }

    if (direction === "ascend") {
      return <CaretDownIcon />;
    } else if (direction === "descend") {
      return <CaretUpIcon />;
    } else {
      return <CaretSortIcon />;
    }
  };

  return (
    <div className={classes.root} {...props}>
      {showPagination &&
        paginationPosition !== undefined &&
        paginationPosition?.startsWith("top") &&
        renderPagination()}
      <div className={classes.tableContainer}>
        <table className={classes.table}>
          {caption && <caption className={classes.caption}>{caption}</caption>}
          <thead>
            <tr className={classes.row}>
              {checkable && (
                <th scope="col" className={classes.header}>
                  <Checkbox
                    squareIcon
                    variant="white"
                    checked={areAllRowsSelected}
                    onCheckedChange={handleSelectAll}
                    size="sm"
                    aria-label={selectAllLabel}
                    data-testid="select-all-checkbox"
                  />
                </th>
              )}
              {columns.map((column) => {
                const direction = sortDirections[column.dataIndex];
                const isSortable = Boolean(column.onSort);

                return (
                  <th
                    key={column.dataIndex}
                    scope="col"
                    className={classes.header}
                    aria-sort={
                      isSortable && direction ? ARIA_SORT[direction] : undefined
                    }
                  >
                    <div className="header-content">
                      {column.title}
                      {isSortable && (
                        <Button
                          variant="transparent"
                          compact
                          layout="vertical"
                          onClick={() => handleSort(column)}
                          aria-label={sortLabel(column.title)}
                          data-testid="sort-icon"
                        >
                          <div className={classes.sortIcons} aria-hidden>
                            {getSortIcon(column, direction)}
                          </div>
                        </Button>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, rowIndex) => (
              <tr key={row.id} className={classes.row}>
                {checkable && (
                  <td className={classes.cell} style={{ padding: "0.75rem" }}>
                    <Checkbox
                      squareIcon
                      variant="white"
                      checked={selectedRowIds.includes(row.id)}
                      onCheckedChange={() => handleRowSelect(row.id)}
                      size="sm"
                      aria-label={selectRowLabel(row, rowIndex)}
                      data-testid={`select-row-${row.id}`}
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column.dataIndex} className={classes.cell}>
                    {column.render
                      ? column.render(row[column.dataIndex], row, rowIndex)
                      : row[column.dataIndex]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPagination &&
        paginationPosition !== undefined &&
        !paginationPosition.startsWith("top") &&
        renderPagination()}
    </div>
  );
};
