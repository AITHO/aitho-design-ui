import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MonthStepper, MonthStepperProps } from "./MonthStepper";

const renderMonthStepper = (props: Partial<MonthStepperProps> = {}) => {
  const onChange = vi.fn();

  const defaultProps: MonthStepperProps = {
    year: 2026,
    month: 7,
    onChange,
    ...props,
  };

  const utils = render(<MonthStepper {...defaultProps} />);

  return { ...utils, onChange };
};

describe("MonthStepper", () => {
  it("should render the capitalized localized month and year", () => {
    renderMonthStepper({ year: 2026, month: 7, lang: "en" });

    expect(screen.getByText("July 2026")).toBeInTheDocument();
  });

  it("should localize the month label in Italian", () => {
    renderMonthStepper({ year: 2026, month: 7, lang: "it" });

    expect(screen.getByText("Luglio 2026")).toBeInTheDocument();
  });

  it("should move to the previous month", () => {
    const { onChange } = renderMonthStepper({ year: 2026, month: 7 });

    fireEvent.click(screen.getByRole("button", { name: "Previous month" }));

    expect(onChange).toHaveBeenCalledWith(2026, 6);
  });

  it("should move to the next month", () => {
    const { onChange } = renderMonthStepper({ year: 2026, month: 7 });

    fireEvent.click(screen.getByRole("button", { name: "Next month" }));

    expect(onChange).toHaveBeenCalledWith(2026, 8);
  });

  it("should roll back to December of the previous year from January", () => {
    const { onChange } = renderMonthStepper({ year: 2026, month: 1 });

    fireEvent.click(screen.getByRole("button", { name: "Previous month" }));

    expect(onChange).toHaveBeenCalledWith(2025, 12);
  });

  it("should roll over to January of the next year from December", () => {
    const { onChange } = renderMonthStepper({ year: 2026, month: 12 });

    fireEvent.click(screen.getByRole("button", { name: "Next month" }));

    expect(onChange).toHaveBeenCalledWith(2027, 1);
  });

  it("should use custom aria labels for the arrow buttons", () => {
    renderMonthStepper({
      previousLabel: "Mese precedente",
      nextLabel: "Mese successivo",
    });

    expect(
      screen.getByRole("button", { name: "Mese precedente" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Mese successivo" }),
    ).toBeInTheDocument();
  });

  it("should disable both arrows when disabled", () => {
    const { onChange } = renderMonthStepper({ disabled: true });

    const previous = screen.getByRole("button", { name: "Previous month" });
    expect(previous).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next month" })).toBeDisabled();

    fireEvent.click(previous);
    expect(onChange).not.toHaveBeenCalled();
  });
});
