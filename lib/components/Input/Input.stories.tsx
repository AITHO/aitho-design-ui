import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input, Label } from "lib/main";
import {
  argTypeBorderColors,
  argTypeBorderRadius,
  argTypeDisabled,
  BORDER_COLORS_WITH_ERROR,
  BORDER_RADIUS_NONE_AND_ROUNDED,
  INPUT_TYPES,
} from "lib/utils/constants";
const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Provides an input bar of the chosen type.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Label text for the input.",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text displayed in the input field.",
    },
    required: {
      control: "boolean",
      description: "Marks the input as required.",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    type: {
      control: "select",
      options: INPUT_TYPES,
      description: "The input field type.",
      table: {
        defaultValue: { summary: "text" },
        type: {
          summary:
            "text | email | password | number | tel | url | search | date | time | datetime-local | range",
        },
      },
    },
    errorMessage: {
      control: "text",
      description: "Error message displayed below the input.",
    },
    error: {
      control: "boolean",
      description: "Indicates whether the input is in an error state.",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    inputSearch: {
      control: "boolean",
      description: "Displays a search icon within the input field.",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    disabled: argTypeDisabled(),
    borderRadius: argTypeBorderRadius(
      BORDER_RADIUS_NONE_AND_ROUNDED,
      "rounded",
    ),
    borderColor: argTypeBorderColors(BORDER_COLORS_WITH_ERROR),
  },
  args: {
    borderRadius: "rounded",
    borderColor: "base",
    error: false,
    inputSearch: false,
    required: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Label",
    type: "text",
    placeholder: "Enter your name",
  },
  render: (args) => <Input {...args} />,
};

export const BorderRadius: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {BORDER_RADIUS_NONE_AND_ROUNDED.map((arg) => (
        <Input {...args} key={arg} borderRadius={arg} label={arg} />
      ))}
    </div>
  ),
};

export const BorderColors: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {BORDER_COLORS_WITH_ERROR.map((arg) => (
        <Input {...args} key={arg} borderColor={arg} label={arg} />
      ))}
    </div>
  ),
};

export const RequiredField: Story = {
  args: {
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
    required: true,
    name: "email",
  },
  render: (args) => (
    <div className="flex flex-col gap-2">
      <Input {...args} />
    </div>
  ),
};

export const WithError: Story = {
  args: {
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    required: true,
    error: true,
    errorMessage: "Password is incorrect",
  },
  render: (args) => (
    <div style={{ display: "flex", gap: "0.5rem", flexDirection: "column" }}>
      <Input {...args} />
    </div>
  ),
};

export const InputTypes: Story = {
  render: (args) => (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        flexDirection: "column",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {INPUT_TYPES.slice(0, -1).map((arg) => (
        <div key={arg}>
          <Label>{arg.charAt(0).toUpperCase() + arg.slice(1)}</Label>
          <Input type={arg} placeholder={`Enter your ${arg}`} {...args} />
        </div>
      ))}
    </div>
  ),
};

export const SearchInput: Story = {
  args: {
    label: "Search",
    type: "search",
    placeholder: "Search here...",
    inputSearch: true,
  },
  render: (args) => <Input type="search" {...args} />,
};
