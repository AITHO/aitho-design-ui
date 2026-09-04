import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge";
import { HomeIcon } from "@radix-ui/react-icons";
import {
  argTypeChildren,
  argTypePosition,
  argTypeVariant,
  BADGE_TYPES,
  BASE_POSITIONS,
  SHAPES,
  BASE_VARIANTS,
} from "lib/utils/constants";

const RectangleChildren = () => (
  <div
    style={{
      width: "50px",
      height: "50px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--text-on-primary)",
      background: "var(--color-primary)",
      borderRadius: "var(--radius)",
    }}
  >
    <HomeIcon width="50%" height="50%" />
  </div>
);

const meta = {
  title: "Components/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Numerical value or status descriptor for UI elements.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    children: argTypeChildren(),
    count: {
      control: "number",
      description: "The number content of the badge.",
    },
    variant: argTypeVariant(BASE_VARIANTS, "primary"),
    type: {
      control: "select",
      options: BADGE_TYPES,
      description: "The variant of the badge.",
      table: {
        defaultValue: { summary: "standard" },
        type: { summary: "standard | dot" },
      },
    },
    overlap: {
      control: "select",
      options: SHAPES,
      description: "Shape the badge should overlap.",
      table: {
        defaultValue: { summary: "rectangular" },
        type: { summary: "rectangular | circular" },
      },
    },
    placement: argTypePosition(BASE_POSITIONS, "top-right"),
    invisible: {
      control: "boolean",
      description: "If true, the badge will be invisible.",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    showZero: {
      control: "boolean",
      description: "If true, the badge will show zero.",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    max: {
      control: "number",
      description: "Max count to show.",
    },
    content: {
      description: "The content of the badge.",
      control: "object",
      table: {
        type: { summary: "React.ReactNode" },
      },
    },
  },
  args: {
    variant: "primary",
    type: "standard",
    overlap: "rectangular",
    placement: "top-right",
    invisible: false,
    showZero: false,
    children: <RectangleChildren />,
    count: 42,
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const MaxValue: Story = {
  args: {
    count: 100,
    max: 99,
  },
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem" }}>
      {BASE_VARIANTS.map((color) => (
        <Badge {...args} key={color} variant={color} />
      ))}
    </div>
  ),
};

export const Types: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem" }}>
      {BADGE_TYPES.map((variant) => (
        <Badge {...args} key={variant} type={variant} />
      ))}
    </div>
  ),
};

export const Overlaps: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem" }}>
      {SHAPES.map((overlap) => (
        <Badge {...args} key={overlap} overlap={overlap} />
      ))}
    </div>
  ),
};

export const Placements: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "2rem" }}>
      {BASE_POSITIONS.map((placement) => (
        <Badge {...args} key={placement} placement={placement} />
      ))}
    </div>
  ),
};

export const Content: Story = {
  args: {
    content: (
      <div
        style={{
          width: "6px",
          height: "6px",
          background: "white",
          animation: "spin 1s linear infinite",
        }}
      />
    ),
  },
};
