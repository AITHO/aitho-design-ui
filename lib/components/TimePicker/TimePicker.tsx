import * as Popover from "@radix-ui/react-popover";
import { ClockIcon } from "@radix-ui/react-icons";
import { input, timePicker, type InputVariantProps } from "@styled/recipes";
import React from "react";
import {
  formatTime,
  maskTypedTime,
  parseTime,
  parseTypedTime,
} from "./timeUtils";

export type TimePickerProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "defaultValue" | "onChange" | "type" | "min" | "max" | "step"
> &
  InputVariantProps & {
    /** *(optional)* Selected time as `HH:mm`; empty string or undefined for none. */
    value?: string;

    /** *(optional)* Called with the new time as `HH:mm`, or `""` when cleared. */
    onValueChange?: (value: string) => void;

    /** *(optional)* Minutes between the times offered in the list (typing accepts any minute). */
    step?: number;

    /** *(optional)* Earliest time, `HH:mm`. */
    min?: string;

    /** *(optional)* Latest time, `HH:mm`. */
    max?: string;

    /** *(optional)* Language of the labels; defaults to the page language. */
    lang?: string;

    /** *(optional)* Class for the text field, replacing the Input field style. */
    fieldClassName?: string;

    /** *(optional)* Class for the clock button, replacing the Input icon style. */
    iconClassName?: string;
  };

const TEXT = {
  it: {
    placeholder: "hh:mm",
    open: "Scegli l'ora",
    list: "Orari",
    outOfRange: "Ora fuori dall'intervallo consentito",
  },
  en: {
    placeholder: "hh:mm",
    open: "Choose a time",
    list: "Times",
    outOfRange: "Time outside the allowed range",
  },
} as const;

/**
 * A time picker: a text field that takes hh:mm and a popover listing the times every `step`
 * minutes. The value is `HH:mm`, the same format as a native time input; with a `name`, a hidden
 * field carries it in a form. A typed time outside `min`/`max` is not applied: the field is
 * marked invalid, and leaving it puts the last valid time back.
 * Keyboard: Arrow Down opens the list; Arrow Up / Down, Home / End move; Enter selects.
 */
