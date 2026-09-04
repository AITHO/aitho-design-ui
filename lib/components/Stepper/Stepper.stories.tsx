import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stepper, Step } from "./Stepper";
import { argTypeOrientation } from "lib/utils/constants";

const meta = {
  title: "Components/Stepper",
  component: Stepper,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A navigation bar that guides users through the steps of a task.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    index: {
      control: "number",
      description: "The active step index.",
    },
    children: {
      control: "object",
      description: "The content of the component.",
      table: {
        type: { summary: "React.ReactElement<StepProps>[]" },
      },
    },
    orientation: argTypeOrientation(),
  },
  args: {
    orientation: "horizontal",
    index: 1,
    children: [
      <Step key="1">Step 1</Step>,
      <Step key="2">Step 2</Step>,
      <Step key="3">Step 3</Step>,
    ],
  },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Vertical: Story = {
  args: {
    orientation: "vertical",
  },
};

export const WithCustomStatus: Story = {
  args: {
    children: [
      <Step
        key="1"
        complete={<span>OK</span>}
        active={<span>...</span>}
        incomplete={<span>?</span>}
      >
        Step 1
      </Step>,
      <Step
        key="2"
        complete={<span>OK</span>}
        active={<span>...</span>}
        incomplete={<span>?</span>}
      >
        Step 2
      </Step>,
      <Step
        key="3"
        complete={<span>OK</span>}
        active={<span>...</span>}
        incomplete={<span>?</span>}
      >
        Step 3
      </Step>,
    ],
  },
};

export const VerticalWithContent: Story = {
  args: {
    orientation: "vertical",
    children: [
      <Step key="1">
        <div>
          <div>Account Creation</div>
          <div>Set up your login credentials and basic account details</div>
        </div>
      </Step>,
      <Step key="2">
        <div>
          <div>Personal Information</div>
          <div>Fill in your personal details and preferences</div>
        </div>
      </Step>,
      <Step key="3">
        <div>
          <div>Review & Submit</div>
          <div>Review your information and complete the process</div>
        </div>
      </Step>,
    ],
  },
};
