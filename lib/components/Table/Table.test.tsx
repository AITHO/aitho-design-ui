import type { ReactNode } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { DataItem, IColumn, Table, TableProps } from "./Table";

const columns: IColumn[] = [
  { title: "Name", dataIndex: "name" },
  { title: "Age", dataIndex: "age" },
];
const data: DataItem[] = [
  { id: "1", name: "John", age: "30" },
  { id: "2", name: "Jane", age: "25" },
  { id: "3", name: "Doe", age: "40" },
  { id: "4", name: "Smith", age: "35" },
  { id: "5", name: "Brown", age: "45" },
  { id: "6", name: "Wilson", age: "50" },
];

const renderTable = (props?: Partial<TableProps>) =>
  render(<Table columns={columns} data={data} numberOfItems={6} {...props} />);

const onPageChangeMock = vi.fn();
const onSortMock = vi.fn();
const onSelectionChangeMock = vi.fn();
const customAscendIcon = <span data-testid="ascend-icon">Ascend</span>;
const customDescendIcon = <span data-testid="descend-icon">Descend</span>;
const customUndefinedIcon = <span data-testid="undefined-icon">Undefined</span>;
const customRenderMock = vi.fn(
  (cellData: ReactNode, row: DataItem, index: number) => (
    <span data-testid={`custom-render-${row.id}`}>
      {cellData}
      {` (Row ${index + 1})`}
    </span>
  ),
);
const sortableColumns: IColumn[] = [
  {
    title: "Name",
    dataIndex: "name",
    onSort: onSortMock,
    sortDirection: "ascend",
  },
];
const customSortableColumns: IColumn[] = [
  {
    title: "Name",
    dataIndex: "name",
    sortIcons: {
      ascendIcon: customAscendIcon,
      descendIcon: customDescendIcon,
      undefinedIcon: customUndefinedIcon,
    },
    onSort: vi.fn(),
  },
];
const customColumns: IColumn[] = [
  {
    title: "Name",
    dataIndex: "name",
    render: customRenderMock,
  },
  { title: "Age", dataIndex: "age" },
];

