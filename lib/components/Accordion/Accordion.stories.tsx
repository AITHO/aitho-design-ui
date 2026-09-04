import {
  argTypeBorderColors,
  argTypeSize,
  argTypeVariant,
  BORDER_COLORS,
  BASE_SIZES,
  VARIANTS_SECONDARY,
} from "lib/utils/constants";
import { Accordion } from "./Accordion";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Components/Accordion",
  component: Accordion,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A vertically stacked set of interactive headings that each reveal an associated section of content.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["single", "multiple"],
      description:
        "Determines whether one or multiple items can be opened at the same time.",
      table: {
        defaultValue: { summary: "multiple" },
        type: { summary: "single | multiple" },
      },
    },
    collapsible: {
      control: "boolean",
      description:
        "When type is 'single', allows closing content when clicking trigger for an open item.",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    items: {
      control: "object",
      description: "Clickable elements than displays accordion contents.",
      table: {
        type: { summary: "AccordionItemProps[]" },
      },
    },
    width: {
      control: "object",
      description: "The width of accordion",
      table: {
        defaultValue: { summary: "250px" },
      },
    },
    triggerHeight: {
      control: "text",
      description: "The height of trigger.",
      table: {
        defaultValue: { summary: "45px" },
      },
    },
    size: argTypeSize(BASE_SIZES, "sm"),
    variant: argTypeVariant(VARIANTS_SECONDARY, "primary"),
    borderColor: argTypeBorderColors(BORDER_COLORS),
  },
  args: {
    type: "multiple",
    borderColor: "base",
    items: [
      {
        value: "item-1",
        header: "Item 1",
        content: ["Content of item 1"],
      },
      {
        value: "item-2",
        header: "Item 2",
        content: ["Content of item 2"],
      },
    ],
    width: "250px",
    triggerHeight: "45px",
    size: "sm",
    variant: "primary",
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Multiple: Story = {
  args: {},
};

export const SingleNotCollapsible: Story = {
  args: {
    type: "single",
    collapsible: false,
  },
};

export const SingleCollapsible: Story = {
  args: {
    type: "single",
    collapsible: true,
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {BASE_SIZES.map((arg) => (
        <Accordion
          {...args}
          key={arg}
          size={arg}
          items={[
            {
              value: "item-1",
              header: `Size ${arg}`,
              content: [`Content of size ${arg}`],
            },
          ]}
        />
      ))}
    </div>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {VARIANTS_SECONDARY.map((arg) => (
        <Accordion
          {...args}
          key={arg}
          variant={arg}
          items={[
            {
              value: "item-1",
              header: `Variant ${arg}`,
              content: [`Content of variant ${arg}`],
            },
          ]}
        />
      ))}
    </div>
  ),
};

export const BorderColors: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {BORDER_COLORS.map((arg) => (
        <Accordion
          {...args}
          key={arg}
          borderColor={arg}
          items={[
            {
              value: "item-1",
              header: `Border color ${arg}`,
              content: [`Content of border color ${arg}`],
            },
          ]}
        />
      ))}
    </div>
  ),
};
