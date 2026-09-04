import { LANGUAGES } from "lib/utils/constants";
import { DatePickerMonth } from "./DatePickerMonth";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Components/DatePickerMonth",
  component: DatePickerMonth,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A component that allows the user to select a month and year.",
      },
    },
  },
  argTypes: {
    value: {
      control: "text",
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
      control: "text",
      description:
        "Minimum month and year that can be selected, in MM-YYYY format.",
      table: {
        defaultValue: { summary: "undefined" },
      },
    },
    max: {
      control: "text",
      description:
        "Maximum month and year that can be selected, in MM-YYYY format.",
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
    lang: {
      control: "select",
      options: LANGUAGES,
      description: "Language code for localization.",
      table: {
        defaultValue: { summary: "en" },
        type: { summary: "it | en" },
      },
    },
  },
  args: {
    value: undefined,
    placeholder: "Select month and year",
    min: "03-2024",
    max: "03-2030",
    clearable: false,
    lang: "en",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DatePickerMonth>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Select month and year",
    min: "03-2024",
    max: "03-2030",
  },
  render: (args) => (
    <div style={{ height: "300px", position: "relative" }}>
      <DatePickerMonth {...args} />
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
        <DatePickerMonth value="01-2024" />
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
        <DatePickerMonth value="01-2025" clearable />
      </div>
    );
  },
};

export const Languages: Story = {
  render: (args) => (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        flexDirection: "column",
        height: "300px",
      }}
    >
      {LANGUAGES.map((arg) => (
        <DatePickerMonth {...args} key={arg} lang={arg} placeholder={arg} />
      ))}
    </div>
  ),
};