describe("Table", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the table headers and rows", () => {
    renderTable({ rowsPerPage: 6 });

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Age")).toBeInTheDocument();
    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("Wilson")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
  });

  it.each([["top"], ["bottom"]] as const)(
    "should render pagination in the correct position for %s",
    (position) => {
      renderTable({
        showPagination: true,
        paginationPosition: position,
      });

      const pagination = screen.getByTestId("table-pagination");

      expect(pagination.className).toContain(
        `aitho-table__pagination--paginationPosition_${position}`,
      );
    },
  );

  it("should change page rows and call onPageChange", () => {
    renderTable({
      rowsPerPage: 3,
      showPagination: true,
      paginationPosition: "bottom",
      onPageChange: onPageChangeMock,
    });

    expect(screen.getByText("John")).toBeInTheDocument();
    expect(screen.getByText("Jane")).toBeInTheDocument();
    expect(screen.getByText("Doe")).toBeInTheDocument();

    expect(screen.queryByText("Smith")).not.toBeInTheDocument();
    expect(screen.queryByText("Brown")).not.toBeInTheDocument();
    expect(screen.queryByText("Wilson")).not.toBeInTheDocument();

    const nextPageButton = screen.getByText(2);
    fireEvent.click(nextPageButton);

    expect(onPageChangeMock).toHaveBeenCalledWith(2);
    expect(screen.getByText("Smith")).toBeInTheDocument();
    expect(screen.getByText("Brown")).toBeInTheDocument();
    expect(screen.getByText("Wilson")).toBeInTheDocument();

    expect(screen.queryByText("John")).not.toBeInTheDocument();
    expect(screen.queryByText("Jane")).not.toBeInTheDocument();
    expect(screen.queryByText("Doe")).not.toBeInTheDocument();
  });

  it("should show a loading spinner when isLoading is true", () => {
    renderTable({ isLoading: true });

    expect(screen.getAllByTestId("table-loading")[0]).toBeInTheDocument();
  });

  it("should render custom content and pass row data to column render functions", () => {
    renderTable({ columns: customColumns });

    expect(screen.getByTestId("custom-render-1")).toHaveTextContent(
      "John (Row 1)",
    );
    expect(screen.getByTestId("custom-render-6")).toHaveTextContent(
      "Wilson (Row 6)",
    );
    expect(customRenderMock).toHaveBeenCalledTimes(data.length);
    expect(customRenderMock).toHaveBeenNthCalledWith(
      1,
      data[0].name,
      data[0],
      0,
    );
    expect(customRenderMock).toHaveBeenNthCalledWith(
      data.length,
      data[5].name,
      data[5],
      5,
    );
  });

  it("should use the secondary pagination variant when variant is not primary", () => {
    renderTable({
      showPagination: true,
      paginationPosition: "bottom",
      variant: "secondary",
    });

    const pagination = screen.getByTestId("table-pagination");
    expect(pagination.className).toContain(
      "aitho-table__pagination--variant_secondary",
    );
  });

  it("should call onSort with the correct direction when sorting is triggered", async () => {
    renderTable({ columns: sortableColumns });

    const sortButton = screen.getByTestId("sort-icon");
    expect(sortButton).toBeInTheDocument();

    fireEvent.click(sortButton);
    await waitFor(() => {
      expect(onSortMock).toHaveBeenCalledWith("ascend");
    });
    fireEvent.click(sortButton);
    await waitFor(() => {
      expect(onSortMock).toHaveBeenCalledWith("descend");
    });

    fireEvent.click(sortButton);
    await waitFor(() => {
      expect(onSortMock).toHaveBeenCalledWith("ascend");
    });
  });

  it("should render the correct custom icons based on the sort direction", () => {
    renderTable({ columns: customSortableColumns });

    const sortButton = screen.getByTestId("sort-icon");
    expect(sortButton).toBeInTheDocument();

    expect(screen.getByTestId("undefined-icon")).toBeInTheDocument();

    fireEvent.click(sortButton);
    expect(screen.getByTestId("ascend-icon")).toBeInTheDocument();

    fireEvent.click(sortButton);
    expect(screen.getByTestId("descend-icon")).toBeInTheDocument();

    fireEvent.click(sortButton);
    expect(screen.getByTestId("ascend-icon")).toBeInTheDocument();
  });

  it("should select and deselect all visible rows", () => {
    renderTable({ checkable: true, onSelectionChange: onSelectionChangeMock });

    const selectAllCheckbox = screen.getByTestId("select-all-checkbox");
    fireEvent.click(selectAllCheckbox);

    expect(onSelectionChangeMock).toHaveBeenCalledWith(data);

    fireEvent.click(selectAllCheckbox);

    expect(onSelectionChangeMock).toHaveBeenCalledWith([]);
  });

  it("should handle individual row selection and deselection", () => {
    renderTable({ checkable: true, onSelectionChange: onSelectionChangeMock });

    const firstRowCheckbox = screen.getByTestId("select-row-1");
    fireEvent.click(firstRowCheckbox);

    expect(onSelectionChangeMock.mock.calls[0][0]).toEqual([data[0]]);

    fireEvent.click(firstRowCheckbox);
    expect(onSelectionChangeMock.mock.calls[1][0]).toEqual([]);

    fireEvent.click(firstRowCheckbox);
    expect(onSelectionChangeMock.mock.calls[2][0]).toEqual([data[0]]);

    const secondRowCheckbox = screen.getByTestId("select-row-2");
    fireEvent.click(secondRowCheckbox);

    const latestCallIndex = onSelectionChangeMock.mock.calls.length - 1;
    expect(onSelectionChangeMock.mock.calls[latestCallIndex][0]).toEqual([
      data[0],
      data[1],
    ]);
  });

  it("should deselect only current page rows when unchecking select-all with mixed selection", () => {
    const pageSize = 3;
    const mixedSelection = ["1", "2", "3", "4"];
    const expectedRemainingItem = data.find((item) => item.id === "4");

    renderTable({
      checkable: true,
      rowsPerPage: pageSize,
      showPagination: true,
      selectedRows: mixedSelection,
      onSelectionChange: onSelectionChangeMock,
    });

    const selectAllCheckbox = screen.getByTestId("select-all-checkbox");
    expect(selectAllCheckbox).toBeChecked();

    fireEvent.click(selectAllCheckbox);

    expect(onSelectionChangeMock).toHaveBeenCalledWith(
      expect.arrayContaining([expectedRemainingItem]),
    );

    const resultSelection = onSelectionChangeMock.mock.calls[0][0];
    const resultIds = resultSelection.map((item: DataItem) => item.id);
    expect(resultIds).not.toContain("1");
    expect(resultIds).not.toContain("2");
    expect(resultIds).not.toContain("3");
    expect(resultIds).toContain("4");
  });

  it("should update internal selection when selectedRows prop changes", () => {
    const { rerender } = renderTable({ checkable: true, selectedRows: ["1"] });

    expect(screen.getByTestId("select-row-1")).toBeChecked();
    expect(screen.getByTestId("select-row-2")).not.toBeChecked();
    expect(screen.getByTestId("select-row-3")).not.toBeChecked();

    rerender(
      <Table
        columns={columns}
        data={data}
        checkable
        selectedRows={["2", "3"]}
        numberOfItems={6}
      />,
    );

    expect(screen.getByTestId("select-row-1")).not.toBeChecked();
    expect(screen.getByTestId("select-row-2")).toBeChecked();
    expect(screen.getByTestId("select-row-3")).toBeChecked();
  });

  it("should default to data.length for totalItems when numberOfItems is not passed", () => {
    render(
      <Table
        columns={columns}
        data={data}
        rowsPerPage={2}
        showPagination={true}
        paginationPosition="bottom"
      />,
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.queryByText("4")).toBeNull();
  });

  describe("accessibility", () => {
    it("should scope the header cells to their column", () => {
      renderTable({ checkable: true });

      screen
        .getAllByRole("columnheader")
        .forEach((header) => expect(header).toHaveAttribute("scope", "col"));
    });

    it("should name the table through the caption when provided", () => {
      renderTable({ caption: "Employees" });

      expect(
        screen.getByRole("table", { name: "Employees" }),
      ).toBeInTheDocument();
    });

    it("should give the sort button an accessible name", () => {
      renderTable({ columns: sortableColumns });

      expect(screen.getByTestId("sort-icon")).toHaveAccessibleName(
        "Sort by Name",
      );
    });

    it("should use the custom sort label when provided", () => {
      renderTable({
        columns: sortableColumns,
        sortLabel: (title) => `Ordina per ${title}`,
      });

      expect(screen.getByTestId("sort-icon")).toHaveAccessibleName(
        "Ordina per Name",
      );
    });

    it("should expose the sort direction with aria-sort", () => {
      renderTable({ columns: sortableColumns });

      const header = screen.getByRole("columnheader");
      expect(header).not.toHaveAttribute("aria-sort");

      fireEvent.click(screen.getByTestId("sort-icon"));
      expect(header).toHaveAttribute("aria-sort", "ascending");

      fireEvent.click(screen.getByTestId("sort-icon"));
      expect(header).toHaveAttribute("aria-sort", "descending");
    });

    it("should give the selection checkboxes an accessible name", () => {
      renderTable({ checkable: true });

      expect(screen.getByTestId("select-all-checkbox")).toHaveAccessibleName(
        "Select all rows",
      );
      expect(screen.getByTestId("select-row-1")).toHaveAccessibleName(
        "Select row 1",
      );
    });

    it("should use the custom selection labels when provided", () => {
      renderTable({
        checkable: true,
        selectAllLabel: "Seleziona tutte le righe",
        selectRowLabel: (row) => `Seleziona ${row.name}`,
      });

      expect(screen.getByTestId("select-all-checkbox")).toHaveAccessibleName(
        "Seleziona tutte le righe",
      );
      expect(screen.getByTestId("select-row-1")).toHaveAccessibleName(
        "Seleziona John",
      );
    });
  });
});
