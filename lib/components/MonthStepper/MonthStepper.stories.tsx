import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { MonthStepper } from "./MonthStepper";
import { argTypeDisabled, LANGUAGES } from "lib/utils/constants";

const meta = {
  title: "Components/MonthStepper",
  component: MonthStepper,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Compact period selector `‹ July 2026 ›` replacing separate year/month selects on mobile. 44px-wide hit targets, capitalized localized month label.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    year: {
      control: "number",
      description: "Currently selected year.",
    },
    month: {
      control: "number",
      description: "Currently selected month, 1-based (1 = January).",
    },
    onChange: {
      description:
        "Function called with the new year and 1-based month when the period changes.",
      table: { type: { summary: "(year: number, month: number) => void" } },
    },
    disabled: argTypeDisabled(),
    lang: {
      control: "select",
      options: LANGUAGES,
      description: "Language code used to localize the month label.",
      table: {
        defaultValue: { summary: "en" },
        type: { summary: "it | en" },
      },
    },
    previousLabel: {
      control: "text",
      description: "Accessible label for the previous-month button.",
      table: { defaultValue: { summary: "Previous month" } },
    },
    nextLabel: {
      control: "text",
      description: "Accessible label for the next-month button.",
      table: { defaultValue: { summary: "Next month" } },
    },
  },
  args: {
    year: 2026,
    month: 7,
    onChange: () => undefined,
    disabled: false,
    lang: "en",
  },
} satisfies Meta<typeof MonthStepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [period, setPeriod] = useState({
      year: args.year,
      month: args.month,
    });

    return (
      <MonthStepper
        {...args}
        year={period.year}
        month={period.month}
        onChange={(year, month) => setPeriod({ year, month })}
      />
    );
  },
};

export const Italian: Story = {
  args: {
    lang: "it",
    previousLabel: "Mese precedente",
    nextLabel: "Mese successivo",
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};
