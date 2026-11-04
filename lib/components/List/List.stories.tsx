import {
  argTypeSize,
  argTypeVariant,
  BASE_SIZES,
  VARIANTS_SECONDARY_WITH_NEUTRAL,
} from "lib/utils/constants";
import { List } from "./List";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, Button, ToggleSwitch } from "lib/main";

const meta = {
  title: "Components/List",
  component: List,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "Provides a list of items.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ padding: "50px" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    variant: argTypeVariant(VARIANTS_SECONDARY_WITH_NEUTRAL, "secondary"),
    items: {
      control: "object",
      description:
        "List items. Each single component requires a key, except strings",
      table: {
        type: { summary: "ListItemProp[]" },
      },
    },
    striped: {
      control: "boolean",
      description: "Enable striped rows.",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    size: argTypeSize(BASE_SIZES, "md"),
  },
  args: {
    items: [
      {
        leftSlot: [<Avatar name="1" key="1" />, "Nome 1"],
        rightSlot: ["Stringa 1", <ToggleSwitch key="2" />],
      },
    ],
    striped: false,
    size: "md",
    variant: "secondary",
  },
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      {
        leftSlot: [<Avatar name="1" key="1" />, "Nome 1"],
        rightSlot: ["Stringa 1", <ToggleSwitch key="2" />],
      },
      {
        leftSlot: [<Avatar name="2" key="3" />, "Nome 2"],
        rightSlot: [<Button key="4">Button</Button>],
      },
      {
        leftSlot: [<Avatar name="3" key="5" />, "Nome 3"],
        rightSlot: [
          <div
            key="6"
            aria-hidden="true"
            style={{
              height: "150px",
              width: "150px",
              background:
                "linear-gradient(135deg, #1f2937 25%, #475569 25%, #475569 50%, #1f2937 50%, #1f2937 75%, #475569 75%)",
            }}
          />,
        ],
      },
    ],
  },
  render: (args) => <List {...args} />,
};

export const OnlyLeftSlot: Story = {
  args: {
    items: [
      {
        leftSlot: [<Avatar name="1" key="1" />, "Nome 1"],
      },
    ],
  },
  render: (args) => <List {...args} />,
};

export const OnlyRightSlot: Story = {
  args: {
    items: [
      {
        rightSlot: ["Stringa 1", <ToggleSwitch key="2" />],
      },
    ],
  },
  render: (args) => <List {...args} />,
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {BASE_SIZES.map((arg) => (
        <List {...args} key={arg} size={arg} />
      ))}
    </div>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {VARIANTS_SECONDARY_WITH_NEUTRAL.map((arg) => (
        <List {...args} key={arg} variant={arg} />
      ))}
    </div>
  ),
};

export const Striped: Story = {
  args: {
    items: [
      {
        leftSlot: [<Avatar name="1" key="1" />, "Nome 1"],
        rightSlot: ["Stringa 1", <ToggleSwitch key="2" />],
      },
      {
        leftSlot: [<Avatar name="2" key="3" />, "Nome 2"],
        rightSlot: [<Button key="4">Button</Button>],
      },
      {
        leftSlot: [<Avatar name="3" key="5" />, "Nome 3"],
        rightSlot: ["Stringa 3", <ToggleSwitch key="6" />],
      },
    ],
    striped: true,
  },
  render: (args) => (
    <div style={{ display: "flex", gap: "2rem", flexDirection: "column" }}>
      {VARIANTS_SECONDARY_WITH_NEUTRAL.map((arg) => (
        <List {...args} key={arg} variant={arg} />
      ))}
    </div>
  ),
};
