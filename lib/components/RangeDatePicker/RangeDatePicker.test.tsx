import { fireEvent, render, screen, within } from "@testing-library/react";
import { BASE_SIZES } from "lib/utils/constants";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RangeDatePicker } from "./RangeDatePicker";

const RANGE_DATE_PICKER_TYPES = ["outline", "filled", "ghost"];

const upperCaseFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

const getCurrentMonthYear = (monthOffset = 0, yearOffset = 0) => {
  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() + monthOffset);
  currentDate.setFullYear(currentDate.getFullYear() + yearOffset);

  return {
    month: upperCaseFirstLetter(
      currentDate.toLocaleString("en", { month: "long" }),
    ),
    year: currentDate.getFullYear(),
  };
};

const renderRangeDatePicker = (
  props = {},
  { withOutside = false }: { withOutside?: boolean } = {},
) => {
  render(
    withOutside ? (
      <div>
        <div>Outside</div>
        <RangeDatePicker {...props} />
      </div>
    ) : (
      <RangeDatePicker {...props} />
    ),
  );

  return {
    getRoot: () => {
      const rootElements = document.getElementsByClassName(
        "aitho-rangeDatePicker__root",
      );
      return rootElements[rootElements.length - 1] as HTMLElement;
    },
    getPicker: () => {
      const rootElements = document.getElementsByClassName(
        "aitho-rangeDatePicker__root",
      );
      const root = rootElements[rootElements.length - 1] as HTMLElement;

      return within(root).getByRole("button", { name: /Select date range/i });
    },
    getItalianPicker: () => {
      const rootElements = document.getElementsByClassName(
        "aitho-rangeDatePicker__root",
      );
      const root = rootElements[rootElements.length - 1] as HTMLElement;

      return within(root).getByRole("button", {
        name: /Seleziona intervallo di date/i,
      });
    },
    getValidDays: () => {
      const rootElements = document.getElementsByClassName(
        "aitho-rangeDatePicker__root",
      );
      const root = rootElements[rootElements.length - 1] as HTMLElement;

      return within(root)
        .getAllByRole("button")
        .filter(
          (btn) =>
            btn.hasAttribute("data-selected") &&
            !btn.hasAttribute("data-out-of-month") &&
            !btn.classList.contains("aitho-rangeDatePicker__clearButton"),
        );
    },
    getClearButton: () => {
      const rootElements = document.getElementsByClassName(
        "aitho-rangeDatePicker__root",
      );
      const root = rootElements[rootElements.length - 1] as HTMLElement;

      return within(root)
        .getAllByRole("button")
        .find((btn) => btn.hasAttribute("data-clear-button"));
    },
    getNavigationButtons: () => {
      const rootElements = document.getElementsByClassName(
        "aitho-rangeDatePicker__root",
      );
      const root = rootElements[rootElements.length - 1] as HTMLElement;

      return within(root)
        .getAllByRole("button")
        .filter((btn) =>
          btn.classList.contains("aitho-rangeDatePicker__navigationButton"),
        );
    },
    getYearNavigationButtons: () => {
      const rootElements = document.getElementsByClassName(
        "aitho-rangeDatePicker__root",
      );
      const root = rootElements[rootElements.length - 1] as HTMLElement;

      return within(root)
        .getAllByRole("button")
        .filter((btn) =>
          btn.classList.contains(
            "aitho-rangeDatePicker__superNavigationButton",
          ),
        );
    },
  };
};

const setupDateSelection = () => testUtils.setupDateSelection();

const selectDateRange = (startIndex: number, endIndex: number) => {
  const setup = setupDateSelection();
  const { days, handleChange } = setup;

  fireEvent.click(days[startIndex]);
  fireEvent.click(days[endIndex]);

  return { days, handleChange };
};

const setupRangeSelection = () => {
  const { clearButton, handleChange } = testUtils.setupRangeSelection();
  return { clearButton, handleChange };
};

const testUtils = {
  setupDateSelection() {
    const handleChange = vi.fn();
    const rendered = renderRangeDatePicker({ onChange: handleChange });

    const picker = rendered.getPicker();
    fireEvent.click(picker);

    return {
      rendered,
      handleChange,
      days: rendered.getValidDays(),
    };
  },
  setupRangeSelection() {
    const { rendered, handleChange, days } = this.setupDateSelection();
    fireEvent.click(days[4]);
    fireEvent.click(days[9]);

    return {
      handleChange,
      clearButton: rendered.getClearButton(),
    };
  },
  testStyleClass(prop: string, value: string) {
    const rendered = renderRangeDatePicker({ [prop]: value });
    expect(rendered.getPicker()).toHaveClass(
      `aitho-rangeDatePicker__inputButton--${prop}_${value}`,
    );
  },
};

