import * as Popover from "@radix-ui/react-popover";
import {
  datePickerMonth,
  type DatePickerMonthVariantProps,
} from "@styled/recipes";
import React, { useMemo, useRef, useState } from "react";

import { Button, Input } from "lib/main";

import {
  Cross1Icon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";

export type DatePickerMonthProps = {
  /** *(optional)*
   * Actual value in MM-YYYY format.
   */
  value?: string;

  /** *(optional)*
   * Placeholder text displayed in the input field.
   */
  placeholder?: string;

  /** *(optional)*
   * Callback function that is triggered when the input value changes.
   */
  onChange?: (value: string | undefined) => void;

  /** *(optional)*
   * Minimum month and year that can be selected, in MM-YYYY format.
   */
  min?: string;

  /** *(optional)*
   * Maximum month and year that can be selected, in MM-YYYY format.
   */
  max?: string;

  /** *(optional)*
   * Whether the value can be cleared.
   * @default false
   */
  clearable?: boolean;

  /** *(optional)*
   * Language code for localization.
   * @default "en"
   */
  lang?: "it" | "en";
} & DatePickerMonthVariantProps;

const monthObject = {
  it: [
    "Gen",
    "Feb",
    "Mar",
    "Apr",
    "Mag",
    "Giu",
    "Lug",
    "Ago",
    "Set",
    "Ott",
    "Nov",
    "Dic",
  ],
  en: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
};

const monthFullObject = {
  it: [
    "Gennaio",
    "Febbraio",
    "Marzo",
    "Aprile",
    "Maggio",
    "Giugno",
    "Luglio",
    "Agosto",
    "Settembre",
    "Ottobre",
    "Novembre",
    "Dicembre",
  ],
  en: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
};

interface InternalMonth {
  year: number;
  month: number;
}

/**
 *
 * Provides an input bar to select a month and year.
 *
 * @param value - *(optional)* Actual value in MM-YYYY format.
 * @param placeholder - *(optional)* Placeholder text displayed in the input field.
 * @param onChange - *(optional)* Callback function that is triggered when the input value changes.
 * @param min - *(optional)* Minimum month and year that can be selected, in MM-YYYY format.
 * @param max - *(optional)* Maximum month and year that can be selected, in MM-YYYY format.
 * @param clearable - *(optional)* Whether the value can be cleared.
 * @param lang - *(optional)* Language code for localization. Options: 'it', 'en'.
 */
export const DatePickerMonth: React.FC<DatePickerMonthProps> = ({
  value,
  placeholder,
  onChange,
  min,
  max,
  clearable = false,
  lang = "en",
}) => {
  const classes = datePickerMonth();
  const inputRef = useRef<HTMLInputElement>(null);
  const today = new Date();
  const currentYear = today.getFullYear();

  const months = lang === "it" ? monthObject.it : monthObject.en;
  const monthsFull = lang === "it" ? monthFullObject.it : monthFullObject.en;
  const locale = lang === "it" ? "it-IT" : "en-US";

  const parseValue = (val?: string): InternalMonth | undefined => {
    if (!val) return;

    const [m, y] = val.split("-");
    return {
      month: Number(m) - 1,
      year: Number(y),
    };
  };

  const formatValue = (val: InternalMonth) => {
    const month = String(val.month + 1).padStart(2, "0");
    return `${month}-${val.year}`;
  };

  const minDate = parseValue(min);
  const maxDate = parseValue(max);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<InternalMonth | undefined>(
    parseValue(value),
  );

  const [viewYear, setViewYear] = useState<number>(
    parseValue(value)?.year ?? currentYear,
  );

  // Value displayed in input
  const displayValue = useMemo(() => {
    if (!selected) return "";

    const date = new Date(selected.year, selected.month);
    const formatted = new Intl.DateTimeFormat(locale, {
      month: "long",
      year: "numeric",
    }).format(date);

    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }, [selected, locale]);

  const handlePrev = () => {
    setViewYear((prev) => prev - 1);
  };

  const handleNext = () => {
    setViewYear((next) => next + 1);
  };

  const selectMonth = (month: number) => {
    const newValue = {
      year: viewYear,
      month,
    };

    setSelected(newValue);

    if (onChange) {
      onChange(formatValue(newValue));
    }

    setOpen(false);
  };

  const clearMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected(undefined);
    onChange?.(undefined);
    inputRef.current?.focus();
  };

  const isBefore = (a: InternalMonth, b: InternalMonth) => {
    if (a.year < b.year) return true;
    else if (a.year === b.year && a.month < b.month) return true;
    else return false;
  };

  const isAfter = (a: InternalMonth, b: InternalMonth) => {
    if (a.year > b.year) return true;
    else if (a.year === b.year && a.month > b.month) return true;
    else return false;
  };

  const isPrevYearDisabled = () => {
    if (!minDate) return false;
    return viewYear - 1 < minDate.year;
  };

  const isNextYearDisabled = () => {
    if (!maxDate) return false;
    return viewYear + 1 > maxDate.year;
  };

  const isDisabled = (year: number, month: number) => {
    const current = { year, month };

    if (minDate && isBefore(current, minDate)) {
      return true;
    }

    if (maxDate && isAfter(current, maxDate)) {
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
            value={displayValue}
            placeholder={placeholder}
            readOnly
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setOpen((prev) => !prev);
              }
            }}
          />
          {clearable && selected !== undefined && (
            <button
              type="button"
              className={classes.clearButton}
              onClick={clearMonth}
              data-testid="date-picker-month-clear-button"
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
        <div className={classes.header} data-testid="date-picker-month-header">
          <Button
            onClick={() => handlePrev()}
            compact
            borderRadius="pills"
            size="xs"
            variant="transparent"
            icon={{ data: DoubleArrowLeftIcon }}
            disabled={isPrevYearDisabled()}
            type="button"
            aria-label={lang === "it" ? "Anno precedente" : "Previous year"}
            data-testid="date-picker-month-prev-year"
          />
          <div
            className={classes.yearHeader}
            aria-live="polite"
            aria-atomic="true"
          >
            {viewYear}
          </div>
          <Button
            onClick={() => handleNext()}
            compact
            borderRadius="pills"
            size="xs"
            variant="transparent"
            icon={{ data: DoubleArrowRightIcon }}
            disabled={isNextYearDisabled()}
            type="button"
            aria-label={lang === "it" ? "Anno successivo" : "Next year"}
            data-testid="date-picker-month-next-year"
          />
        </div>
        <div className={classes.monthGrid}>
          {months.map((month, i) => (
            <Button
              key={month}
              compact
              size="xs"
              onClick={() => selectMonth(i)}
              aria-label={`${monthsFull[i]} ${viewYear}`}
              variant={
                selected && selected.year === viewYear && selected.month === i
                  ? "primary"
                  : "transparent"
              }
              disabled={isDisabled(viewYear, i)}
              data-testid="date-picker-month-button"
            >
              {month}
            </Button>
          ))}
        </div>
      </Popover.Content>
    </Popover.Root>
  );
};
