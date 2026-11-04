import type { Meta, StoryObj } from "@storybook/react-vite";
import { Dialog } from "./Dialog";
import { useState } from "react";
import { Button, Input, Label } from "lib/main";
import { argTypeChildren, argTypeSize, BASE_SIZES } from "lib/utils/constants";

const DialogWrapper = ({
  open,
  onCancel,
  onOk,
  ...args
}: React.ComponentProps<typeof Dialog>) => {
  const [isOpen, setIsOpen] = useState(open || false);

  const handleCancel = () => {
    setIsOpen(false);
    onCancel?.();
  };

  const handleOk = () => {
    setIsOpen(false);
    onOk?.();
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Button onClick={() => setIsOpen(true)}>Open Dialog</Button>
      <Dialog {...args} open={isOpen} onCancel={handleCancel} onOk={handleOk} />
    </div>
  );
};

const meta: Meta<typeof Dialog> = {
  title: "Components/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A window overlaid on either the primary window or another dialog window, rendering the content underneath inert.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    open: {
      control: "boolean",
      description: "Determines if the dialog is open.",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    title: {
      control: "text",
      description: "The title of the dialog.",
    },
    description: {
      control: "text",
      description: "The description of the dialog.",
    },
    container: {
      control: "object",
      description:
        "The container element that the dialog should be rendered into.",
      table: {
        type: { summary: "HTMLElement | null" },
      },
    },
    onOk: {
      description: "Callback function triggered on Ok button click.",
    },
    onCancel: {
      description: "Callback function triggered on Cancel button click.",
    },
    loading: {
      control: "boolean",
      description: "Disables the buttons when true.",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    footer: {
      control: "boolean",
      description: "Controls the footer visibility.",
      table: {
        defaultValue: { summary: "true" },
        type: { summary: "boolean" },
      },
    },
    cancelText: {
      control: "text",
      description: "Text for the cancel button.",
      table: {
        defaultValue: { summary: "Cancel" },
      },
    },
    okText: {
      control: "text",
      description: "Text for the Ok button.",
      table: {
        defaultValue: { summary: "Ok" },
      },
    },
    close: {
      control: "boolean",
      description: "Controls the visibility of the close button.",
      table: {
        defaultValue: { summary: "true" },
        type: { summary: "boolean" },
      },
    },
    children: argTypeChildren(),
    width: argTypeSize(BASE_SIZES, "md"),
  },
  args: {
    width: "md",
    open: false,
    cancelText: "Cancel",
    okText: "Ok",
    footer: true,
    loading: false,
    close: true,
    children: "This is the body content of the dialog.",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Default Dialog",
    description: "This is a description for the default dialog.",
  },
  render: (args) => <DialogWrapper key={String(args.open)} {...args} />,
};

export const WithoutFooter: Story = {
  args: {
    title: "No Footer Dialog",
    description: "This dialog does not have a footer.",
  },
  render: (args) => <DialogWrapper key={String(args.open)} {...args} />,
};

export const LoadingState: Story = {
  args: {
    title: "Loading Dialog",
    description: "This dialog simulates a loading state.",
    children: "The buttons in this dialog are disabled due to loading.",
    loading: true,
  },
  render: (args) => <DialogWrapper key={String(args.open)} {...args} />,
};

export const Widths: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {BASE_SIZES.map((arg) => (
        <div key={arg}>
          <Label>{`Width ${arg}`}</Label>
          <DialogWrapper
            key={`${String(args.open)}-${arg}`}
            {...args}
            width={arg}
          />
        </div>
      ))}
    </div>
  ),
};

export const CustomFooterButtons: Story = {
  args: {
    title: "Custom Footer Buttons",
    description: "This dialog uses custom text for the footer buttons.",
    children: "You can customize the footer buttons' text.",
    cancelText: "Nope",
    okText: "Sure!",
  },
  render: (args) => <DialogWrapper key={String(args.open)} {...args} />,
};

export const FormDialog: Story = {
  args: {
    title: "Form Dialog",
    description: "This dialog contains a form.",
    children: (
      <form
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        onSubmit={(e) => {
          e.preventDefault();
          alert("Form submitted!");
        }}
      >
        <label style={{ display: "flex", gap: "1.3rem" }}>
          Name:
          <Input type="text" name="name" style={{ width: "300px" }} />
        </label>
        <label style={{ display: "flex", gap: "1.6rem" }}>
          Email:
          <Input type="email" name="email" style={{ width: "300px" }} />
        </label>
      </form>
    ),
  },
  render: (args) => <DialogWrapper key={String(args.open)} {...args} />,
};
