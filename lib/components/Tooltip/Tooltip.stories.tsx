import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tooltip } from "./Tooltip";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import {
  ALIGNS,
  argTypeAlign,
  argTypeChildren,
  argTypeSide,
  argTypeSize,
  SIDES,
  SIZES_WITH_XL,
} from "lib/utils/constants";

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ paddingTop: "10px" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    size: argTypeSize(SIZES_WITH_XL, "sm"),
    children: argTypeChildren(),
    textContent: {
      control: "text",
      description: "The content of the tooltip.",
    },
    textAlign: {
      ...argTypeAlign("center"),
      description: "Align text content inside the tooltip",
    },
    sideOffset: {
      control: "number",
      description: "The distance in pixels from the trigger.",
      table: {
        defaultValue: { summary: "5" },
      },
    },
    childColor: {
      control: "color",
      description: "Color of the children.",
      table: {
        defaultValue: { summary: "background-popup" },
      },
    },
    contentColor: {
      control: "color",
      description: "Color of the content.",
      table: {
        defaultValue: { summary: "light" },
      },
    },
    contentBackgroundColor: {
      control: "color",
      description: "BackgroundColor of the content.",
      table: {
        defaultValue: { summary: "background-popup" },
      },
    },
    triggerAs: {
      control: "select",
      options: ["button", "div", "span"],
      description:
        "Render the trigger as a different element instead of button.",
      table: {
        defaultValue: { summary: "div" },
        type: { summary: "button | div | span " },
      },
    },
    side: argTypeSide(),
    align: argTypeAlign("center"),
  },
  args: {
    size: "sm",
    textAlign: "center",
    children: "Hover me",
    textContent: "This is a tooltip",
    sideOffset: 5,
    childColor: "background-popup",
    contentColor: "light",
    contentBackgroundColor: "background-popup",
    side: "top",
    align: "center",
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithIcon: Story = {
  args: {
    children: <InfoCircledIcon />,
  },
};

export const CustomColors: Story = {
  args: {
    textContent: "Custom colored tooltip",
    childColor: "red",
    contentColor: "yellow",
    contentBackgroundColor: "blue",
  },
  render: (args) => <Tooltip {...args} />,
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {SIZES_WITH_XL.map((arg) => (
        <Tooltip {...args} key={arg} size={arg} textContent={`Size ${arg}`} />
      ))}
    </div>
  ),
};

export const SidePosition: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {SIDES.map((arg) => (
        <Tooltip
          {...args}
          key={arg}
          side={arg}
          textContent={`Side position ${arg}`}
        />
      ))}
    </div>
  ),
};

export const AlignPosition: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {ALIGNS.map((arg) => (
        <Tooltip
          {...args}
          key={arg}
          align={arg}
          textContent={`Align position ${arg}`}
        />
      ))}
    </div>
  ),
};

export const AlignTextContent: Story = {
  args: {
    textContent:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut accumsan urna. Morbi varius tempor cursus. Fusce nec purus vitae lacus euismod maximus sit amet ac dolor. ",
  },

  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {ALIGNS.map((arg) => (
        <Tooltip {...args} key={arg} textAlign={arg} />
      ))}
    </div>
  ),
};
