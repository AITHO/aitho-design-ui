import { argTypeDisabled, argTypeSize, BASE_SIZES } from "lib/utils/constants";
import { Label } from "../Label/Label";
import { ToggleSwitch } from "./ToggleSwitch";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Components/ToggleSwitch",
  component: ToggleSwitch,
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
    size: argTypeSize(BASE_SIZES, "sm"),
    defaultChecked: {
      control: "boolean",
      description: "If the toggleSwitch is checked by default.",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    disabled: argTypeDisabled(),
  },
  args: {
    size: "sm",
    defaultChecked: false,
    disabled: false,
  },
} satisfies Meta<typeof ToggleSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
      <ToggleSwitch {...args} id="default" />
      <Label htmlFor="default">Default</Label>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
      {BASE_SIZES.map((arg) => (
        <div
          style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
          key={arg}
        >
          <ToggleSwitch {...args} size={arg} id={arg} />
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
      <ToggleSwitch {...args} id="dchecked" />
      <Label htmlFor="dchecked">Default checked</Label>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  render: (args) => (
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
      <ToggleSwitch {...args} id="disabled" />
      <Label htmlFor="disabled" disabled>
        Disabled
      </Label>
    </div>
  ),
};
