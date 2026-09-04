import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { NumberStepper } from "./NumberStepper";
import { argTypeDisabled } from "lib/utils/constants";

const meta = {
  title: "Components/NumberStepper",
  component: NumberStepper,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Touch-friendly numeric input with − / + buttons (44×44px hit targets) and a tap-to-type value. Accepts both comma and dot decimals; commits on blur/Enter.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "number",
      description: "Current numeric value of the stepper.",
    },
    onChange: {
      description: "Function called with the new value when it changes.",
      table: { type: { summary: "(value: number) => void" } },
    },
    min: {
      control: "number",
      description: "Minimum value that can be selected.",
      table: { defaultValue: { summary: "0" } },
    },
    max: {
      control: "number",
      description: "Maximum value that can be selected.",
      table: { defaultValue: { summary: "Number.MAX_SAFE_INTEGER" } },
    },
    step: {
      control: "number",
      description: "Increment applied by the − / + buttons.",
      table: { defaultValue: { summary: "0.5" } },
    },
    disabled: argTypeDisabled(),
    label: {
      control: "text",
      description: "Accessible name for the input and − / + buttons.",
    },
    active: {
      control: "boolean",
      description: "Highlight the stepper with a 2px primary border.",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
  },
  args: {
    value: 4,
    onChange: () => undefined,
    min: 0,
    max: 24,
    step: 0.5,
    disabled: false,
    active: false,
    label: "Hours",
  },
} satisfies Meta<typeof NumberStepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value);

    return <NumberStepper {...args} value={value} onChange={setValue} />;
  },
};

export const Active: Story = {
  args: { active: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};
