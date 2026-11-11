import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { DatePicker } from "./DatePicker";

const meta = {
  title: "Components/DatePicker",
  component: DatePicker,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          'A day picker: type dd/mm/yyyy or pick from the calendar. The value is `YYYY-MM-DD`. `Input` uses it for `type="date"`.',
      },
    },
  },
  argTypes: {
    value: { control: "text", description: "Selected day, `YYYY-MM-DD`." },
    min: {
      control: "text",
      description: "First selectable day, `YYYY-MM-DD`.",
    },
    max: { control: "text", description: "Last selectable day, `YYYY-MM-DD`." },
    lang: {
      control: "radio",
      options: ["it", "en"],
      description: "Language of the labels; defaults to the page language.",
    },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

const Controlled = (args: React.ComponentProps<typeof DatePicker>) => {
  const [value, setValue] = useState(args.value ?? "");
  return (
    <div style={{ width: "18rem" }}>
      <DatePicker {...args} value={value} onValueChange={setValue} />
    </div>
  );
};

export const Default: Story = {
  args: { lang: "it", "aria-label": "Data" },
  render: (args) => <Controlled {...args} />,
};

export const WithValue: Story = {
  args: { lang: "it", value: "2026-11-10", "aria-label": "Data" },
  render: (args) => <Controlled {...args} />,
};

export const MinMax: Story = {
  args: {
    lang: "en",
    value: "2026-11-10",
    min: "2026-11-03",
    max: "2026-11-24",
    "aria-label": "Date",
  },
  render: (args) => <Controlled {...args} />,
};

export const Disabled: Story = {
  args: {
    lang: "it",
    value: "2026-11-10",
    disabled: true,
    "aria-label": "Data",
  },
  render: (args) => <Controlled {...args} />,
};
