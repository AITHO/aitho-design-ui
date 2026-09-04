import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { BottomSheet } from "./BottomSheet";
import { Button } from "lib/main";
import { argTypeChildren } from "lib/utils/constants";

const meta = {
  title: "Components/BottomSheet",
  component: BottomSheet,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Mobile bottom sheet: bottom-anchored panel with grabber, swipe-down / overlay tap / Escape to close, scrollable body and sticky footer.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    isOpen: {
      control: "boolean",
      description: "Boolean value indicating the visibility of the sheet.",
      table: { type: { summary: "boolean" } },
    },
    onClose: {
      description: "Function called when the sheet requests to close.",
      table: { type: { summary: "() => void" } },
    },
    title: {
      control: "text",
      description: "Accessible name of the sheet, shown in the default header.",
    },
    header: {
      control: "object",
      description: "Custom header content replacing the default title row.",
      table: { type: { summary: "React.ReactNode" } },
    },
    footer: {
      control: "object",
      description: "Sticky footer content with safe-area bottom padding.",
      table: { type: { summary: "React.ReactNode" } },
    },
    fullScreen: {
      control: "boolean",
      description:
        "Full-screen presentation instead of the bottom-anchored sheet.",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    showCloseButton: {
      control: "boolean",
      description: "Whether to show the close button in the default header.",
      table: {
        defaultValue: { summary: "true" },
        type: { summary: "boolean" },
      },
    },
    closeAriaLabel: {
      control: "text",
      description: "Accessible label for the close button.",
      table: { defaultValue: { summary: "Close" } },
    },
    children: argTypeChildren(),
  },
  args: {
    isOpen: false,
    onClose: () => undefined,
    title: "Sheet title",
    fullScreen: false,
    showCloseButton: true,
    children: <div style={{ padding: "1rem" }}>Sheet content</div>,
  },
} satisfies Meta<typeof BottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open sheet</Button>
        <BottomSheet
          {...args}
          isOpen={open}
          onClose={() => setOpen(false)}
          footer={
            <Button onClick={() => setOpen(false)} style={{ flex: 1 }}>
              Confirm
            </Button>
          }
        >
          <div style={{ padding: "1rem 1.25rem" }}>
            {Array.from({ length: 20 }, (_, index) => (
              <p key={index}>Scrollable row {index + 1}</p>
            ))}
          </div>
        </BottomSheet>
      </>
    );
  },
};

export const FullScreen: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>Open full-screen sheet</Button>
        <BottomSheet
          {...args}
          isOpen={open}
          fullScreen
          onClose={() => setOpen(false)}
        >
          <div style={{ padding: "1rem 1.25rem" }}>Long form content</div>
        </BottomSheet>
      </>
    );
  },
};
