import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { Checkbox, CheckboxProps } from "./Checkbox";

const renderCheckbox = (props: Partial<CheckboxProps> = {}) =>
  render(<Checkbox {...props}>{props.children}</Checkbox>);

describe("Checkbox", () => {
  it("should render with default variants", () => {
    renderCheckbox();
    const root = screen.getByRole("checkbox");

    expect(root?.className).toContain("checkbox");
    expect(root?.className).toContain("sm");
    expect(root?.className).toContain("primary");
  });

  it("should render with required=true and apply 'primary' as the required variant", () => {
    renderCheckbox({ required: true, children: "Required True" });
    const root = screen.getByRole("checkbox");

    expect(root.className).toContain("primary");
  });

  it("should render with a square icon", () => {
    renderCheckbox({ squareIcon: true, defaultChecked: true });
    const root = screen.getByRole("checkbox");

    const squareIcon = root.querySelector("[class*='checkbox__squareIcon']");
    expect(squareIcon).not.toBeNull();
  });

  it("should forward the ref to the checkbox element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Checkbox ref={ref} />);

    expect(ref.current).toBe(screen.getByRole("checkbox"));
  });
});
