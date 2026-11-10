import * as Popover from "@radix-ui/react-popover";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { datePicker, input, type InputVariantProps } from "@styled/recipes";
import React from "react";
import {
  addDays,
  addMonths,
  fromDate,
  maskTyped,
  parseIsoDate,
  parseTypedDate,
  resolveLang,
  toDisplay,
  toIsoDate,
  type Ymd,
} from "./dateUtils";

const TEXT = {
  it: {
    placeholder: "gg/mm/aaaa",
    open: "Apri calendario",
    dialog: "Scegli una data",
    prevMonth: "Mese precedente",
    nextMonth: "Mese successivo",
    prevYear: "Anno precedente",
    nextYear: "Anno successivo",
    today: "Oggi",
    clear: "Cancella",
  },
  en: {
    placeholder: "dd/mm/yyyy",
    open: "Open calendar",
    dialog: "Choose a date",
    prevMonth: "Previous month",
    nextMonth: "Next month",
    prevYear: "Previous year",
    nextYear: "Next year",
    today: "Today",
    clear: "Clear",
  },
} as const;

export type DatePickerProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "defaultValue" | "onChange" | "type" | "min" | "max"
> &
  InputVariantProps & {
    /** *(optional)* Selected day as `YYYY-MM-DD`; empty string or undefined for none. */
    value?: string;

    /** *(optional)* Called with the new day as `YYYY-MM-DD`, or `""` when cleared. */
    onValueChange?: (value: string) => void;

    /** *(optional)* First selectable day, `YYYY-MM-DD`. */
    min?: string;

    /** *(optional)* Last selectable day, `YYYY-MM-DD`. */
    max?: string;

    /** *(optional)* Language of the calendar labels; defaults to the page language. */
    lang?: string;

    /** *(optional)* Class for the text field, replacing the Input field style. */
    fieldClassName?: string;

    /** *(optional)* Class for the calendar button, replacing the Input icon style. */
    iconClassName?: string;
  };

/**
 * A day picker: a text field that takes dd/mm/yyyy (typed or pasted) and a calendar popover.
 * The value is always `YYYY-MM-DD`, the same format as a native date input.
 *
 * Keyboard: Arrow Down opens the calendar; in the grid the arrows move by day and week,
 * Page Up / Page Down by month (with Shift by year), Home / End to the week edges,
 * Enter or Space selects and Escape closes.
 */
