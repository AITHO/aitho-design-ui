import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LoginButton, type LoginButtonProps } from "./LoginButton";
import "@testing-library/jest-dom";

const renderLoginButton = (props: Partial<LoginButtonProps> = {}) =>
  render(
    <LoginButton provider="google" {...props}>
      {props.children ?? props.provider}
    </LoginButton>,
  );

describe("LoginButton", () => {
  it.each(["google", "microsoft"] as const)(
    "should render with the %s provider",
    (provider) => {
      renderLoginButton({ provider, children: provider });

      const icon = screen.getByRole("img");
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute("alt", provider);

      const paragraph = screen.getByText(provider);
      expect(paragraph).toBeInTheDocument();
    },
  );
});
