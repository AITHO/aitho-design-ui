import {
  ALIGNS,
  argTypeAlign,
  argTypeBorderRadius,
  argTypeChildren,
  argTypeSide,
  argTypeSize,
  argTypeVariant,
  BORDER_RADIUS_SIZES,
  SIDES,
  SIZES_WITH_XL,
  VARIANTS_SECONDARY,
} from "lib/utils/constants";
import { Popover } from "./Popover";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Components/Popover",
  component: Popover,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Displays rich content in a portal, triggered by a button.

### Usage
 
#### Uncontrolled Popover Usage
Use \`defaultOpen\` prop only. The component manages its own state internally. Example:
\`\`\`jsx
<Popover defaultOpen={true} trigger="Open popover">
  <div>Your content here</div>
</Popover>
\`\`\`
 
#### Controlled Popover Usage
Use both \`open\` and \`onOpenChange\` props together. Never mix \`defaultOpen\` with \`open\` or \`onOpenChange\`. The state is managed externally using useState. Example:
\`\`\`jsx
const [open, setOpen] = useState(false);
<Popover
  open={open}
  onOpenChange={setOpen}
  trigger="Click here"
>
  <div>Your content here</div>
</Popover>
\`\`\`
 
**Important:** Never mix controlled and uncontrolled props together as this will cause errors.
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ paddingTop: "80px" }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    trigger: {
      control: "object",
      description: "The element that triggers the popover.",
      table: {
        type: { summary: "React.ReactNode" },
      },
    },
    children: argTypeChildren(),
    align: argTypeAlign("center"),
    arrow: {
      control: "boolean",
      description:
        "An optional arrow element to render alongside the popover. This can be used to help visually link the anchor with the content.",
      table: {
        defaultValue: { summary: "true" },
        type: { summary: "boolean" },
      },
    },
    open: {
      control: "boolean",
      description:
        "Controls the open state of the popover (controlled component).",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    defaultOpen: {
      control: "boolean",
      description:
        "Initial open state of the popover (uncontrolled component).",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    modal: {
      control: "boolean",
      description:
        "The modality of the popover. When set to true, interaction with outside elements will be disabled and only popover content will be visible to screen readers.",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    onOpenChange: {
      description:
        "Callback fired when open state changes (controlled component).",
    },
    side: argTypeSide(),
    variant: argTypeVariant(VARIANTS_SECONDARY, "primary"),
    size: argTypeSize(SIZES_WITH_XL, "md"),
    sideOffset: {
      control: "number",
      description: "The offset of the popover from the side of the trigger.",
      table: {
        defaultValue: { summary: "4" },
        type: { summary: "number" },
      },
    },
    hideWhenDetached: {
      control: "boolean",
      description:
        "Whether to hide the content when the trigger becomes fully occluded.",
      table: {
        defaultValue: { summary: "true" },
        type: { summary: "boolean" },
      },
    },
    borderRadius: argTypeBorderRadius(BORDER_RADIUS_SIZES, "md"),
  },
  args: {
    size: "md",
    variant: "primary",
    borderRadius: "md",
    align: "center",
    arrow: true,
    defaultOpen: false,
    modal: false,
    side: "top",
    sideOffset: 4,
    hideWhenDetached: true,
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  args: {
    trigger: "Click here",
    children: "Default popover content",
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {SIZES_WITH_XL.map((arg) => (
        <Popover {...args} key={arg} trigger={`Size ${arg}`} size={arg}>
          {`Size ${arg}`}
        </Popover>
      ))}
    </div>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {VARIANTS_SECONDARY.map((arg) => (
        <Popover {...args} key={arg} trigger={`Variant ${arg}`} variant={arg}>
          {`Variant ${arg}`}
        </Popover>
      ))}
    </div>
  ),
};

export const SidePosition: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {SIDES.map((arg) => (
        <Popover
          {...args}
          key={arg}
          trigger={`Side position ${arg}`}
          side={arg}
        >
          {`Side position ${arg}`}
        </Popover>
      ))}
    </div>
  ),
};

export const AlignPosition: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {ALIGNS.map((arg) => (
        <Popover
          {...args}
          key={arg}
          trigger={`Align position ${arg}`}
          align={arg}
        >
          {`Align position ${arg}`}
        </Popover>
      ))}
    </div>
  ),
};

export const BorderRadius: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {BORDER_RADIUS_SIZES.map((arg) => (
        <Popover
          {...args}
          key={arg}
          trigger={`Border radius ${arg}`}
          borderRadius={arg}
        >
          {`Border radius ${arg}`}
        </Popover>
      ))}
    </div>
  ),
};

export const ConfirmDelete: Story = {
  render: (args) => (
    <div style={{ paddingTop: "80px" }}>
      <Popover
        {...args}
        trigger={
          <button
            style={{
              background: "red",
              padding: "20px 80px",
              cursor: "pointer",
              color: "white",
              borderRadius: "10px",
            }}
          >
            Delete
          </button>
        }
      >
        <div style={{ textAlign: "center" }}>
          <p>Are you sure you want to delete?</p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              paddingTop: "20px",
            }}
          >
            <button
              style={{
                padding: "8px 30px",
                backgroundColor: "grey",
                color: "black",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              Yes
            </button>
            <button
              style={{
                padding: "8px 30px",
                backgroundColor: "grey",
                color: "black",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              No
            </button>
          </div>
        </div>
      </Popover>
    </div>
  ),
};
