import {
  argTypeAlign,
  argTypeDisabled,
  argTypeSide,
} from "lib/utils/constants";
import * as React from "react";
import { useArgs } from "storybook/preview-api";
import { Label } from "../Label/Label";
import { ColorPicker } from "./ColorPicker";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Components/ColorPicker",
  component: ColorPicker,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A swatch button that opens a themed panel to pick a color: saturation/brightness area, hue slider, hex field, optional preset colors and, in Chromium browsers, an eye dropper. Every control works from the keyboard (arrows, Shift+arrows for larger steps, Home/End on the hue).",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    value: {
      control: "color",
      description: "Current color, as a hex string.",
      table: { type: { summary: "string" } },
    },
    disabled: argTypeDisabled(),
    side: { ...argTypeSide(), table: { defaultValue: { summary: "bottom" } } },
    align: argTypeAlign("start"),
    swatches: {
      control: "object",
      description: "Preset colors shown below the controls.",
      table: { type: { summary: "string[]" } },
    },
  },
  args: {
    value: "#71ad00",
    onChange: () => undefined,
    disabled: false,
  },
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// Story render function (not a component: Storybook hooks only run in the story function). The
// picked color is written back to the args, so Controls and picker stay in sync both ways.
const StatefulPicker = (args: React.ComponentProps<typeof ColorPicker>) => {
  const [, updateArgs] = useArgs();
  return (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
      <ColorPicker {...args} onChange={(value) => updateArgs({ value })} />
      <code>{args.value}</code>
    </div>
  );
};

export const Default: Story = {
  render: StatefulPicker,
};

export const WithSwatches: Story = {
  args: {
    swatches: [
      "#71ad00",
      "#1e90ff",
      "#7c3aed",
      "#e11d48",
      "#f59e0b",
      "#0f766e",
      "#334155",
      "#000000",
    ],
  },
  render: StatefulPicker,
};

export const WithExternalLabel: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
      <Label htmlFor="brand-color">Brand color</Label>
      {StatefulPicker({ ...args, id: "brand-color" })}
    </div>
  ),
};

export const Localized: Story = {
  args: {
    triggerLabel: "Scegli colore",
    saturationLabel: "Saturazione e luminosità",
    hueLabel: "Tonalità",
    hexLabel: "Esadecimale",
    eyeDropperLabel: "Preleva un colore dallo schermo",
    swatchesLabel: "Colori predefiniti",
    swatches: ["#71ad00", "#1e90ff", "#e11d48"],
  },
  render: StatefulPicker,
};

export const Disabled: Story = {
  args: { disabled: true },
};
