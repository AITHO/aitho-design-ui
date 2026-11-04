import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextArea } from "./TextArea";
import {
  argTypeBorderColors,
  argTypeDisabled,
  argTypeSize,
  argTypeType,
  BORDER_COLORS_WITH_ERROR,
  BASE_SIZES,
  TYPES_FOR_TEXT_AREA,
} from "lib/utils/constants";

const meta = {
  title: "Components/TextArea",
  component: TextArea,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "TextArea component that provides an enhanced textarea with features like auto-resize, character count display and limit notifications.",
      },
    },
  },
  argTypes: {
    type: argTypeType(TYPES_FOR_TEXT_AREA),
    value: {
      description: "Controlled value of the textarea.",
      control: "text",
      table: {
        type: { summary: "string" },
      },
    },
    label: {
      description: "Label text displayed above the textarea.",
      control: "text",
      table: {
        type: { summary: "string" },
      },
    },
    helperText: {
      description: "Helper text displayed below the textarea.",
      control: "text",
      table: {
        type: { summary: "string" },
      },
    },
    maxLength: {
      description: "Maximum number of characters allowed.",
      control: "number",
      table: {
        type: { summary: "number" },
      },
    },
    showCount: {
      description: "Whether to show character count.",
      control: "boolean",
      table: {
        type: { summary: "boolean" },
      },
    },
    autoResize: {
      description:
        "Whether textarea should automatically resize based on content.",
      control: "boolean",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: "false" },
      },
    },
    size: argTypeSize(BASE_SIZES, "md"),
    disabled: argTypeDisabled(),
    placeholder: {
      description: "Placeholder text when textarea is empty.",
      control: "text",
      table: {
        type: { summary: "string" },
      },
    },
    sendButton: {
      description: "Send button configuration.",
      control: "object",
      table: {
        type: {
          summary:
            "{ icon: ReactNode, onClick: (text: string) => void, label: string, disabled?: boolean }",
        },
      },
    },
    borderColor: argTypeBorderColors(BORDER_COLORS_WITH_ERROR),
    onChange: {
      description: "Callback fired when the textarea value changes.",
    },
    onTextChange: {
      description: "Callback fired with the new text value input.",
    },
    onLimitReached: {
      description: "Callback fired when the text reaches the maxLength.",
    },
    defaultValue: {
      control: "text",
      description: "The initial value of the textarea in uncontrolled mode.",
    },
  },
  args: {
    showCount: false,
    autoResize: false,
    type: "outline",
    size: "md",
    disabled: false,
    borderColor: "base",
    placeholder: "Type your message here...",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Message",
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Message",
    helperText: "Enter your message above",
  },
};

export const Types: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {TYPES_FOR_TEXT_AREA.filter((type) => type !== "glass").map((arg) => (
        <TextArea {...args} key={arg} type={arg} label={`Type ${arg}`} />
      ))}
      <div
        style={{
          background:
            "linear-gradient(135deg, #1f2937 25%, #475569 25%, #475569 50%, #1f2937 50%, #1f2937 75%, #475569 75%)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexDirection: "column",
            padding: "24px",
          }}
        >
          <TextArea {...args} type="glass" label="Glass Type" />
        </div>
      </div>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {BASE_SIZES.map((arg) => (
        <TextArea {...args} key={arg} size={arg} label={`Size ${arg}`} />
      ))}
    </div>
  ),
};

export const BorderColors: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {BORDER_COLORS_WITH_ERROR.map((arg) => (
        <TextArea
          {...args}
          key={arg}
          borderColor={arg}
          label={`Border color ${arg}`}
        />
      ))}
    </div>
  ),
};

export const WithValidation: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      <TextArea
        {...args}
        label="Character Limited"
        maxLength={50}
        showCount
        helperText="Maximum 50 characters allowed"
        placeholder="Try typing to see the character count..."
      />
    </div>
  ),
};

export const AutoResizing: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      <TextArea
        {...args}
        label="Auto-resize Enabled"
        autoResize
        placeholder="Type multiple lines to see the textarea grow..."
        helperText="This textarea will grow with content"
      />
    </div>
  ),
};

export const WithSendButtonVariants: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      <TextArea
        {...args}
        label="Send Message"
        placeholder="Type a message and click send..."
        sendButton={{
          onClick: (text: string) => console.log("Sending:", text),
        }}
      />

      <TextArea
        {...args}
        label="Send Message"
        placeholder="Type a message and click enter key..."
        sendButton={{
          onClick: (text: string) => console.log("Sending:", text),
          sendWithEnter: true,
        }}
      />

      <TextArea
        {...args}
        label="Send Message"
        size={"lg"}
        placeholder="A predefined spinner is shown when loading. You can pass a custom one with loadingElement key..."
        sendButton={{
          onClick: (text: string) => console.log("Sending:", text),
          sendWithEnter: true,
          loading: true,
        }}
      />
    </div>
  ),
};
