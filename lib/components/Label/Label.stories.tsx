import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "./Label";
import {
  argTypeDisabled,
  argTypeRequired,
  argTypeSize,
  argTypeVariant,
  REQUIRED_TEXT_BOLD,
  SIZES_WITH_XL,
  VARIANTS_TEXT,
} from "lib/utils/constants";

const meta = {
  title: "Components/Label",
  component: Label,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Renders an accessible label associated with controls.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: argTypeVariant(VARIANTS_TEXT, "text"),
    size: argTypeSize(SIZES_WITH_XL, "md"),
    disabled: argTypeDisabled(),
    required: argTypeRequired(REQUIRED_TEXT_BOLD),
    children: {
      control: "text",
      description: "The content of the component.",
    },
  },
  args: {
    size: "md",
    variant: "text",
    disabled: false,
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Label Text",
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {SIZES_WITH_XL.map((arg) => (
        <Label {...args} key={arg} size={arg}>{`Size ${arg}`}</Label>
      ))}
    </div>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {VARIANTS_TEXT.map((arg) => (
        <Label {...args} key={arg} variant={arg}>{`Variant ${arg}`}</Label>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    children: "Disabled Label",
    disabled: true,
  },
};

export const Required: Story = {
  render: (args) => (
    <div
      style={{
        display: "flex",
        gap: "1.5rem",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {REQUIRED_TEXT_BOLD.map((arg) => (
        <Label key={arg} {...args} required={arg} htmlFor={arg}>
          Required variant: {arg}
        </Label>
      ))}
    </div>
  ),
};
