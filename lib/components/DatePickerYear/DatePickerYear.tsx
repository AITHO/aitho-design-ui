import {
  Cross1Icon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import * as Popover from "@radix-ui/react-popover";
import {
  datePickerYear,
  type DatePickerYearVariantProps,
} from "@styled/recipes";
import { Button, Input } from "lib/main";
import React, { useCallback, useMemo, useRef, useState } from "react";

export type DatePickerYearProps = {
  /** *(optional)*
   * Actual value in YYYY format.
   */
  value?: number;

  /** *(optional)*
   * Placeholder text displayed in the input field.
   */
  placeholder?: string;

  /** *(optional)*
   * Callback function that is triggered when the input value changes.
   */
  onChange?: (year: number | undefined) => void;

  /** *(optional)*
   * Minimum year that can be selected.
   */
  min?: number;

  /** *(optional)*
   * Maximum year that can be selected.
   */
  max?: number;

  /** *(optional)*
   * Whether the value can be cleared.
   * @default false
   */
  clearable?: boolean;
} & DatePickerYearVariantProps;

/**
 *
 * Provides an input bar to select a year.
 *
 * @param value - *(optional)* Actual value in YYYY format.
 * @param placeholder - *(optional)* Placeholder text displayed in the input field.
 * @param onChange - *(optional)* Callback function that is triggered when the input value changes.
 * @param min - *(optional)* Minimum year that can be selected.
 * @param max - *(optional)* Maximum year that can be selected.
 * @param clearable - *(optional)* Whether the value can be cleared.
 */
export const DatePickerYear: React.FC<DatePickerYearProps> = ({
  value,
  placeholder,
  min,
  max,
  onChange,
  clearable = false,
}) => {
  const classes = datePickerYear();
  const inputRef = useRef<HTMLInputElement>(null);
  const currentYear = new Date().getFullYear();

  const [open, setOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | undefined>(value);
  const [prevValue, setPrevValue] = useState(value);
  const [prevMin, setPrevMin] = useState(min);
  const [prevMax, setPrevMax] = useState(max);

  const calcInitialYearStart = useCallback(() => {
    if (value) {
      return Math.floor(value / 10) * 10 - 1;
    }
    return Math.floor(currentYear / 10) * 10 - 1;
  }, [value, currentYear]);
  const calcInitialYearEnd = useCallback(() => {
    if (value) {
      return Math.floor(value / 10) * 10 + 11;
    }
    return Math.floor(currentYear / 10) * 10 + 11;
  }, [value, currentYear]);
  const [yearStart, setYearStart] = useState<number>(calcInitialYearStart());
  const [yearEnd, setYearEnd] = useState<number>(calcInitialYearEnd());

  // Update state during render when props change
  if (value !== prevValue || min !== prevMin || max !== prevMax) {
    setPrevValue(value);
    setPrevMin(min);
    setPrevMax(max);

    let newVal = value;
    if (newVal !== undefined && min && newVal < min) newVal = min;
    else if (newVal !== undefined && max && newVal > max) newVal = max;

    setSelectedYear(newVal);
    setYearStart(calcInitialYearStart());
    setYearEnd(calcInitialYearEnd());
  }

  const years = useMemo(() => {
    const base = Array.from({ length: 10 }, (_, i) => yearStart + 1 + i);
    return [undefined, ...base, undefined];
  }, [yearStart]);

  const handlePrev = () => {
    setYearStart((prev) => prev - 10);
    setYearEnd((prev) => prev - 10);
  };

  const handleNext = () => {
    setYearStart((next) => next + 10);
    setYearEnd((next) => next + 10);
  };

  const selectYear = (newYear: number) => {
    setSelectedYear(newYear);

    if (onChange) onChange(newYear);

    setOpen(false);
  };

  const clearYear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedYear(undefined);
    onChange?.(undefined);
    inputRef.current?.focus();
  };

  const isDisabled = (year: number) => {
    if (min && year < min) {
      return true;
    }
    if (max && year > max) {
      return true;
    }
    return false;
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          tabIndex={-1}
          style={{ all: "unset", position: "relative" }}
        >
          <Input
            ref={inputRef}
            type="text"
            min={min ?? undefined}
            max={max ?? undefined}
            value={selectedYear}
            placeholder={placeholder}
            readOnly
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setOpen((prev) => !prev);
              }
            }}
          />
          {clearable && selectedYear !== undefined && (
            <button
              type="button"
              className={classes.clearButton}
              onClick={clearYear}
              data-testid="date-picker-year-clear-button"
            >
              <Cross1Icon />
            </button>
          )}
        </button>
      </Popover.Trigger>
      <Popover.Content
        className={classes.popoverContent}
        align="center"
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          inputRef.current?.focus();
        }}
      >
        <div className={classes.header} data-testid="date-picker-year-header">
          <Button
            onClick={() => handlePrev()}
            compact
            borderRadius="pills"
            size="xs"
            variant="transparent"
            icon={{ data: DoubleArrowLeftIcon }}
            disabled={yearStart <= min!}
            type="button"
            data-testid="date-picker-year-prev-button"
          />
          <div className={classes.yearHeader}>
            {`${yearStart + 1} - ${yearEnd - 2}`}
          </div>
          <Button
            onClick={() => handleNext()}
            compact
            borderRadius="pills"
            size="xs"
            variant="transparent"
            icon={{ data: DoubleArrowRightIcon }}
            disabled={yearEnd >= max!}
            type="button"
            data-testid="date-picker-year-next-button"
          />
        </div>
        <div className={classes.yearsGrid}>
          {years.map(
            (year) =>
              year && (
                <Button
                  key={year}
                  compact
                  onClick={() => selectYear(year)}
                  size="xs"
                  variant={
                    year && selectedYear === year ? "primary" : "transparent"
                  }
                  disabled={isDisabled(year)}
                  data-testid="date-picker-year-button"
                >
                  {year}
                </Button>
              ),
          )}
        </div>
      </Popover.Content>
    </Popover.Root>
  );
};
