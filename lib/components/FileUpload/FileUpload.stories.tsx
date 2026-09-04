import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileUpload } from "lib/main";
import {
  argTypeBorderColors,
  argTypeBorderRadius,
  argTypeDisabled,
  BORDER_COLORS_WITH_ERROR,
  BORDER_RADIUS_NONE_AND_ROUNDED,
} from "lib/utils/constants";

const meta: Meta<typeof FileUpload> = {
  title: "Components/FileUpload",
  component: FileUpload,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Allows users to upload files with an optional label and error state.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Text to display as the label for the input field.",
    },
    required: {
      control: "boolean",
      description: "Indicates whether the input field is required.",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    errorMessage: {
      control: "text",
      description:
        "Custom error message to display below the input field if validation fails.",
    },
    error: {
      control: "boolean",
      description:
        "Indicates whether the input should be styled with an error state (e.g., red border).",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    placeholder: {
      control: "text",
      description:
        "Text displayed inside the input field when no file has been selected.",
    },
    multiple: {
      control: "boolean",
      description:
        "This indicates whether the input field should allow users to select more than one file at a time.",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    id: {
      control: "text",
      description: "Unique identifier for the input field.",
    },
    onFileDelete: {
      description: "Callback function triggered when a file is removed.",
    },
    disabled: argTypeDisabled(),
    borderRadius: argTypeBorderRadius(
      BORDER_RADIUS_NONE_AND_ROUNDED,
      "rounded",
    ),
    borderColor: argTypeBorderColors(BORDER_COLORS_WITH_ERROR),
    onChange: {
      description:
        "Callback function called when the user does type or interact with the input field.",
    },
  },
  args: {
    label: "File Upload",
    required: false,
    error: false,
    placeholder: "File Upload",
    multiple: false,
    disabled: false,
    borderRadius: "rounded",
    borderColor: "base",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <FileUpload id="file_default" {...args} />,
};

export const MultipleFiles: Story = {
  args: {
    label: "Multiple Files Upload",
    placeholder: "Multiple Files Upload",
    multiple: true,
  },
  render: (args) => <FileUpload id="file_multiple" {...args} />,
};

export const WithError: Story = {
  args: {
    errorMessage: "Invalid file format",
    error: true,
    placeholder: "File Upload error",
  },
  render: (args) => <FileUpload id="file_error" {...args} />,
};
