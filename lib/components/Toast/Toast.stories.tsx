import { Toast, ToastProps } from "./Toast";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "lib/main";
import { useToast } from "../../providers/toast/useToast";
import { ToastProvider } from "lib/providers/toast/ToastProvider";
import {
  argTypeBorderRadius,
  argTypePosition,
  argTypeSize,
  argTypeVariant,
  BORDER_RADIUS,
  ALL_POSITIONS,
  BASE_SIZES,
  VARIANTS_SECONDARY_FOR_TOAST,
} from "lib/utils/constants";

const ToastContainer = (args: ToastProps) => {
  const { showToast } = useToast();

  const onClick = () => {
    showToast({ ...args });
  };

  return (
    <div style={{ padding: "35px", textAlign: "center" }}>
      <Button onClick={onClick}>{args.title}</Button>
    </div>
  );
};

const meta: Meta<typeof Toast> = {
  title: "Components/Toast",
  component: Toast,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "A toast component that displays a message to the user for a short period of time. To learn about it read the ToastProvider documentation page.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
  argTypes: {
    variant: argTypeVariant(VARIANTS_SECONDARY_FOR_TOAST, "base"),
    size: argTypeSize(BASE_SIZES, "md"),
    position: argTypePosition(ALL_POSITIONS, "bottom-right"),
    title: {
      control: "text",
      description: "Title of the toast. Bold text on top.",
    },
    content: {
      control: "text",
      description: "Content of the toast.",
      table: {
        type: { summary: "React.ReactNode" },
      },
    },
    duration: {
      control: {
        type: "number",
        min: 1000,
        step: 100,
      },
      description: "The duration of the toast in milliseconds.",
    },
    closable: {
      control: "boolean",
      description: "Whether the toast can be closed.",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    closeOnClick: {
      control: "boolean",
      description:
        "Whether the toast can be closed by clicking on it. Only works if `closable` is true.",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    borders: argTypeBorderRadius(BORDER_RADIUS, "rounded"),
    onAnimationEnd: {
      description: "Callback called when the toast EXIT animation does end.",
    },
  },
  args: {
    duration: 5000,
    closable: false,
    closeOnClick: false,
    variant: "base",
    size: "md",
    position: "bottom-right",
    borders: "rounded",
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Toast",
    content: "This is a default toast message.",
  },
  render: (args) => <ToastContainer {...args} />,
};

export const Sizes: Story = {
  args: {
    content: "This toast adjusts its size based on the variant.",
  },
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {BASE_SIZES.map((arg) => (
        <ToastContainer {...args} key={arg} title={`Size ${arg}`} size={arg} />
      ))}
    </div>
  ),
};

export const BorderRadius: Story = {
  args: {
    content: "This toast adjusts its borders.",
  },
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {BORDER_RADIUS.map((arg) => (
        <ToastContainer
          {...args}
          key={arg}
          title={`Border radius ${arg}`}
          borders={arg}
        />
      ))}
    </div>
  ),
};

export const Closable: Story = {
  args: {
    content: "This toast has a close button.",
  },
  render: (args) => (
    <ToastContainer {...args} title="Closable toast" closable />
  ),
};

export const ClosableOnClick: Story = {
  args: {
    closable: true,
    closeOnClick: true,
    content:
      "This toast has a close button but it also close if you click on it.",
  },
  render: (args) => (
    <ToastContainer {...args} title="Closable toast on click" closable />
  ),
};

export const Variants: Story = {
  args: {
    content: "Do you like this color?",
  },
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {VARIANTS_SECONDARY_FOR_TOAST.map((arg) => (
        <ToastContainer
          {...args}
          key={arg}
          title={`Variant ${arg}`}
          variant={arg}
        />
      ))}
    </div>
  ),
};

export const Positions: Story = {
  args: {
    content: "Do you like this position?",
  },
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {ALL_POSITIONS.map((arg) => (
        <ToastContainer
          {...args}
          key={arg}
          title={`Position ${arg}`}
          position={arg}
        />
      ))}
    </div>
  ),
};