export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      value,
      onValueChange,
      min,
      max,
      lang,
      placeholder,
      disabled,
      readOnly,
      fieldClassName,
      iconClassName,
      borderRadius,
      borderColor,
      onKeyDown,
      onClick,
      onBlur,
      className,
      ...props
    },
    ref,
  ) => {
    const classes = datePicker();
    const fieldClasses = input({ borderRadius, borderColor });
    const language = resolveLang(lang);
    const t = TEXT[language];

    const selected = parseIsoDate(value);
    const today = fromDate(new Date());
    const todayIso = toIsoDate(today);

    const [text, setText] = React.useState(() => toDisplay(selected));
    const [prevValue, setPrevValue] = React.useState(value);
    if (value !== prevValue) {
      setPrevValue(value);
      setText(toDisplay(parseIsoDate(value)));
    }

    const [open, setOpen] = React.useState(false);
    const [view, setView] = React.useState<{ y: number; m: number }>({
      y: today.y,
      m: today.m,
    });
    const [focused, setFocused] = React.useState(todayIso);

    const rootRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const dayRefs = React.useRef(new Map<string, HTMLButtonElement>());
    const focusGrid = React.useRef(false);

    const setRefs = (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    const isOutOfRange = (iso: string) =>
      Boolean((min && iso < min) || (max && iso > max));

    const commit = (iso: string) => {
      if (iso !== (selected ? toIsoDate(selected) : "")) onValueChange?.(iso);
    };

    const openCalendar = (withGridFocus: boolean) => {
      if (disabled || readOnly) return;
      const base = selected ?? today;
      setView({ y: base.y, m: base.m });
      setFocused(toIsoDate(base));
      focusGrid.current = withGridFocus;
      setOpen(true);
    };

    const moveFocus = (next: Ymd) => {
      focusGrid.current = true;
      setFocused(toIsoDate(next));
      setView({ y: next.y, m: next.m });
    };

    React.useEffect(() => {
      if (open && focusGrid.current) dayRefs.current.get(focused)?.focus();
    }, [open, focused, view]);

    const selectDay = (iso: string) => {
      if (isOutOfRange(iso)) return;
      setText(toDisplay(parseIsoDate(iso)));
      commit(iso);
      setOpen(false);
      inputRef.current?.focus();
    };

    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const raw = event.target.value.trim();
      // A pasted ISO day is read as is, before the digit mask would scramble it.
      const masked = /^\d{4}-\d{2}-\d{2}$/.test(raw)
        ? raw
        : maskTyped(event.target.value);
      setText(masked);
      if (masked === "") {
        commit("");
        return;
      }
      const typed = parseTypedDate(masked);
      if (typed) {
        if (masked === raw && raw.includes("-")) setText(toDisplay(typed));
        commit(toIsoDate(typed));
        setView({ y: typed.y, m: typed.m });
        setFocused(toIsoDate(typed));
      }
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
      // A partial or invalid entry goes back to the last valid day.
      const typed = parseTypedDate(text);
      setText(typed ? toDisplay(typed) : toDisplay(selected));
      onBlur?.(event);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;
      if (event.key === "ArrowDown" && !open) {
        event.preventDefault();
        openCalendar(true);
      }
    };

    const handleGridKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      const current = parseIsoDate(focused) ?? today;
      const weekday =
        (new Date(current.y, current.m, current.d).getDay() + 6) % 7;
      const moves: Record<string, () => Ymd> = {
        ArrowLeft: () => addDays(current, -1),
        ArrowRight: () => addDays(current, 1),
        ArrowUp: () => addDays(current, -7),
        ArrowDown: () => addDays(current, 7),
        Home: () => addDays(current, -weekday),
        End: () => addDays(current, 6 - weekday),
        PageUp: () => addMonths(current, event.shiftKey ? -12 : -1),
        PageDown: () => addMonths(current, event.shiftKey ? 12 : 1),
      };
      if (moves[event.key]) {
        event.preventDefault();
        moveFocus(moves[event.key]());
      }
    };

    const shiftView = (months: number) => {
      const next = addMonths({ y: view.y, m: view.m, d: 1 }, months);
      focusGrid.current = false;
      setView({ y: next.y, m: next.m });
      const focusedDay = parseIsoDate(focused);
      if (focusedDay) setFocused(toIsoDate(addMonths(focusedDay, months)));
    };

    // Six Monday-first weeks, so the panel never changes height between months.
    const firstOfMonth = new Date(view.y, view.m, 1);
    const offset = (firstOfMonth.getDay() + 6) % 7;
    const days = Array.from({ length: 42 }, (_, i) =>
      fromDate(new Date(view.y, view.m, 1 - offset + i)),
    );
    const weekdayFormat = new Intl.DateTimeFormat(language, {
      weekday: "short",
    });
    const weekdays = Array.from({ length: 7 }, (_, i) =>
      weekdayFormat.format(new Date(2024, 0, 1 + i)).replace(".", ""),
    );
    const title = new Intl.DateTimeFormat(language, {
      month: "long",
      year: "numeric",
    }).format(firstOfMonth);
    const dayLabel = new Intl.DateTimeFormat(language, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    return (
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Anchor asChild>
          <div
            ref={rootRef}
            className={`${classes.root} ${className ?? ""}`.trim()}
          >
            <input
              {...props}
              ref={setRefs}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              data-type="date"
              className={fieldClassName ?? fieldClasses.inputField}
              value={text}
              placeholder={placeholder ?? t.placeholder}
              disabled={disabled}
              readOnly={readOnly}
              maxLength={10}
              onChange={handleTextChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              onClick={(event) => {
                onClick?.(event);
                if (!open) openCalendar(false);
              }}
            />
            <button
              type="button"
              className={iconClassName ?? fieldClasses.iconStyle}
              aria-label={t.open}
              aria-haspopup="dialog"
              aria-expanded={open}
              disabled={disabled || readOnly}
              onClick={() => (open ? setOpen(false) : openCalendar(true))}
            >
              <CalendarIcon />
            </button>
          </div>
        </Popover.Anchor>
        <Popover.Portal>
          <Popover.Content
            className={classes.popoverContent}
            side="bottom"
            align="start"
            sideOffset={4}
            collisionPadding={8}
            aria-label={t.dialog}
            // The portal mounts the content one render after `open`: focus the day from here.
            onOpenAutoFocus={(event) => {
              event.preventDefault();
              if (focusGrid.current) {
                (event.target as HTMLElement)
                  .querySelector<HTMLButtonElement>(
                    '[role="grid"] button[tabindex="0"]',
                  )
                  ?.focus();
              }
            }}
            onCloseAutoFocus={(event) => event.preventDefault()}
            // The field and its button toggle the calendar themselves.
            onInteractOutside={(event) => {
              if (rootRef.current?.contains(event.target as Node))
                event.preventDefault();
            }}
          >
            <div className={classes.header}>
              <button
                type="button"
                aria-label={t.prevYear}
                onClick={() => shiftView(-12)}
              >
                <DoubleArrowLeftIcon />
              </button>
              <button
                type="button"
                aria-label={t.prevMonth}
                onClick={() => shiftView(-1)}
              >
                <ChevronLeftIcon />
              </button>
              <div
                className={classes.title}
                aria-live="polite"
                aria-atomic="true"
              >
                {title}
              </div>
              <button
                type="button"
                aria-label={t.nextMonth}
                onClick={() => shiftView(1)}
              >
                <ChevronRightIcon />
              </button>
              <button
                type="button"
                aria-label={t.nextYear}
                onClick={() => shiftView(12)}
              >
                <DoubleArrowRightIcon />
              </button>
            </div>

            <div className={classes.weekdays} aria-hidden="true">
              {weekdays.map((weekday) => (
                <span key={weekday} className={classes.weekday}>
                  {weekday}
                </span>
              ))}
            </div>

            <div
              role="grid"
              aria-label={title}
              className={classes.grid}
              onKeyDown={handleGridKeyDown}
            >
              {Array.from({ length: 6 }, (_, week) => (
                <div role="row" key={week} style={{ display: "contents" }}>
                  {days.slice(week * 7, week * 7 + 7).map((day) => {
                    const iso = toIsoDate(day);
                    const isSelected =
                      selected !== null && iso === toIsoDate(selected);
                    return (
                      <div
                        role="gridcell"
                        key={iso}
                        style={{ display: "contents" }}
                        aria-selected={isSelected}
                      >
                        <button
                          type="button"
                          ref={(node) => {
                            if (node) dayRefs.current.set(iso, node);
                            else dayRefs.current.delete(iso);
                          }}
                          className={classes.day}
                          tabIndex={iso === focused ? 0 : -1}
                          aria-label={dayLabel.format(
                            new Date(day.y, day.m, day.d),
                          )}
                          aria-current={iso === todayIso ? "date" : undefined}
                          data-selected={isSelected || undefined}
                          data-today={iso === todayIso || undefined}
                          data-outside={day.m !== view.m || undefined}
                          disabled={isOutOfRange(iso)}
                          onClick={() => selectDay(iso)}
                          onFocus={() => setFocused(iso)}
                        >
                          {day.d}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className={classes.footer}>
              <button
                type="button"
                className={classes.footerButton}
                disabled={isOutOfRange(todayIso)}
                onClick={() => selectDay(todayIso)}
              >
                {t.today}
              </button>
              <button
                type="button"
                className={classes.footerButton}
                disabled={!selected}
                onClick={() => {
                  setText("");
                  commit("");
                  setOpen(false);
                  inputRef.current?.focus();
                }}
              >
                {t.clear}
              </button>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    );
  },
);

DatePicker.displayName = "DatePicker";
