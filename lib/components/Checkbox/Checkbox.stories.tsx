import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./Checkbox";
import { Label } from "lib/main";
import {
  argTypeDisabled,
  argTypeRequired,
  argTypeSize,
  argTypeVariant,
  BORDER_STYLE,
  SIZES_WITH_XL,
  VARIANTS_WITH_WHITE,
} from "lib/utils/constants";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A control that allows the user to toggle between checked and not checked.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: argTypeSize(SIZES_WITH_XL, "sm"),
    variant: argTypeVariant(VARIANTS_WITH_WHITE, "primary"),
    border: {
      control: "select",
      options: BORDER_STYLE,
      description: "The border of the checkbox.",
      table: {
        defaultValue: { summary: "solid" },
        type: { summary: "solid | dashed | none" },
      },
    },
    defaultChecked: {
      control: "boolean",
      description: "If the checkbox is checked by default.",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    disabled: argTypeDisabled(),
    required: argTypeRequired(),
    squareIcon: {
      control: "boolean",
      description: "If true, displays a square icon instead of a checkmark.",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
  },

  args: {
    size: "sm",
    variant: "primary",
    border: "solid",
    defaultChecked: false,
    disabled: false,
    required: false,
    squareIcon: false,
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
      <Checkbox {...args} id="default" />
      <Label htmlFor="default">Default</Label>
    </div>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
      {VARIANTS_WITH_WHITE.map((arg) => (
        <div
          style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
          key={arg}
        >
          <Checkbox {...args} variant={arg} id={arg} />
          <Label htmlFor={arg}>{arg}</Label>
        </div>
      ))}
    </div>
  ),
};

export const IconVariants: Story = {
  args: {
    variant: "primary",
    defaultChecked: true,
  },
  render: (args) => (
    <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <Checkbox {...args} id="checkmark-icon" />
        <Label htmlFor="checkmark-icon">Default Icon</Label>
      </div>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <Checkbox {...args} squareIcon id="square-icon" />
        <Label htmlFor="square-icon">Square Icon</Label>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
      {SIZES_WITH_XL.map((arg) => (
        <div
          style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
          key={arg}
        >
          <Checkbox {...args} size={arg} id={arg} />
          <Label htmlFor={arg}>{arg}</Label>
        </div>
      ))}
    </div>
  ),
};

export const Borders: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
      {BORDER_STYLE.map((arg) => (
        <div
          style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
          key={arg}
        >
          <Checkbox {...args} border={arg} id={arg} />
          <Label htmlFor={arg}>{arg}</Label>
        </div>
      ))}
    </div>
  ),
};

export const DefaultChecked: Story = {
  args: {
    defaultChecked: true,
  },
  render: (args) => (
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
      <Checkbox {...args} id="dchecked" />
      <Label htmlFor="dchecked">Default checked</Label>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => (
    <div
      style={{
        display: "flex",
        gap: "1.5rem",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <Checkbox {...args} id="disabled-unchecked" />
        <Label htmlFor="disabled-unchecked" disabled>
          Disabled Unchecked
        </Label>
      </div>
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <Checkbox {...args} id="disabled-checked" defaultChecked />
        <Label htmlFor="disabled-checked" disabled>
          Disabled Checked
        </Label>
      </div>
    </div>
  ),
};

export const DisabledVariants: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
  },
  render: (args) => (
    <div
      style={{
        display: "flex",
        gap: "1.5rem",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {VARIANTS_WITH_WHITE.map((variant) => (
        <div
          style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
          key={`disabled-${variant}`}
        >
          <Checkbox {...args} variant={variant} id={`disabled-${variant}`} />
          <Label htmlFor={`disabled-${variant}`} disabled>
            Disabled {variant}
          </Label>
        </div>
      ))}
    </div>
  ),
};

export const DisabledSizes: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
  },
  render: (args) => (
    <div
      style={{
        display: "flex",
        gap: "1.5rem",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {SIZES_WITH_XL.map((size) => (
        <div
          style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
          key={`disabled-${size}`}
        >
          <Checkbox {...args} size={size} id={`disabled-${size}`} />
          <Label htmlFor={`disabled-${size}`} disabled>
            Disabled {size}
          </Label>
        </div>
      ))}
    </div>
  ),
};

export const Required: Story = {
  args: {
    required: true,
  },
  render: (args) => (
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
      <Checkbox {...args} id="required" />
      <Label htmlFor="required" required>
        Required
      </Label>
    </div>
  ),
};