export const TimePicker = React.forwardRef<HTMLInputElement, TimePickerProps>(
  (
    {
      value,
      onValueChange,
      step = 15,
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
      name,
      form,
      ...props
    },
    ref,
  ) => {
    const classes = timePicker();
    const fieldClasses = input({ borderRadius, borderColor });
    const language = (
      lang ||
      (typeof document !== "undefined" ? document.documentElement.lang : "")
    )
      .toLowerCase()
      .startsWith("it")
      ? "it"
      : "en";
    const t = TEXT[language];

    const selected = parseTime(value);
    const [text, setText] = React.useState(() =>
      selected === null ? "" : formatTime(selected),
    );
    const [prevValue, setPrevValue] = React.useState(value);
    if (value !== prevValue) {
      setPrevValue(value);
      const next = parseTime(value);
      setText(next === null ? "" : formatTime(next));
    }

    const [open, setOpen] = React.useState(false);
    // A picker disabled or made read-only while open closes, so nothing more can be chosen.
    if ((disabled || readOnly) && open) setOpen(false);
    const rootRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const focusList = React.useRef(false);

    const setRefs = (node: HTMLInputElement | null) => {
      inputRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    };

    const minMinutes = parseTime(min) ?? 0;
    const maxMinutes = parseTime(max) ?? 24 * 60 - 1;
    const options = React.useMemo(() => {
      const list: number[] = [];
      for (let m = 0; m < 24 * 60; m += Math.max(1, step)) list.push(m);
      return list;
    }, [step]);

    const inRange = (minutes: number) =>
      minutes >= minMinutes && minutes <= maxMinutes;

    // A complete time typed outside min/max: shown, marked invalid, never applied.
    const typedTime = parseTypedTime(text);
    const typedOutOfRange = typedTime !== null && !inRange(typedTime);
    React.useEffect(() => {
      inputRef.current?.setCustomValidity(typedOutOfRange ? t.outOfRange : "");
    }, [typedOutOfRange, t.outOfRange]);

    const commit = (minutes: number | null) => {
      if (disabled || readOnly || (minutes !== null && !inRange(minutes)))
        return;
      const next = minutes === null ? "" : formatTime(minutes);
      if (next !== (selected === null ? "" : formatTime(selected)))
        onValueChange?.(next);
    };

    const choose = (minutes: number) => {
      if (disabled || readOnly || !inRange(minutes)) return;
      setText(formatTime(minutes));
      commit(minutes);
      setOpen(false);
      inputRef.current?.focus();
    };

    const openList = (withFocus: boolean) => {
      if (disabled || readOnly) return;
      focusList.current = withFocus;
      setOpen(true);
    };

    // The option to scroll to and focus: the selected time, or the nearest enabled one after it.
    const anchorOption = () => {
      const target = selected ?? new Date().getHours() * 60;
      const enabled = options.filter(inRange);
      return enabled.find((m) => m >= target) ?? enabled[enabled.length - 1];
    };

    const handleListKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      const buttons = Array.from(
        event.currentTarget.querySelectorAll<HTMLButtonElement>(
          "button:not(:disabled)",
        ),
      );
      const index = buttons.indexOf(
        document.activeElement as HTMLButtonElement,
      );
      const moves: Record<string, number> = {
        ArrowDown: index + 1,
        ArrowUp: index - 1,
        Home: 0,
        End: buttons.length - 1,
      };
      if (event.key in moves) {
        event.preventDefault();
        buttons[
          Math.min(buttons.length - 1, Math.max(0, moves[event.key]))
        ]?.focus();
      }
    };

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
              data-type="time"
              className={fieldClassName ?? fieldClasses.inputField}
              value={text}
              placeholder={placeholder ?? t.placeholder}
              disabled={disabled}
              readOnly={readOnly}
              maxLength={5}
              onChange={(event) => {
                const masked = maskTypedTime(event.target.value);
                setText(masked);
                if (masked === "") commit(null);
                else {
                  const typed = parseTypedTime(masked);
                  if (typed !== null) commit(typed);
                }
              }}
              aria-invalid={typedOutOfRange || props["aria-invalid"]}
              onBlur={(event) => {
                setText(
                  typedTime !== null && !typedOutOfRange
                    ? formatTime(typedTime)
                    : selected === null
                      ? ""
                      : formatTime(selected),
                );
                onBlur?.(event);
              }}
              onKeyDown={(event) => {
                onKeyDown?.(event);
                if (
                  !event.defaultPrevented &&
                  event.key === "ArrowDown" &&
                  !open
                ) {
                  event.preventDefault();
                  openList(true);
                }
              }}
              onClick={(event) => {
                onClick?.(event);
                if (!open) openList(false);
              }}
            />
            {/* The form value: HH:mm, like a native time input. */}
            {name && (
              <input
                type="hidden"
                name={name}
                form={form}
                value={selected === null ? "" : formatTime(selected)}
              />
            )}
            <button
              type="button"
              className={iconClassName ?? fieldClasses.iconStyle}
              aria-label={t.open}
              aria-haspopup="listbox"
              aria-expanded={open}
              disabled={disabled || readOnly}
              onClick={() => (open ? setOpen(false) : openList(true))}
            >
              <ClockIcon />
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
            onOpenAutoFocus={(event) => {
              event.preventDefault();
              const anchor = (
                event.target as HTMLElement
              ).querySelector<HTMLButtonElement>(
                `[data-minutes="${anchorOption()}"]`,
              );
              anchor?.scrollIntoView?.({ block: "center" });
              if (focusList.current) anchor?.focus();
            }}
            onCloseAutoFocus={(event) => event.preventDefault()}
            onInteractOutside={(event) => {
              if (rootRef.current?.contains(event.target as Node))
                event.preventDefault();
            }}
          >
            <div
              role="listbox"
              aria-label={t.list}
              className={classes.list}
              onKeyDown={handleListKeyDown}
            >
              {options.map((minutes) => (
                <button
                  key={minutes}
                  type="button"
                  role="option"
                  data-minutes={minutes}
                  aria-selected={minutes === selected}
                  className={classes.option}
                  tabIndex={-1}
                  disabled={!inRange(minutes)}
                  onClick={() => choose(minutes)}
                >
                  {formatTime(minutes)}
                </button>
              ))}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    );
  },
);

TimePicker.displayName = "TimePicker";
