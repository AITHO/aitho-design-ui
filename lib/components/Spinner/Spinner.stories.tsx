import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "./Spinner";
import { Label } from "lib/main";
import { argTypeSize, SIZES_WITH_XL, SPINNER_TYPES } from "lib/utils/constants";

const meta = {
  title: "Components/Spinner",
  component: Spinner,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Displays an animated loading indicator.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: argTypeSize(SIZES_WITH_XL, "md"),
    type: {
      control: "select",
      options: SPINNER_TYPES,
      description: "The variant of the spinner.",
      table: {
        defaultValue: { summary: "linearFlashingDots" },
        type: {
          summary:
            "linearFlashingDots | spinningSlashes | circularFlashingDots | rotatingSquares | rotatingDots",
        },
      },
    },
  },
  args: {
    size: "md",
    type: "linearFlashingDots",
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LinearFlashingDots: Story = {
  args: {},
};

export const Types: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "2rem", flexDirection: "column" }}>
      {SPINNER_TYPES.map((arg) => (
        <div
          key={arg}
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Label>{`Type ${arg}`}</Label>
          <Spinner {...args} type={arg} />
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {SIZES_WITH_XL.map((arg) => (
        <Spinner {...args} key={arg} size={arg} />
      ))}
    </div>
  ),
};
