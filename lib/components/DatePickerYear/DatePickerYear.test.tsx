import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { DatePickerYear, DatePickerYearProps } from "./DatePickerYear";

const onChange = vi.fn();

const renderDatePickerYear = (props: Partial<DatePickerYearProps> = {}) =>
  render(<DatePickerYear {...props} />);

const openDatePickerYear = () => {
  fireEvent.click(screen.getByTestId("input"));
};

describe("DatePickerYear", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render correctly", () => {
    renderDatePickerYear();
    expect(screen.getByTestId("input")).toBeTruthy();

    openDatePickerYear();

    waitFor(() => {
      expect(screen.getByTestId("date-picker-year-header")).toBeTruthy();
    });
  });

  it("should render with the initial year", () => {
    renderDatePickerYear({ value: 1900 });
    expect(screen.getByTestId("input")).toBeTruthy();
    expect(screen.getByTestId("input")).toHaveValue("1900");

    openDatePickerYear();

    waitFor(() => {
      expect(screen.getByTestId("date-picker-year-header")).toBeTruthy();
    });

    expect(screen.getByText("1900")).toBeTruthy();
  });

  it("should handle min and max", () => {
    renderDatePickerYear({ min: 2022, max: 2025 });
    expect(screen.getByTestId("input")).toBeTruthy();
    expect(screen.getByTestId("input")).toHaveAttribute("min", "2022");
    expect(screen.getByTestId("input")).toHaveAttribute("max", "2025");

    openDatePickerYear();

    expect(screen.getByText("2026").parentElement).toBeDisabled();
  });

  it("should handle page changes", () => {
    renderDatePickerYear({ value: 2020 });

    openDatePickerYear();

    fireEvent.click(screen.getByTestId("date-picker-year-prev-button"));

    expect(screen.queryByText("2021")).not.toBeTruthy();
    expect(screen.queryByText("2019")).toBeTruthy();

    fireEvent.click(screen.getByTestId("date-picker-year-next-button"));

    expect(screen.queryByText("2021")).toBeTruthy();
    expect(screen.queryByText("2019")).not.toBeTruthy();
  });

  it.each([
    [undefined, undefined],
    [2020, undefined],
    [undefined, 2022],
  ])(
    "should select a year and call onChange with min %s and max %s",
    (min, max) => {
      renderDatePickerYear({ value: 2020, min, max, onChange });

      openDatePickerYear();

      fireEvent.click(screen.getByText("2021"));

      expect(screen.getByTestId("input")).toHaveValue("2021");
      expect(screen.queryByTestId("date-picker-year-header")).not.toBeTruthy();
      expect(onChange).toHaveBeenCalledWith(2021);
    },
  );

  it("should select a year without onChange", () => {
    renderDatePickerYear({ value: 2020 });

    openDatePickerYear();
    fireEvent.click(screen.getByText("2021"));

    expect(screen.getByTestId("input")).toHaveValue("2021");
    expect(screen.queryByTestId("date-picker-year-header")).not.toBeTruthy();
  });

  it("should update the display when the value prop changes", () => {
    const { rerender } = renderDatePickerYear({ value: 2020 });
    expect(screen.getByTestId("input")).toHaveValue("2020");

    rerender(<DatePickerYear value={2023} />);
    expect(screen.getByTestId("input")).toHaveValue("2023");
  });

  it("should clear the value when the clear button is clicked", () => {
    renderDatePickerYear({ value: 2020, clearable: true, onChange });

    expect(screen.getByTestId("input")).toHaveValue("2020");
    fireEvent.click(screen.getByTestId("date-picker-year-clear-button"));

    expect(screen.getByTestId("input")).not.toHaveValue();
    expect(onChange).toHaveBeenCalledWith(undefined);
  });

  it("should clamp the value to min when min increases above the current value", async () => {
    const { rerender } = renderDatePickerYear({ value: 2020, min: 2010 });
    expect(screen.getByTestId("input")).toHaveValue("2020");

    rerender(<DatePickerYear value={2020} min={2022} />);

    await waitFor(() => {
      expect(screen.getByTestId("input")).toHaveValue("2022");
    });
  });

  it("should clamp the value to max when max decreases below the current value", async () => {
    const { rerender } = renderDatePickerYear({ value: 2030, max: 2050 });
    expect(screen.getByTestId("input")).toHaveValue("2030");

    rerender(<DatePickerYear value={2030} max={2025} />);

    await waitFor(() => {
      expect(screen.getByTestId("input")).toHaveValue("2025");
    });
  });
});
