import { SelectTags, SelectTagsProps } from "./SelectTags";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  argTypeBorderColors,
  argTypeBorderRadius,
  argTypeSize,
  BORDER_COLORS_WITH_ERROR,
  BORDER_RADIUS_NONE_AND_ROUNDED,
  SIZES_WITH_XS,
} from "lib/utils/constants";
import { useState } from "react";

const meta: Meta<typeof SelectTags> = {
  title: "Components/SelectTags",
  component: SelectTags,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Displays a list of options the user can select.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ height: "350px", width: "400px" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    options: {
      control: "object",
      description: "List of available options.",
    },
    value: {
      control: "object",
      description: "List of selected options.",
    },
    placeholder: {
      control: "text",
      description: "Placeholder for the input field.",
    },
    onChange: {
      description: "Handler called when the selected tags change.",
    },
    isSelect: {
      control: "boolean",
      description: "Show only selected options and filter the rest.",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    height: argTypeSize(SIZES_WITH_XS, "md"),
    roundness: argTypeBorderRadius(BORDER_RADIUS_NONE_AND_ROUNDED, "rounded"),
    borderColor: argTypeBorderColors(BORDER_COLORS_WITH_ERROR),
  },
  args: {
    roundness: "rounded",
    height: "md",
    borderColor: "base",
    options: [
      "Option 1",
      "Option 2",
      "Option 3",
      "Option 4",
      "Option 5",
      "Option 6",
      "Option 7",
      "Option 8",
      "Option 9",
      "Option 10",
    ],
  },
} satisfies Meta<typeof SelectTags>;

export default meta;
type Story = StoryObj<typeof meta>;

const SelectTagsWrapper = (
  args: Partial<SelectTagsProps> & {
    options?: string[];
  },
) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(args.value || []);

  const handleChange = (newTags: string[]) => {
    setSelectedTags(newTags);
    args.onChange?.(newTags);
  };

  return (
    <SelectTags
      options={args.options ?? []}
      placeholder="Select options"
      {...args}
      value={selectedTags}
      onChange={handleChange}
      isSelect={args.isSelect}
    />
  );
};

export const Default: Story = {
  args: {
    value: [],
    isSelect: false,
  },
  render: (args) => <SelectTagsWrapper {...args} />,
};

export const WithPlaceholder: Story = {
  args: {
    placeholder: "Select options",
    value: [],
    isSelect: false,
  },
  render: (args) => <SelectTagsWrapper {...args} />,
};

export const Heights: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {SIZES_WITH_XS.map((arg) => (
        <SelectTagsWrapper {...args} key={arg} height={arg} />
      ))}
    </div>
  ),
};

export const Roundness: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {BORDER_RADIUS_NONE_AND_ROUNDED.map((arg) => (
        <SelectTagsWrapper {...args} key={arg} roundness={arg} />
      ))}
    </div>
  ),
};

export const BorderColors: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {BORDER_COLORS_WITH_ERROR.map((arg) => (
        <SelectTagsWrapper {...args} key={arg} borderColor={arg} />
      ))}
    </div>
  ),
};
