import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ColorPicker } from "./ColorPicker";

const meta = {
  title: "Components/ColorPicker",
  component: ColorPicker,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A colour picker: swatch, saturation/brightness area, hue slider and optional quick colours. The value is `#rrggbb`.",
      },
    },
  },
  argTypes: {
    value: { control: "color", description: "Current colour, `#rrggbb`." },
    disabled: { control: "boolean" },
    lang: { control: "radio", options: ["it", "en"] },
  },
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

const Controlled = (args: React.ComponentProps<typeof ColorPicker>) => {
  const [value, setValue] = useState(args.value ?? "#00d9ea");
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <ColorPicker {...args} value={value} onChange={setValue} />
      <code>{value}</code>
    </div>
  );
};

export const Default: Story = {
  args: { value: "#00d9ea", "aria-label": "Primary colour" },
  render: (args) => <Controlled {...args} />,
};

export const WithPresets: Story = {
  args: {
    value: "#1d4ed8",
    presets: ["#00d9ea", "#1d4ed8", "#16a34a", "#ea580c", "#dc2626", "#7c3aed"],
    "aria-label": "Primary colour",
  },
  render: (args) => <Controlled {...args} />,
};

export const Disabled: Story = {
  args: { value: "#7c3aed", disabled: true, "aria-label": "Primary colour" },
  render: (args) => <Controlled {...args} />,
};
