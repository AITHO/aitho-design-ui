import {
  Table,
  IColumn,
  TableSortDirection,
  TableProps,
  DataItem,
} from "./Table";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "lib/main";
import {
  argTypePosition,
  argTypeVariant,
  POSITIONS_WITH_VERTICAL,
  VARIANTS_SECONDARY,
} from "lib/utils/constants";
import { useCallback, useMemo, useState } from "react";

import {
  DoubleArrowDownIcon,
  DoubleArrowUpIcon,
  DashIcon,
} from "@radix-ui/react-icons";
import { nanoid } from "nanoid";

const sortIcons = {
  ascendIcon: <DoubleArrowUpIcon />,
  descendIcon: <DoubleArrowDownIcon />,
  undefinedIcon: <DashIcon />,
};

const roles = ["Admin", "User", "Editor", "Manager", "Developer", "Designer"];

const generateData = (count: number) =>
  Array.from({ length: count }, (_, index) => ({
    id: nanoid(),
    name: `Person ${index}`,
    email: `person${index}@example.com`,
    role: roles[index % roles.length],
    lastLogin: "Today",
    skills: "React, TypeScript, Node.js",
  }));

const baseColumns: (
  onSort?: (direction: TableSortDirection) => void,
  sortDirection?: TableSortDirection,
) => IColumn[] = (onSort, sortDirection) => [
  {
    title: "Name",
    dataIndex: "name",
    onSort: onSort,
    sortDirection: sortDirection,
  },
  { title: "Email", dataIndex: "email", onSort: onSort, sortIcons: sortIcons },
  { title: "Role", dataIndex: "role" },
  { title: "Last Login", dataIndex: "lastLogin" },
  { title: "Skills", dataIndex: "skills" },
  {
    title: "Actions",
    dataIndex: "actions",
    render: (_, row) => (
      <>
        <Button
          size="xs"
          onClick={() => alert(`Editing user with ID: ${row.id}`)}
        >
          Edit
        </Button>
        <span style={{ margin: "0 5px" }}></span>
        <Button
          size="xs"
          onClick={() => alert(`Deleting user with ID: ${row.id}`)}
        >
          Delete
        </Button>
      </>
    ),
  },
];

const TableWithSortedData: React.FC<TableProps> = (props) => {
  const [sortDirection, setSortDirection] =
    useState<TableSortDirection>("ascend");
  const [sortedData, setSortedData] = useState(generateData(10));

  const handleSort = useCallback((direction: TableSortDirection) => {
    setSortDirection(direction);
    setSortedData((prevData) => {
      return [...prevData].sort((a, b) => {
        if (direction === "ascend") return a.name.localeCompare(b.name);
        if (direction === "descend") return b.name.localeCompare(a.name);
        return 0;
      });
    });
  }, []);

  const columns = useMemo(
    () => baseColumns(handleSort, sortDirection),
    [handleSort, sortDirection],
  );

  return <Table {...props} data={sortedData} columns={columns} />;
};

const data = generateData(10);

