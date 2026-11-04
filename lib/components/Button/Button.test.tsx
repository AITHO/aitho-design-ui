import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { Button, type ButtonProps } from "./Button";
import "@testing-library/jest-dom";

const MockIcon = () => <svg data-testid="mock-icon" />;

const renderButton = (props: Partial<ButtonProps> = {}) =>
  render(<Button {...props}>{props.children}</Button>);

describe("Button", () => {
  it("should render with children and no icon", () => {
    renderButton({ children: "Click Me" });
    const button = screen.getByRole("button");

    expect(button).toBeInTheDocument();
    expect(button?.className).toContain("button");
    expect(button).toHaveTextContent("Click Me");
  });

  it("should render the icon on the start by default", () => {
    renderButton({
      icon: { data: MockIcon },
      children: "Click Me",
    });
    const button = screen.getByRole("button");

    expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
    expect(button?.firstChild).toHaveAttribute("data-testid", "mock-icon");
    expect(button).toHaveAttribute("data-full-start", "true");
    expect(button).toHaveAttribute("data-full-end", "false");
  });

  it("should render the icon on the end when iconPosition is 'end'", () => {
    renderButton({
      icon: { data: MockIcon },
      iconPosition: "end",
      children: "Click Me",
    });
    const button = screen.getByRole("button");

    expect(button?.lastChild).toHaveAttribute("data-testid", "mock-icon");
    expect(button).toHaveAttribute("data-full-start", "false");
    expect(button).toHaveAttribute("data-full-end", "true");
  });

  it("should render without children or icon", () => {
    renderButton();
    const button = screen.getByRole("button");

    expect(button).toBeInTheDocument();
    expect(button?.textContent).toBe("");
  });

  it("should forward the ref to the button element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Click Me</Button>);

    expect(ref.current).toBe(screen.getByRole("button"));
  });
});
