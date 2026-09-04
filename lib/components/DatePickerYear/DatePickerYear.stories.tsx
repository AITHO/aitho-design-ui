import { DatePickerYear } from "./DatePickerYear";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Components/DatePickerYear",
  component: DatePickerYear,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A component that allows the user to select a year.",
      },
    },
  },
  argTypes: {
    value: {
      control: "number",
      description: "The value of the component",
      table: {
        defaultValue: { summary: "undefined" },
      },
    },
    placeholder: {
      control: "text",
      description: "Placeholder text displayed in the input field.",
      table: {
        defaultValue: { summary: "undefined" },
      },
    },
    min: {
      control: "number",
      description: "Minimum year that can be selected.",
      table: {
        defaultValue: { summary: "undefined" },
      },
    },
    max: {
      control: "number",
      description: "Maximum year that can be selected.",
      table: {
        defaultValue: { summary: "undefined" },
      },
    },
    clearable: {
      control: "boolean",
      description: "Whether the value can be cleared.",
      table: {
        type: { summary: "Boolean" },
        defaultValue: { summary: "false" },
      },
    },
    onChange: {
      action: "changed",
      description:
        "Callback function that is triggered when the input value changes.",
      table: {
        defaultValue: { summary: "undefined" },
      },
    },
  },
  args: {
    placeholder: "Select year",
    min: 2001,
    max: 2025,
    value: undefined,
    clearable: false,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DatePickerYear>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Select year",
    min: 2001,
    max: 2025,
  },
  render: (args) => (
    <div style={{ height: "300px", position: "relative" }}>
      <DatePickerYear {...args} />
    </div>
  ),
};

export const HandledValue: Story = {
  parameters: {
    docs: {
      description: {
        story: "You can change the value passed to the component.",
      },
    },
  },
  render: () => {
    return (
      <div
        style={{
          height: "300px",
          position: "relative",
        }}
      >
        <DatePickerYear value={2020} />
      </div>
    );
  },
};

export const ClearableValue: Story = {
  parameters: {
    docs: {
      description: {
        story: "You can clear the value passed to the component.",
      },
    },
  },
  render: () => {
    return (
      <div
        style={{
          height: "300px",
          position: "relative",
        }}
      >
        <DatePickerYear value={2020} clearable />
      </div>
    );
  },
};