const meta = {
  title: "Components/Table",
  component: Table,
  parameters: {
    layout: "centered",
    docs: { description: { component: "A table displays rows of data." } },
  },
  tags: ["autodocs"],
  argTypes: {
    data: {
      description: "The data to display.",
      table: { type: { summary: "Array" }, defaultValue: { summary: "[]" } },
    },
    columns: {
      description:
        "An array of header entries used to populate the table headers.",
      table: { type: { summary: "Array" }, defaultValue: { summary: "[]" } },
    },
    variant: argTypeVariant(VARIANTS_SECONDARY, "primary"),
    striped: {
      control: "boolean",
      description: "Enable striped rows.",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    sideBorders: {
      control: "boolean",
      description: "Enable side borders.",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    bottomBorders: {
      control: "boolean",
      description: "Enable bottom borders.",
      table: {
        defaultValue: { summary: "true" },
        type: { summary: "boolean" },
      },
    },
    showPagination: {
      control: "boolean",
      description: "Show or hide the pagination.",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    rowsPerPage: {
      control: "number",
      description: "The number of rows per page.",
    },
    paginationProps: {
      control: "object",
      description:
        "A partial object of PaginationProps for configuring the pagination behavior.",
      table: { type: { summary: "Partial<PaginationProps>" } },
    },
    onPageChange: {
      description:
        "A callback function triggered when the current page changes. Receives the new page number as an argument.",
    },
    isLoading: {
      control: "boolean",
      description:
        "If true, indicates that the table is loading data and display a loading indicator.",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    paginationPosition: argTypePosition(POSITIONS_WITH_VERTICAL, "bottom"),
    numberOfItems: {
      control: "number",
      description: "The total number of items.",
    },
    checkable: {
      control: "boolean",
      description:
        "If true, enables checkbox selection for each row in the table.",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    onSelectionChange: {
      description:
        "A callback function triggered when the selected rows change. Receives the selected rows as an argument.",
    },
    selectedRows: {
      control: { type: "object" },
      description:
        "An array of selected row IDs. Used to manage the selected state of rows.",
    },
  },
  args: {
    variant: "primary",
    striped: false,
    sideBorders: false,
    bottomBorders: true,
    showPagination: false,
    isLoading: false,
    paginationPosition: "bottom",
    columns: baseColumns(),
    data: data,
    numberOfItems: 6,
    rowsPerPage: 3,
    checkable: false,
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { showPagination: true, rowsPerPage: 3 },
  render: (args) => {
    if (args.checkable) {
      return <CheckableTable {...args} />;
    }

    return <Table {...args} />;
  },
};

export const WithoutPagination: Story = {
  args: { data: data.slice(0, 3) },
  render: (args) => <Table {...args} />,
};

export const WithSortAndCustomIcons: Story = {
  args: { showPagination: true, rowsPerPage: 3 },
  render: (args) => <TableWithSortedData {...args} />,
};

export const VariantsWithoutStripedRows: Story = {
  args: { data: data.slice(0, 3) },
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {VARIANTS_SECONDARY.map((arg) => (
        <Table {...args} key={arg} variant={arg} />
      ))}
    </div>
  ),
};

export const VariantsWithStripedRows: Story = {
  args: { data: data.slice(0, 3), striped: true },
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {VARIANTS_SECONDARY.map((arg) => (
        <Table {...args} key={arg} variant={arg} />
      ))}
    </div>
  ),
};

const CheckableTable: React.FC<TableProps> = (args) => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const handleSelectionChange = (selected: DataItem[]) => {
    const selectedIds = selected.map((item) => item.id);
    setSelectedRows(selectedIds);
  };

  return (
    <Table
      {...args}
      selectedRows={selectedRows}
      onSelectionChange={handleSelectionChange}
    />
  );
};

export const WithCheckboxSelection: Story = {
  args: {
    data: data.slice(0, 6),
    checkable: true,
    showPagination: true,
    rowsPerPage: 3,
  },
  render: (args) => <CheckableTable {...args} />,
};

export const VariantWithSideBorders: Story = {
  args: { data: data.slice(0, 3), sideBorders: true },
  render: (args) => <Table {...args} />,
};

export const VariantWithoutBottomBorders: Story = {
  args: { data: data.slice(0, 3), bottomBorders: false },
  render: (args) => <Table {...args} />,
};

export const PaginationPosition: Story = {
  args: { showPagination: true, rowsPerPage: 3 },
  render: (args) => (
    <div style={{ display: "flex", gap: "2rem", flexDirection: "column" }}>
      {POSITIONS_WITH_VERTICAL.map((arg) => (
        <div
          key={arg}
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Table {...args} key={arg} paginationPosition={arg} />
        </div>
      ))}
    </div>
  ),
};
