import {
  CheckCircledIcon,
  DotsHorizontalIcon,
  Pencil1Icon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { DropdownMenu } from "./DropdownMenu";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ALIGNS,
  argTypeAlign,
  argTypeSide,
  argTypeSize,
  argTypeVariant,
  SIDES,
  BASE_SIZES,
  VARIANTS_GHOST,
} from "lib/utils/constants";
import { Button } from "lib/main";

const meta = {
  title: "Components/DropdownMenu",
  component: DropdownMenu,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Displays a menu to the user with a set of actions or functions-triggered by a button.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div
        style={{ display: "flex", alignItems: "flex-end", minHeight: "100px" }}
      >
        <Story />
      </div>
    ),
  ],
  argTypes: {
    variant: argTypeVariant(VARIANTS_GHOST, "primary"),
    size: argTypeSize(BASE_SIZES, "md"),
    trigger: {
      control: "object",
      description: "Clickable element than displays dropdownMenu.",
      table: { type: { summary: "React.ReactNode" } },
    },
    arrow: {
      control: "boolean",
      description: "The arrow of the dropdownMenu.",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    menuContent: {
      control: "object",
      description: "The contents array of the dropdownMenu.",
      table: { type: { summary: "DropdownMenuContentProps[]" } },
    },
    sideOffset: {
      control: "number",
      description: "The distance in pixels from the trigger.",
      table: { defaultValue: { summary: "-10" } },
    },
    side: argTypeSide(),
    align: argTypeAlign("start"),
    container: {
      control: "object",
      description:
        "The container element that the dialog should be rendered into.",
      table: { type: { summary: "HTMLElement | null" } },
    },
    zIndex: {
      control: "number",
      description: "The z-index of the dropdownMenu.",
      table: { defaultValue: { summary: "200" } },
    },
  },
  args: {
    size: "md",
    variant: "primary",
    trigger: <DotsHorizontalIcon />,
    arrow: false,
    sideOffset: 4,
    zIndex: 200,
    side: "top",
    align: "start",
    menuContent: [{ type: "label", text: "Label" }],
  },
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithIcon: Story = { args: {} };

export const WithLabel: Story = { args: { trigger: "Click me" } };

export const WithArrow: Story = { args: { arrow: true } };

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {VARIANTS_GHOST.map((arg) => (
        <DropdownMenu
          {...args}
          key={arg}
          variant={arg}
          trigger={`Variant ${arg}`}
        />
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {BASE_SIZES.map((arg) => (
        <DropdownMenu {...args} key={arg} size={arg} trigger={`Size ${arg}`} />
      ))}
    </div>
  ),
};

export const SidePosition: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {SIDES.map((arg) => (
        <DropdownMenu {...args} key={arg} side={arg} trigger={`Side ${arg}`} />
      ))}
    </div>
  ),
};

export const AlignPosition: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {ALIGNS.map((arg) => (
        <DropdownMenu
          {...args}
          key={arg}
          align={arg}
          trigger={`Align ${arg}`}
        />
      ))}
    </div>
  ),
};

export const WithSeparator: Story = {
  args: {
    menuContent: [
      { type: "label", text: "Label" },
      { type: "separator" },
      { type: "label", text: "Label" },
    ],
  },
};

export const WithItems: Story = {
  args: {
    menuContent: [
      {
        type: "item",
        text: "Edit",
        rightSlot: <Pencil1Icon />,
        onClick: () => undefined,
      },
      {
        type: "item",
        text: "Delete",
        rightSlot: <TrashIcon />,
        onClick: () => undefined,
      },
    ],
  },
};

export const WithChecks: Story = {
  args: {
    menuContent: [
      {
        type: "check",
        text: "Checked",
        isCheck: true,
        onChange: () => undefined,
      },
      {
        type: "check",
        text: "Unchecked",
        isCheck: false,
        onChange: () => undefined,
      },
    ],
  },
};

export const WithRadioGroup: Story = {
  args: {
    menuContent: [
      {
        type: "radioGroup",
        selected: "Selected",
        options: ["Selected", "Unselected"],
        onChange: () => undefined,
      },
    ],
  },
};

export const WithSubMenu: Story = {
  args: {
    menuContent: [
      {
        type: "subMenu",
        text: "SubMenu",
        subMenuElements: [{ type: "label", text: "Label" }],
      },
    ],
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    trigger: (
      <Button variant="primary" compact>
        I&apos;m a button, click me!
      </Button>
    ),
    menuContent: [
      {
        type: "item",
        text: "Edit",
        rightSlot: <Pencil1Icon />,
        onClick: () => undefined,
      },
      {
        type: "item",
        text: "Delete",
        rightSlot: <TrashIcon />,
        onClick: () => undefined,
      },
    ],
  },
};

export const WithContentsDisable: Story = {
  decorators: [
    (Story) => (
      <div
        style={{ display: "flex", alignItems: "flex-end", minHeight: "220px" }}
      >
        <Story />
      </div>
    ),
  ],
  args: {
    menuContent: [
      {
        type: "item",
        text: "Enabled",
        rightSlot: <CheckCircledIcon />,
        onClick: () => undefined,
      },
      {
        type: "item",
        text: "Item",
        rightSlot: "icon",
        onClick: () => undefined,
        disable: true,
      },
      { type: "separator" },
      {
        type: "check",
        text: "Checked",
        isCheck: true,
        onChange: () => undefined,
        disable: true,
      },
      { type: "separator" },
      {
        type: "radioGroup",
        selected: "Selected",
        options: ["Selected", "Unselected"],
        onChange: () => undefined,
        disable: true,
      },
      {
        type: "subMenu",
        text: "SubMenu",
        subMenuElements: [{ type: "label", text: "Label" }],
        disable: true,
      },
    ],
  },
};
