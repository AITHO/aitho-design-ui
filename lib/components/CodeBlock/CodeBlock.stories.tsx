import type { Meta, StoryObj } from "@storybook/react-vite";
import { CodeBlock } from "./CodeBlock";
import { codeToHtml, bundledLanguages, bundledThemes } from "shiki";
import { CheckCircledIcon, ClipboardCopyIcon } from "@radix-ui/react-icons";
import { argTypeSize, BASE_SIZES } from "lib/utils/constants";

const languages = Object.keys(bundledLanguages);
const themes = Object.keys(bundledThemes);

const sampleTypeScript = `// Generics with 'extends' and default values
function identity<T extends number | string = string>(arg: T): T {
  return arg;
}

let str = identity();  // Default type is string
let num = identity(42);  // T inferred as number`;

const sampleJSX = `function Welcome({ name }) {
  return (
    <div className="welcome">
      <h1>Hello, {name}</h1>
      <p>Welcome to our application!</p>
    </div>
  );
}`;

const meta = {
  title: "Components/CodeBlock",
  component: CodeBlock,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A code block with syntax highlighting. Syntax highlighting is provided via the required `highlighter` prop — pass shiki's `codeToHtml` (or any compatible async function) to enable highlighting.",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ maxHeight: 400 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    lang: {
      control: "select",
      options: languages,
      description: "The programming language for syntax highlighting.",
      table: {
        defaultValue: { summary: "plaintext" },
        type: { summary: "string" },
      },
    },
    theme: {
      control: "select",
      options: themes,
      description:
        "Color theme name passed to the highlighter function. When using shiki, this must be a valid shiki theme name.",
      table: {
        type: { summary: "string" },
      },
    },
    highlighter: {
      control: false,
      description:
        "Async function `(code, lang, theme) => Promise<string>` that returns highlighted HTML. Typically shiki's `codeToHtml`.",
      table: {
        type: {
          summary:
            "(code: string, lang: string, theme: string) => Promise<string>",
        },
      },
    },
    copyButtonContent: {
      control: "object",
      description: "Copy button content.",
      table: {
        type: { summary: "React.ReactNode" },
        defaultValue: { summary: "<ClipboardCopyIcon />" },
      },
    },
    copiedIcon: {
      control: "object",
      description: "Icon to show when code is copied.",
      table: {
        defaultValue: { summary: "<CheckIcon />" },
        type: { summary: "React.ReactNode" },
      },
    },
    showLineNumbers: {
      control: "boolean",
      description: "Whether to show line numbers.",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    },
    size: argTypeSize(BASE_SIZES, "md"),
    timeoutCopyFeedback: {
      control: "number",
      description: "Timeout duration for copy feedback in milliseconds.",
      table: {
        defaultValue: { summary: "1000" },
      },
    },
  },
  args: {
    size: "md",
    showLineNumbers: false,
    timeoutCopyFeedback: 1000,
    copiedIcon: <CheckCircledIcon />,
    copyButtonContent: <ClipboardCopyIcon />,
    code: sampleTypeScript,
    lang: "plaintext",
    highlighter: (code, lang, theme) => codeToHtml(code, { lang, theme }),
  },
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithTypescript: Story = {
  args: {
    lang: "typescript",
  },
};

export const WithLineNumbers: Story = {
  args: {
    showLineNumbers: true,
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {BASE_SIZES.map((arg) => (
        <CodeBlock {...args} key={arg} size={arg} />
      ))}
    </div>
  ),
  args: {},
};

export const WithCustomCopyFeedback: Story = {
  args: {
    timeoutCopyFeedback: 2000,
  },
};

export const JSXExample: Story = {
  args: {
    code: sampleJSX,
    lang: "jsx",
    showLineNumbers: true,
  },
};
