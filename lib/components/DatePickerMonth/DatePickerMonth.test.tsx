import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { DatePickerMonth, DatePickerMonthProps } from "./DatePickerMonth";

const onChange = vi.fn();

const renderDatePickerMonth = (props: Partial<DatePickerMonthProps> = {}) =>
  render(<DatePickerMonth {...props} />);

describe("DatePickerMonth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render correctly", async () => {
    renderDatePickerMonth();
    fireEvent.click(screen.getByTestId("input"));

    await waitFor(() => {
      expect(screen.getByTestId("date-picker-month-header")).toBeTruthy();
    });
  });

  it("should render with initial value", () => {
    renderDatePickerMonth({ value: "03-2024" });
    expect(screen.getByTestId("input")).toHaveValue("March 2024");

    fireEvent.click(screen.getByTestId("input"));

    expect(screen.getByText("Mar")).toBeTruthy();
  });

  it("should handle year navigation", () => {
    renderDatePickerMonth({ value: "03-2024" });

    fireEvent.click(screen.getByTestId("input"));
    const initialYear = screen.getByText("2024");
    expect(initialYear).toBeTruthy();

    fireEvent.click(screen.getByTestId("date-picker-month-prev-year"));
    expect(screen.getByText("2023")).toBeTruthy();
    fireEvent.click(screen.getByTestId("date-picker-month-next-year"));

    expect(screen.getByText("2024")).toBeTruthy();
  });

  it("should allow selecting a month", () => {
    renderDatePickerMonth({ value: "03-2024" });

    fireEvent.click(screen.getByTestId("input"));
    fireEvent.click(screen.getByText("Apr"));

    expect(screen.getByTestId("input")).toHaveValue("April 2024");
    expect(screen.queryByTestId("date-picker-month-header")).not.toBeTruthy();
  });

  it("should call onChange when month changes", () => {
    renderDatePickerMonth({ value: "03-2024", onChange });

    fireEvent.click(screen.getByTestId("input"));
    fireEvent.click(screen.getByText("Apr"));

    expect(onChange).toHaveBeenCalledWith("04-2024");
  });

  it("should clear the value when clear button is clicked", () => {
    renderDatePickerMonth({ value: "03-2024", clearable: true, onChange });

    expect(screen.getByTestId("input")).toHaveValue("March 2024");
    fireEvent.click(screen.getByTestId("date-picker-month-clear-button"));

    expect(screen.getByTestId("input")).not.toHaveValue();
    expect(onChange).toHaveBeenCalledWith(undefined);
  });

  it("should render months in Italian when lang='it'", () => {
    renderDatePickerMonth({ lang: "it" });

    fireEvent.click(screen.getByTestId("input"));

    expect(screen.getByText("Gen")).toBeTruthy();
    expect(screen.getByText("Mag")).toBeTruthy();
  });

  it("should disable months before min across years (isBefore: year <)", () => {
    renderDatePickerMonth({ min: "03-2024", value: "01-2023" });

    fireEvent.click(screen.getByTestId("input"));

    const monthButtons = screen.getAllByTestId("date-picker-month-button");
    expect(monthButtons[0]).toBeDisabled();
    expect(monthButtons[11]).toBeDisabled();
  });

  it("should disable months before min in the same year (isBefore: same year & month <)", () => {
    renderDatePickerMonth({ min: "06-2024", value: "01-2024" });

    fireEvent.click(screen.getByTestId("input"));

    const monthButtons = screen.getAllByTestId("date-picker-month-button");
    expect(monthButtons[4]).toBeDisabled();
    expect(monthButtons[5]).not.toBeDisabled();
  });

  it("should disable months after max across years (isAfter: year >)", () => {
    renderDatePickerMonth({ max: "03-2024", value: "01-2025" });

    fireEvent.click(screen.getByTestId("input"));

    const monthButtons = screen.getAllByTestId("date-picker-month-button");
    expect(monthButtons[0]).toBeDisabled();
    expect(monthButtons[11]).toBeDisabled();
  });

  it("should disable months after max in the same year (isAfter: same year & month >)", () => {
    renderDatePickerMonth({ max: "06-2024", value: "01-2024" });

    fireEvent.click(screen.getByTestId("input"));

    const monthButtons = screen.getAllByTestId("date-picker-month-button");
    expect(monthButtons[5]).not.toBeDisabled();
    expect(monthButtons[6]).toBeDisabled();
  });
});
