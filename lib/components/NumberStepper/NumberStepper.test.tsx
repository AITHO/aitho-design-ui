import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { NumberStepper, NumberStepperProps } from "./NumberStepper";

const renderNumberStepper = (props: Partial<NumberStepperProps> = {}) => {
  const onChange = vi.fn();

  const defaultProps: NumberStepperProps = {
    value: 4,
    onChange,
    label: "Hours",
    ...props,
  };

  const utils = render(<NumberStepper {...defaultProps} />);

  return { ...utils, onChange };
};

describe("NumberStepper", () => {
  it("should render the current value", () => {
    renderNumberStepper({ value: 4 });

    expect(screen.getByRole("textbox", { name: "Hours" })).toHaveValue("4");
  });

  it("should increment by step when the plus button is clicked", () => {
    const { onChange } = renderNumberStepper({ value: 4, step: 0.5 });

    fireEvent.click(screen.getByRole("button", { name: "Hours: +0.5" }));

    expect(onChange).toHaveBeenCalledWith(4.5);
  });

  it("should decrement by step when the minus button is clicked", () => {
    const { onChange } = renderNumberStepper({ value: 4, step: 0.5 });

    fireEvent.click(screen.getByRole("button", { name: "Hours: −0.5" }));

    expect(onChange).toHaveBeenCalledWith(3.5);
  });

  it("should disable the minus button at min and the plus button at max", () => {
    renderNumberStepper({ value: 8, min: 0, max: 8 });

    expect(screen.getByRole("button", { name: "Hours: −0.5" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Hours: +0.5" })).toBeDisabled();
  });

  it("should not exceed max when incrementing", () => {
    const { onChange } = renderNumberStepper({ value: 7.8, max: 8 });

    fireEvent.click(screen.getByRole("button", { name: "Hours: +0.5" }));

    expect(onChange).toHaveBeenCalledWith(8);
  });

  it("should commit a typed value on blur, accepting comma decimals", () => {
    const { onChange } = renderNumberStepper({ value: 4 });

    const input = screen.getByRole("textbox", { name: "Hours" });
    fireEvent.change(input, { target: { value: "6,5" } });
    fireEvent.blur(input);

    expect(onChange).toHaveBeenCalledWith(6.5);
  });

  it("should commit a typed value on Enter", () => {
    const { onChange } = renderNumberStepper({ value: 4 });

    const input = screen.getByRole("textbox", { name: "Hours" });
    fireEvent.change(input, { target: { value: "7.5" } });
    fireEvent.keyDown(input, { key: "Enter" });
    fireEvent.blur(input);

    expect(onChange).toHaveBeenCalledWith(7.5);
  });

  it("should clamp typed values to the min/max range", () => {
    const { onChange } = renderNumberStepper({ value: 4, min: 0, max: 8 });

    const input = screen.getByRole("textbox", { name: "Hours" });
    fireEvent.change(input, { target: { value: "99" } });
    fireEvent.blur(input);

    expect(onChange).toHaveBeenCalledWith(8);
  });

  it("should restore the previous value when the typed text is not a number", () => {
    const { onChange } = renderNumberStepper({ value: 4 });

    const input = screen.getByRole("textbox", { name: "Hours" });
    fireEvent.change(input, { target: { value: "abc" } });
    fireEvent.blur(input);

    expect(onChange).not.toHaveBeenCalled();
    expect(input).toHaveValue("4");
  });

  it("should disable both buttons and the input when disabled", () => {
    renderNumberStepper({ disabled: true });

    expect(screen.getByRole("textbox", { name: "Hours" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Hours: −0.5" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Hours: +0.5" })).toBeDisabled();
  });

  it("should expose the active state through a data attribute", () => {
    const { container } = renderNumberStepper({ active: true });

    expect(container.firstChild).toHaveAttribute("data-active", "true");
  });
});
