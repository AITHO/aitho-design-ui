import React from "react";
import { Pagination, PaginationProps } from "./Pagination";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { argTypeVariant, VARIANTS_WITH_NEUTRAL } from "lib/utils/constants";

const meta = {
  title: "Components/Pagination",
  component: Pagination,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Provides ability to change the visible content in a table.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: argTypeVariant(VARIANTS_WITH_NEUTRAL, "primary"),
    page: {
      control: "number",
      description: "The first page opened.",
      table: {
        defaultValue: { summary: "1" },
      },
    },
    itemsPerPage: {
      control: "number",
      description: "The number of items per page.",
      table: {
        defaultValue: { summary: "10" },
      },
    },
    totalItems: {
      control: "number",
      description: "The total number of pages.",
    },
    showFirstLast: {
      control: "boolean",
      description: "Show or hide the first and last page buttons.",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    showPrevNext: {
      control: "boolean",
      description: "Show or hide the previous and next page buttons.",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    showPageNumbers: {
      control: "boolean",
      description: "Show or hide the page numbers.",
      table: {
        defaultValue: { summary: "true" },
        type: { summary: "boolean" },
      },
    },
    maxVisiblePages: {
      control: {
        type: "number",
        min: 3,
        max: 10,
      },
      description: "The maximum number of visible pages.",
      table: {
        defaultValue: { summary: "5" },
      },
    },
    firstButtonContent: {
      control: "object",
      description: "Content for the first page button.",
      table: {
        defaultValue: { summary: "<DoubleArrowLeftIcon height={21} />" },
        type: { summary: "React.ReactNode" },
      },
    },
    lastButtonContent: {
      control: "object",
      description: "Content for the last page button.",
      table: {
        defaultValue: { summary: "<DoubleArrowRightIcon height={21} />" },
        type: { summary: "React.ReactNode" },
      },
    },
    hideNavigationOnDisabled: {
      control: "boolean",
      description: "Show or hide the navigation button.",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    onPageChange: {
      description:
        "A callback function triggered when the current page changes. Receives the new page number as an argument.",
    },
  },
  args: {
    page: 1,
    itemsPerPage: 10,
    totalItems: 50,
    maxVisiblePages: 5,
    variant: "primary",
    showFirstLast: false,
    showPrevNext: false,
    showPageNumbers: true,
    hideNavigationOnDisabled: false,
    firstButtonContent: <DoubleArrowLeftIcon height={21} />,
    lastButtonContent: <DoubleArrowRightIcon height={21} />,
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

const ColorsTemplate = (args: PaginationProps) => {
  const [page, setPage] = React.useState(1);

  return (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {VARIANTS_WITH_NEUTRAL.map((arg) => (
        <Pagination
          {...args}
          key={arg}
          page={page}
          onPageChange={setPage}
          variant={arg}
        />
      ))}
    </div>
  );
};

export const Variants: Story = {
  args: {
    showFirstLast: true,
    showPrevNext: true,
  },
  render: (args) => <ColorsTemplate {...args} />,
};

export const WithNavigationKeys: Story = {
  args: {
    showFirstLast: true,
    showPrevNext: true,
  },
  render: (args) => <Pagination {...args} />,
};

export const WithNavigationKeysHideWhenDisabled: Story = {
  args: {
    showFirstLast: true,
    showPrevNext: true,
    hideNavigationOnDisabled: true,
  },
  render: (args) => <Pagination {...args} />,
};

const OnlyPrevAndNextTemplate = (args: PaginationProps) => {
  const [page, setPage] = React.useState(1);

  return (
    <div>
      <span>Current page: {page}</span>
      <Pagination {...args} page={page} onPageChange={setPage} />
    </div>
  );
};

export const OnlyPrevAndNext: Story = {
  args: {
    showPrevNext: true,
    showPageNumbers: false,
  },
  render: (args) => <OnlyPrevAndNextTemplate {...args} />,
};

export const WithCustomButtons: Story = {
  args: {
    showFirstLast: true,
    firstButtonContent: "To First!",
    lastButtonContent: "To Last!",
  },
};