describe("RangeDatePicker", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render with different types", () => {
    RANGE_DATE_PICKER_TYPES.forEach((type) => {
      testUtils.testStyleClass("type", type);
    });
  });

  it("should render with different sizes", () => {
    BASE_SIZES.forEach((size) => {
      testUtils.testStyleClass("size", size);
    });
  });

  it("should close the calendar when clicking outside", async () => {
    const rendered = renderRangeDatePicker({}, { withOutside: true });

    fireEvent.click(rendered.getPicker());
    expect(screen.getAllByText("Su")).toHaveLength(2);
    fireEvent.mouseDown(screen.getByText("Outside"));
    expect(screen.queryByText("Su")).not.toBeInTheDocument();
  });

  it("should prevent the calendar from opening when disabled", async () => {
    const rendered = renderRangeDatePicker({ disabled: true });

    fireEvent.click(rendered.getPicker());
    expect(screen.queryByText("Su")).not.toBeInTheDocument();
    expect(rendered.getClearButton()).toHaveAttribute("data-disabled", "true");
  });

  it("should navigate to the next month", async () => {
    const rendered = renderRangeDatePicker();

    fireEvent.click(rendered.getPicker());
    fireEvent.click(rendered.getNavigationButtons()[1]);

    const { month, year } = getCurrentMonthYear(1);
    expect(screen.getByText(`${month} ${year}`)).toBeInTheDocument();
  });

  it("should navigate to the next year", async () => {
    const rendered = renderRangeDatePicker();

    fireEvent.click(rendered.getPicker());
    fireEvent.click(rendered.getYearNavigationButtons()[1]);

    const { month, year } = getCurrentMonthYear(0, 1);
    expect(screen.getByText(`${month} ${year}`)).toBeInTheDocument();
  });

  it("should order the selected dates when the end date is clicked before the start date", async () => {
    const { handleChange } = selectDateRange(14, 7);

    const [[startDate, endDate]] = handleChange.mock.lastCall || [];
    expect(startDate?.getTime()).not.toBeNull();
    expect(endDate?.getTime()).not.toBeNull();
    expect(startDate?.getTime()).toBeLessThan(endDate?.getTime());
  });

  const testDateConstraint = async (constraintProp: string, date: Date) => {
    const rendered = renderRangeDatePicker({ [constraintProp]: date });

    fireEvent.click(rendered.getPicker());
    const days = rendered.getValidDays();
    const disabledDays = days.filter((day) => day.hasAttribute("disabled"));

    expect(disabledDays.length).toBeGreaterThan(0);
  };

  it("should handle the min date constraint", async () => {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 5);
    await testDateConstraint("minDate", minDate);
  });

  it("should handle the max date constraint", async () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 5);
    await testDateConstraint("maxDate", maxDate);
  });

  it("should handle disabled dates", async () => {
    const today = new Date();
    const disabledDates = [
      new Date(today.getTime() + 24 * 60 * 60 * 1000),
      new Date(today.getTime() + 48 * 60 * 60 * 1000),
    ];

    const rendered = renderRangeDatePicker({ disabledDates });

    fireEvent.click(rendered.getPicker());
    const days = rendered.getValidDays();
    const disabledDays = days.filter((day) => day.hasAttribute("disabled"));

    expect(disabledDays.length).toBe(2);
  });

  it("should mark the selected range with start and end boundaries", async () => {
    const { days } = selectDateRange(5, 10);

    const inRangeDays = screen
      .getAllByRole("button")
      .filter((btn) => btn.getAttribute("data-in-range") === "true");

    expect(inRangeDays.length).toBe(4);
    expect(days[5]).toHaveAttribute("data-range-start", "true");
    expect(days[10]).toHaveAttribute("data-range-end", "true");
  });

  it("should clear the selected dates when the clear button is clicked", () => {
    const { handleChange, clearButton } = setupRangeSelection();
    if (!clearButton) return;

    fireEvent.click(clearButton);
    expect(handleChange).toHaveBeenLastCalledWith([null, null]);
    expect(screen.getByText("Start date")).toBeInTheDocument();
  });

  it("should clear the selected dates when Enter is pressed on the clear button", () => {
    const { handleChange, clearButton } = setupRangeSelection();
    if (!clearButton) return;

    fireEvent.keyDown(clearButton, { key: "Enter" });
    expect(handleChange).toHaveBeenLastCalledWith([null, null]);
  });

  it("should show the correct Italian month names and weekday abbreviations", async () => {
    const rendered = renderRangeDatePicker({ lang: "it" });

    fireEvent.click(rendered.getItalianPicker());

    const currentMonth = upperCaseFirstLetter(
      new Date().toLocaleString("it", { month: "long" }),
    );
    const currentYear = new Date().getFullYear();

    expect(
      screen.getByText(`${currentMonth} ${currentYear}`),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Do")).toHaveLength(2);
    expect(screen.getAllByText("Lu")).toHaveLength(2);
  });

  it("should navigate to the previous year", async () => {
    const rendered = renderRangeDatePicker();

    fireEvent.click(rendered.getPicker());
    fireEvent.click(rendered.getYearNavigationButtons()[0]);

    const { month, year } = getCurrentMonthYear(0, -1);
    expect(screen.getByText(`${month} ${year}`)).toBeInTheDocument();
  });

  it("should navigate to the previous month across the year boundary", async () => {
    const rendered = renderRangeDatePicker();

    fireEvent.click(rendered.getPicker());

    const previousButton = rendered.getNavigationButtons()[0];
    const clicksToPreviousYear = new Date().getMonth() + 1;

    Array.from({ length: clicksToPreviousYear }).forEach(() => {
      fireEvent.click(previousButton);
    });

    const { month, year } = getCurrentMonthYear(-clicksToPreviousYear);
    expect(screen.getByText(`${month} ${year}`)).toBeInTheDocument();
  });

  it("should navigate to the next month across the year boundary", async () => {
    const rendered = renderRangeDatePicker();

    fireEvent.click(rendered.getPicker());

    const nextButton = rendered.getNavigationButtons()[1];
    const clicksToNextYear = 12 - new Date().getMonth();

    Array.from({ length: clicksToNextYear }).forEach(() => {
      fireEvent.click(nextButton);
    });

    const { month, year } = getCurrentMonthYear(clicksToNextYear);
    expect(screen.getByText(`${month} ${year}`)).toBeInTheDocument();
  });
});
