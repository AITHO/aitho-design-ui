import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { TimePicker } from "./TimePicker";

const meta = {
  title: "Components/TimePicker",
  component: TimePicker,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'A time picker: type hh:mm or pick from the list. The value is `HH:mm`. `Input` uses it for `type="time"`.',
      },
    },
  },
  argTypes: {
    value: { control: "text", description: "Selected time, `HH:mm`." },
    step: { control: "number", description: "Minutes between listed times." },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof TimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

const Controlled = (args: React.ComponentProps<typeof TimePicker>) => {
  const [value, setValue] = useState(args.value ?? "");
  return (
    <div style={{ width: "10rem" }}>
      <TimePicker {...args} value={value} onValueChange={setValue} />
    </div>
  );
};

export const Default: Story = {
  args: { value: "09:00", "aria-label": "Time" },
  render: (args) => <Controlled {...args} />,
};

export const HalfHourSteps: Story = {
  args: {
    value: "13:30",
    step: 30,
    min: "08:00",
    max: "19:00",
    "aria-label": "Time",
  },
  render: (args) => <Controlled {...args} />,
};
