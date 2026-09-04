import {
  argTypeBorderRadius,
  argTypeSize,
  argTypeVariant,
  BORDER_RADIUS_NONE_AND_SIZES,
  BASE_SIZES,
  VARIANT_PRIMARY,
} from "lib/utils/constants";
import { Progress } from "./Progress";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Components/Progress",
  component: Progress,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A progress bar component that indicates the completion status of a process.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: { type: "number", min: 0, max: 100 },
      description: "The current value of the progress bar.",
      table: {
        defaultValue: { summary: "0" },
      },
    },
    max: {
      control: { type: "number", min: 1 },
      description: "The maximum value of the progress bar",
      table: {
        defaultValue: { summary: "100" },
      },
    },
    variant: argTypeVariant(VARIANT_PRIMARY, "primary"),
    size: argTypeSize(BASE_SIZES, "md"),
    borderRadius: argTypeBorderRadius(BORDER_RADIUS_NONE_AND_SIZES, "sm"),
  },
  args: {
    size: "md",
    variant: "primary",
    borderRadius: "sm",
    max: 100,
    value: 40,
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {VARIANT_PRIMARY.map((arg) => (
        <Progress {...args} key={arg} variant={arg} />
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {BASE_SIZES.map((arg) => (
        <Progress {...args} key={arg} size={arg} />
      ))}
    </div>
  ),
};

export const BorderRadius: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {BORDER_RADIUS_NONE_AND_SIZES.map((arg) => (
        <Progress {...args} key={arg} borderRadius={arg} />
      ))}
    </div>
  ),
};
