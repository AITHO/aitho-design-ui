import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select } from "./Select";
import {
  argTypeBorderColors,
  argTypeDisabled,
  argTypeSize,
  argTypeVariant,
  BORDER_COLORS_WITH_ERROR,
  SIZES_WITH_XS,
  VARIANT_PRIMARY,
} from "lib/utils/constants";

const defaultItems = [
  {
    value: "option1",
    textValue: "Option 1",
  },
  {
    value: "option2",
    textValue: "Option 2",
  },
  {
    value: "option3",
    textValue: "Option 3",
  },
];

const meta = {
  title: "Components/Select",
  component: Select,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Displays a list of options for the user to pick from triggered by a button.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ height: "300px", width: "400px" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    items: {
      control: "object",
      description: "List options.",
      table: {
        type: { summary: "SelectItemProps[]" },
      },
    },
    placeholder: {
      control: "text",
      description:
        "The placeholder of the select, if not provided the trigger is empty.",
    },
    optionsShows: {
      control: "number",
      description: "The number of options to show.",
    },
    searchable: {
      control: "boolean",
      description: "If true, you can filter the available options.",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    searchablePlaceholder: {
      control: "text",
      description: "The search bar placeholder.",
    },
    size: argTypeSize(SIZES_WITH_XS, "md"),
    variant: argTypeVariant(VARIANT_PRIMARY, "primary"),
    disabled: argTypeDisabled(),
    borderColor: argTypeBorderColors(BORDER_COLORS_WITH_ERROR),
  },
  args: {
    placeholder: "",
    size: "md",
    variant: "primary",
    borderColor: "base",
    items: defaultItems,
    disabled: false,
    searchable: false,
    searchablePlaceholder: "",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {},
};

export const WithPlaceholder: Story = {
  args: {
    placeholder: "Select an option",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Select an option",
    disabled: true,
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {SIZES_WITH_XS.map((arg) => (
        <Select {...args} key={arg} placeholder={`Size ${arg}`} size={arg} />
      ))}
    </div>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {VARIANT_PRIMARY.map((arg) => (
        <Select
          {...args}
          key={arg}
          placeholder={`Variant ${arg}`}
          variant={arg}
        />
      ))}
    </div>
  ),
};

export const BorderColors: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {BORDER_COLORS_WITH_ERROR.map((arg) => (
        <Select
          {...args}
          key={arg}
          placeholder={`Border color ${arg}`}
          borderColor={arg}
        />
      ))}
    </div>
  ),
};

export const Searchable: Story = {
  args: {
    searchable: true,
    searchablePlaceholder: "Search...",
  },
};
