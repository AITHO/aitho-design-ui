import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { FilterChipBar, FilterChip } from "./FilterChipBar";

const meta = {
  title: "Components/FilterChipBar",
  component: FilterChipBar,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Horizontally scrollable filter row: a Filters pill with an active count badge plus one removable chip per applied filter.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    filters: {
      control: "object",
      description: "Currently applied filters, rendered as removable chips.",
      table: { type: { summary: "FilterChip[]" } },
    },
    onOpenFilters: {
      description: "Function called when the Filters pill is clicked.",
      table: { type: { summary: "() => void" } },
    },
    filtersLabel: {
      control: "text",
      description: "Label of the Filters pill.",
      table: { defaultValue: { summary: "Filters" } },
    },
    removeFilterLabel: {
      description:
        "Function that builds the accessible label of a chip's remove button.",
      table: {
        type: { summary: "(label: string) => string" },
        defaultValue: { summary: "(label) => `Remove filter ${label}`" },
      },
    },
  },
  args: {
    filters: [],
    onOpenFilters: () => undefined,
  },
} satisfies Meta<typeof FilterChipBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [filters, setFilters] = useState<FilterChip[]>([
      { key: "status", label: "Status: Open", onRemove: () => undefined },
      { key: "year", label: "Year: 2026", onRemove: () => undefined },
      { key: "customer", label: "Customer: ACME", onRemove: () => undefined },
    ]);

    return (
      <div style={{ maxWidth: "20rem" }}>
        <FilterChipBar
          {...args}
          filters={filters.map((filter) => ({
            ...filter,
            onRemove: () =>
              setFilters((prev) => prev.filter((f) => f.key !== filter.key)),
          }))}
        />
      </div>
    );
  },
};

export const Empty: Story = {
  args: { filters: [] },
};
