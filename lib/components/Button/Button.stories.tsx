import { Button, Icon } from "./Button";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FaceIcon, ImageIcon, SunIcon } from "@radix-ui/react-icons";
import {
  argTypeBorderRadius,
  argTypeChildren,
  argTypeDisabled,
  argTypeOrientation,
  argTypeSize,
  argTypeVariant,
  BORDER_RADIUS,
  POSITIONS_START_AND_END,
  SIZES_WITH_XXS,
  VARIANTS_WITH_OUTLINE_ERROR,
} from "lib/utils/constants";

enum IconName {
  FaceIcon = "Face Icon",
  ImageIcon = "Image Icon",
  SunIcon = "Sun Icon",
}

const iconOptions: Record<IconName, Icon> = {
  [IconName.FaceIcon]: { data: FaceIcon },
  [IconName.ImageIcon]: { data: ImageIcon },
  [IconName.SunIcon]: { data: SunIcon },
};

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A button means an operation (or a series of operations).",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: argTypeSize(SIZES_WITH_XXS, "md"),
    borderRadius: argTypeBorderRadius(BORDER_RADIUS, "rounded"),
    variant: argTypeVariant(VARIANTS_WITH_OUTLINE_ERROR, "primary"),
    layout: argTypeOrientation(),
    children: argTypeChildren(),
    disabled: argTypeDisabled(),
    compact: {
      control: "boolean",
      description:
        "When true, the button width/height shrinks to adapt to the content, and also removes the padding.",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    icon: {
      control: "select",
      options: Object.keys(iconOptions),
      mapping: iconOptions,
      description: "Icon component to be used in the button.",
      table: {
        type: { summary: "Icon" },
      },
    },
    iconPosition: {
      control: "select",
      options: POSITIONS_START_AND_END,
      description: "Position of the icon.",
      table: {
        defaultValue: { summary: "start" },
        type: { summary: "start | end" },
      },
    },
  },
  args: {
    size: "md",
    borderRadius: "rounded",
    variant: "primary",
    layout: "horizontal",
    disabled: false,
    iconPosition: "start",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Button" },
};

export const Variants: StoryObj<typeof Button> = {
  render: (args) => (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      {VARIANTS_WITH_OUTLINE_ERROR.map((arg) => (
        <div
          key={arg}
          style={{
            display: "flex",
            gap: "1rem",
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Button {...args} key={arg} variant={arg}>
              {`Button variant ${arg}`}
            </Button>
          </div>
          <Button
            {...args}
            key={arg}
            variant={arg}
            icon={{ data: FaceIcon }}
          ></Button>
        </div>
      ))}
    </div>
  ),
};

export const Roundness: StoryObj<typeof Button> = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {BORDER_RADIUS.map((arg) => (
        <Button {...args} key={arg} borderRadius={arg}>
          {`Button roundness ${arg}`}
        </Button>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {SIZES_WITH_XXS.map((arg) => (
        <Button {...args} key={arg} size={arg}>
          {`Button size ${arg}`}
        </Button>
      ))}
    </div>
  ),
};

export const ButtonAndIcons: Story = {
  args: {
    icon: iconOptions["Face Icon"],
  },
  render: (args) => (
    <div
      style={{
        display: "grid",
        gap: "1rem",
        gridTemplateColumns: "1fr 1fr 1fr",
      }}
    >
      <Button {...args} iconPosition="start">
        {`Icon button`}
      </Button>
      <Button {...args} iconPosition="end">
        {`Icon button`}
      </Button>
      <Button {...args} />
    </div>
  ),
};

export const Compact: Story = {
  args: {
    icon: iconOptions["Face Icon"],
  },
  render: (args) => (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "2rem",
        fontWeight: "bold",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <span>False</span>
        <Button {...args} borderRadius="pills" />
      </div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <span>True</span>
        <Button {...args} borderRadius="pills" compact />
      </div>
    </div>
  ),
};

export const DisabledButton: Story = {
  args: {
    children: "Disabled Button",
    disabled: true,
  },
};
