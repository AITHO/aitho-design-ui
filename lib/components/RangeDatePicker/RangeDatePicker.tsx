import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarIcon,
  Cross1Icon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  TriangleRightIcon,
} from "@radix-ui/react-icons";
import {
  rangeDatePicker,
  RangeDatePickerRecipe,
  RangeDatePickerVariantProps,
} from "@styled/recipes";
import React from "react";

const daysObject = {
  it: ["Do", "Lu", "Ma", "Me", "Gi", "Ve", "Sa"],
  en: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
};

const monthObject = {
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

export type RangeDatePickerProps = RangeDatePickerVariantProps & {
  /** *(optional)*
   * Callback function to handle date range changes.
   */
  onChange?: (dates: [Date | null, Date | null]) => void;

  /** *(optional)*
   * Array of dates to be disabled.
   * @default []
   */
  disabledDates?: Date[];

  /** *(optional)*
   * Whether to disable the picker.
   * @default false
   */
  disabled?: boolean;

  /** *(optional)*
   * Minimum selectable date.
   */
  minDate?: Date;

  /** *(optional)*
   * Maximum selectable date.
   */
  maxDate?: Date;

  /** *(optional)*
   * Language code for localization.
   * @default "en"
   */
  lang?: "it" | "en";
} & React.HTMLAttributes<HTMLDivElement>;

interface MonthCalendarProps {
  /** Selected month. */
  month: number;

  /** Selected year. */
  year: number;

  /** Selected dates. */
  selectedDates: [Date | null, Date | null];

  /** Callback function to handle date selected. */
  onSelect: (date: Date) => void;

  /** *(optional)*
   * Array of dates to be disabled.
   * @default []
   */
  disabledDates?: Date[];

  /** *(optional)*
   * Minimum selectable date.
   */
  minDate?: Date;

  /** *(optional)*
   * Maximum selectable date.
   */
  maxDate?: Date;

  /** *(optional)*
   * Language code for localization.
   * @default "en"
   */
  lang?: "it" | "en";

  /** Style. */
  classes: ReturnType<RangeDatePickerRecipe>;
}

const MonthCalendar: React.FC<MonthCalendarProps> = ({
  month,
  year,
  selectedDates,
  onSelect,
  disabledDates = [],
  minDate,
  maxDate,
  classes,
  lang = "en",
}) => {
  const DAYS = daysObject[lang];
  const DAY_FULL_NAMES =
    lang === "it"
      ? [
          "Domenica",
          "Lunedì",
          "Martedì",
          "Mercoledì",
          "Giovedì",
          "Venerdì",
          "Sabato",
        ]
      : [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
  const locale = lang === "it" ? "it-IT" : "en-US";
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isDateDisabled = (date: Date): boolean => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return disabledDates.some(
      (disabled) =>
        disabled.getDate() === date.getDate() &&
        disabled.getMonth() === date.getMonth() &&
        disabled.getFullYear() === date.getFullYear(),
    );
  };

  const isDateSelected = (date: Date): boolean => {
    const [start, end] = selectedDates;
    if (!start && !end) return false;
    return (
      start?.getTime() === date.getTime() || end?.getTime() === date.getTime()
    );
  };

  const isInRange = (date: Date): boolean => {
    const [start, end] = selectedDates;
    if (!start || !end) return false;
    return date > start && date < end;
  };

  const isRangeStart = (date: Date): boolean => {
    const [start] = selectedDates;
    return start?.getTime() === date.getTime();
  };

  const isRangeEnd = (date: Date): boolean => {
    const [, end] = selectedDates;
    return end?.getTime() === date.getTime();
  };

  const getRangeLabel = (
    isRangeStartDate: boolean,
    isRangeEndDate: boolean,
    isInRangeDate: boolean,
  ) => {
    if (isRangeStartDate) {
      return lang === "it" ? ", data di inizio" : ", start date";
    }
    if (isRangeEndDate) {
      return lang === "it" ? ", data di fine" : ", end date";
    }
    if (isInRangeDate) {
      return lang === "it"
        ? ", nel periodo selezionato"
        : ", in selected range";
    }
    return "";
  };

  const getTodayLabel = (isTodayDate: boolean) => {
    if (!isTodayDate) return "";
    return lang === "it" ? ", oggi" : ", today";
  };

  const renderDays = () => {
    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = getFirstDayOfMonth(month, year);
    const days = [];

    for (let i = firstDay - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push(
        <span
          key={`prev-${i}`}
          className={classes.day}
          aria-hidden="true"
          data-out-of-month="true"
        >
          {prevDate.getDate()}
        </span>,
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isDisabled = isDateDisabled(date);
      const isRangeStartDate = isRangeStart(date);
      const isRangeEndDate = isRangeEnd(date);
      const isInRangeDate = isInRange(date);
      const isSelectedDate = isDateSelected(date);
      const isTodayDate = isToday(date);
      const fullDateLabel = date.toLocaleDateString(locale, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      const rangeLabel = getRangeLabel(
        isRangeStartDate,
        isRangeEndDate,
        isInRangeDate,
      );
      const todayLabel = getTodayLabel(isTodayDate);
      days.push(
        <button
          key={day}
          onClick={() => !isDisabled && onSelect(date)}
          className={classes.day}
          disabled={isDisabled}
          aria-label={`${fullDateLabel}${todayLabel}${rangeLabel}`}
          aria-disabled={isDisabled}
          data-selected={isSelectedDate}
          data-in-range={isInRangeDate}
          data-range-start={isRangeStartDate}
          data-range-end={isRangeEndDate}
          data-today={isTodayDate}
          data-disabled={isDisabled}
        >
          {day}
        </button>,
      );
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push(
        <span
          key={`next-${i}`}
          className={classes.day}
          aria-hidden="true"
          data-out-of-month="true"
        >
          {i}
        </span>,
      );
    }

    return days;
  };

  return (
    <div className={classes.monthContainer}>
      <div role="grid" className={classes.daysGrid}>
        {DAYS.map((day, i) => (
          <div
            key={day}
            aria-label={DAY_FULL_NAMES[i]}
            className={classes.dayHeader}
          >
            {day}
          </div>
        ))}
        {renderDays()}
      </div>
    </div>
  );
};

/**
 * RangeDatePicker component providing a dual-calendar interface for selecting date ranges with features like localization, min/max dates and disabled dates.
 *
 * @param onChange - *(optional)* Callback function to handle date range changes.
 * @param disabledDates - *(optional)* Array of dates to be disabled.
 * @param disabled - *(optional)* Whether to disable the picker.
 * @param minDate - *(optional)* Minimum selectable date.
 * @param maxDate - *(optional)* Maximum selectable date.
 * @param lang - *(optional)* Language code for localization. Options: 'it', 'en'.
 * @param size - *(optional)* The size of the component. Options: 'xs', 'md', 'lg'.
 * @param type - *(optional)* The variant of the component. Options: 'outline', 'filled', 'ghost'.
 */

export const RangeDatePicker = ({
  onChange,
  disabledDates = [],
  disabled = false,
  minDate,
  maxDate,
  lang = "en",
  size,
  type,
}: RangeDatePickerProps) => {
  const MONTHS = monthObject[lang];
  const [isOpen, setIsOpen] = React.useState(false);
  const [leftMonth, setLeftMonth] = React.useState(new Date().getMonth());
  const [leftYear, setLeftYear] = React.useState(new Date().getFullYear());
  const [selectedDates, setSelectedDates] = React.useState<
    [Date | null, Date | null]
  >([null, null]);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLButtonElement>(null);
  const calendarRef = React.useRef<HTMLDialogElement>(null);

  const prevIsOpen = React.useRef(false);

  React.useEffect(() => {
    if (!prevIsOpen.current && isOpen) {
      const todayButton = calendarRef.current?.querySelector<HTMLButtonElement>(
        '[data-today="true"]',
      );
      todayButton?.focus();
    }
    if (prevIsOpen.current && !isOpen) {
      inputRef.current?.focus();
    }
    prevIsOpen.current = isOpen;
  }, [isOpen]);

  const placeholder =
    lang === "it"
      ? ["Data di inizio", "Data di fine"]
      : ["Start date", "End date"];

  const rightMonth = leftMonth + 1 > 11 ? 0 : leftMonth + 1;
  const rightYear = leftMonth + 1 > 11 ? leftYear + 1 : leftYear;

  const classes = rangeDatePicker({ size, type });

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  React.useEffect(() => {
    onChange?.(selectedDates);
  }, [selectedDates, onChange]);

  const handleDateSelect = (date: Date) => {
    const [start, end] = selectedDates;
    if (!start || end) {
      setSelectedDates([date, null]);
      return;
    }

    if (date < start) {
      setSelectedDates([date, start]);
    } else {
      setSelectedDates([start, date]);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(lang, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getInputAriaLabel = () => {
    if (selectedDates[0] && selectedDates[1]) {
      const selectedRangeLabel =
        lang === "it" ? "Intervallo selezionato" : "Selected range";
      return `${selectedRangeLabel}: ${formatDate(selectedDates[0])} - ${formatDate(selectedDates[1])}`;
    }

    if (selectedDates[0]) {
      const startDateLabel = lang === "it" ? "Data inizio" : "Start date";
      const selectEndDateLabel =
        lang === "it" ? "seleziona data fine" : "select end date";
      return `${startDateLabel}: ${formatDate(selectedDates[0])}, ${selectEndDateLabel}`;
    }

    return lang === "it" ? "Seleziona intervallo di date" : "Select date range";
  };

  const hasSelectedDates =
    selectedDates[0] !== null || selectedDates[1] !== null;
  const startDateText = selectedDates[0]
    ? formatDate(selectedDates[0])
    : placeholder[0];
  const endDateText = selectedDates[1]
    ? formatDate(selectedDates[1])
    : placeholder[1];

  const handlePrevMonth = React.useCallback(() => {
    const newMonth = leftMonth - 1;
    if (newMonth < 0) {
      setLeftMonth(11);
      setLeftYear((prev) => prev - 1);
      return;
    }
    setLeftMonth(newMonth);
  }, [leftMonth]);

  const handleNextMonth = React.useCallback(() => {
    const newMonth = leftMonth + 1;
    if (newMonth > 11) {
      setLeftMonth(0);
      setLeftYear((prev) => prev + 1);
      return;
    }
    setLeftMonth(newMonth);
  }, [leftMonth]);

  return (
    <div ref={wrapperRef} className={classes.root}>
      <div className={classes.input} data-disabled={disabled}>
        <button
          ref={inputRef}
          type="button"
          className={classes.inputButton}
          disabled={disabled}
          aria-label={getInputAriaLabel()}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
        >
          <div className={classes.inputContent}>
            <CalendarIcon className={classes.inputIcon} />
            <span className={classes.inputText}>{startDateText}</span>
            <TriangleRightIcon />
            <span className={classes.inputText}>{endDateText}</span>
          </div>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (disabled) return;
            setSelectedDates([null, null]);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              if (disabled) return;
              setSelectedDates([null, null]);
            }
          }}
          disabled={selectedDates[0] === null || disabled}
          tabIndex={hasSelectedDates ? 0 : -1}
          aria-label={lang === "it" ? "Cancella selezione" : "Clear selection"}
          data-disabled={selectedDates[0] === null || disabled}
          className={classes.clearButton}
          data-clear-button={hasSelectedDates}
        >
          <Cross1Icon />
        </button>
      </div>

      {isOpen && (
        <dialog
          ref={calendarRef}
          className={classes.calendar}
          open
          aria-label={lang === "it" ? "Calendario" : "Calendar"}
        >
          <div className={classes.monthContainer}>
            <div className={classes.monthHeader}>
              <div className={classes.buttonContainer}>
                <button
                  onClick={() => setLeftYear((prev) => prev - 1)}
                  className={classes.superNavigationButton}
                  aria-label={
                    lang === "it" ? "Anno precedente" : "Previous year"
                  }
                >
                  <DoubleArrowLeftIcon className={classes.navigationIcon} />
                </button>
                <button
                  onClick={() => {
                    handlePrevMonth();
                  }}
                  className={classes.navigationButton}
                  aria-label={
                    lang === "it" ? "Mese precedente" : "Previous month"
                  }
                >
                  <ArrowLeftIcon className={classes.navigationIcon} />
                </button>
              </div>
              <span
                className={classes.monthTitle}
                aria-live="polite"
                aria-atomic="true"
              >
                {MONTHS[leftMonth]} {leftYear}
              </span>
            </div>
            <MonthCalendar
              lang={lang}
              month={leftMonth}
              year={leftYear}
              selectedDates={selectedDates}
              onSelect={handleDateSelect}
              disabledDates={disabledDates}
              minDate={minDate}
              maxDate={maxDate}
              classes={classes}
            />
          </div>

          <div className={classes.monthContainer}>
            <div className={classes.monthHeader}>
              <span
                className={classes.monthTitle}
                aria-live="polite"
                aria-atomic="true"
              >
                {MONTHS[rightMonth]} {rightYear}
              </span>
              <div className={classes.buttonContainer}>
                <button
                  onClick={() => {
                    handleNextMonth();
                  }}
                  className={classes.navigationButton}
                  aria-label={lang === "it" ? "Mese successivo" : "Next month"}
                >
                  <ArrowRightIcon className={classes.navigationIcon} />
                </button>
                <button
                  onClick={() => setLeftYear((prev) => prev + 1)}
                  className={classes.superNavigationButton}
                  aria-label={lang === "it" ? "Anno successivo" : "Next year"}
                >
                  <DoubleArrowRightIcon className={classes.navigationIcon} />
                </button>
              </div>
            </div>
            <MonthCalendar
              lang={lang}
              month={rightMonth}
              year={rightYear}
              selectedDates={selectedDates}
              onSelect={handleDateSelect}
              disabledDates={disabledDates}
              minDate={minDate}
              maxDate={maxDate}
              classes={classes}
            />
          </div>
        </dialog>
      )}
    </div>
  );
};
