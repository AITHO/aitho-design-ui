import { argTypeChildren, LOGIN_PROVIDERS } from "lib/utils/constants";
import { LoginButton } from "./LoginButton";
import type { Meta, StoryObj } from "@storybook/react-vite";

const loginButtonProviders = Object.values(LOGIN_PROVIDERS);

const meta = {
  title: "Components/LoginButton",
  component: LoginButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "A button that performs the login operation.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    provider: {
      description: "The login provider.",
      options: loginButtonProviders,
      control: { type: "select" },
      table: {
        type: { summary: "google | microsoft" },
        defaultValue: { summary: "google" },
      },
    },
    children: argTypeChildren(),
  },
  args: {
    children: "Login",
    provider: "google",
  },
} satisfies Meta<typeof LoginButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Providers: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
      {loginButtonProviders.map((arg) => (
        <LoginButton key={arg} provider={arg}>
          Login with {arg}
        </LoginButton>
      ))}
    </div>
  ),
};
