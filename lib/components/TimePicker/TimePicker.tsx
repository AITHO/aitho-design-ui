import * as Popover from "@radix-ui/react-popover";
import { ClockIcon } from "@radix-ui/react-icons";
import { input, timePicker, type InputVariantProps } from "@styled/recipes";
import React from "react";
import { resolveLang } from "../DatePicker/dateUtils";
import {
  nativeFieldTarget,
  showsProblem,
  typedProblem,
  withTarget,
  type TypedProblem,
} from "../../utils/nativeField";
import {
  finerPrecision,
  formatTime,
  maskTypedTime,
  parseTime,
  parseTypedTime,
  precisionOfValue,
  timeLength,
  type TimePrecision,
} from "./timeUtils";

export type TimePickerProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "defaultValue" | "onChange" | "type" | "min" | "max" | "step"
> &
  InputVariantProps & {
    /** *(optional)* Selected time as `HH:mm`, `HH:mm:ss` or `HH:mm:ss.sss`; empty for none. */
    value?: string;

    /** *(optional)* Called with the new time in the field's precision, or `""` when cleared. */
    onValueChange?: (value: string) => void;

    /** *(optional)* Minutes between the times offered in the list (typing accepts any minute). */
    step?: number;

    /** *(optional)* How much of the time is typed and emitted: `minutes` (`HH:mm`), `seconds`
     * (`HH:mm:ss`) or `milliseconds` (`HH:mm:ss.sss`). A value written more finely keeps its
     * precision. @default "minutes" */
    precision?: TimePrecision;

    /** *(optional)* Earliest time, in any of the value formats. */
    min?: string;

    /** *(optional)* Latest time, in any of the value formats. */
    max?: string;

    /** *(optional)* Language of the labels; defaults to the page language. */
    lang?: string;

    /** *(optional)* Called when the typed time turns invalid, out of range or fine again. */
    onProblemChange?: (problem: TypedProblem) => void;

    /** *(optional)* Class for the text field, replacing the Input field style. */
    fieldClassName?: string;

    /** *(optional)* Class for the clock button, replacing the Input icon style. */
    iconClassName?: string;
  };

const TEXT = {
  it: {
    open: "Scegli l'ora",
    list: "Orari",
    invalid: "Ora non valida",
    outOfRange: "Ora fuori dall'intervallo consentito",
  },
  en: {
    open: "Choose a time",
    list: "Times",
    invalid: "Invalid time",
    outOfRange: "Time outside the allowed range",
  },
} as const;

const DAY = 24 * 3600 * 1000;
const PLACEHOLDER: Record<TimePrecision, string> = {
  minutes: "hh:mm",
  seconds: "hh:mm:ss",
  milliseconds: "hh:mm:ss.sss",
};

/**
 * A time picker: a text field that takes hh:mm (or hh:mm:ss, hh:mm:ss.sss with `precision`) and a
 * popover listing the times every `step` minutes. The value has the same format as a native time
 * input; with a `name`, a hidden field carries it in a form. While typing, a time applies once it
 * is complete for the precision; leaving the field also accepts a shorter one (`10:30` as
 * `10:30:00`). Text that is not a real time,
 * or a time outside `min`/`max`, is never applied: the field is invalid (so a form will not
 * submit), the form value is empty meanwhile, and leaving the field puts the last valid time back.
 * Blur reports a target with the field name and the canonical value, like the change does.
 * Keyboard: Arrow Down opens the list; Arrow Up / Down, Home / End move; Enter selects.
 */
export const TimePicker = React.forwardRef<HTMLInputElement, TimePickerProps>(
  (
    {
      value,
      onValueChange,
      step = 15,
      precision = "minutes",
      min,
      max,
      lang,
      placeholder,
      disabled,
      readOnly,
      fieldClassName,
      iconClassName,
      onProblemChange,
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
    const t = TEXT[resolveLang(lang)];
    // Never show a value with less than it has: a value with seconds keeps them.
    const shown = finerPrecision(precision, precisionOfValue(value));
    const length = timeLength(shown);
    const show = (time: number | null) =>
      time === null ? "" : formatTime(time, shown);

    const selected = parseTime(value);
    const [text, setText] = React.useState(() => show(selected));
    const [prevValue, setPrevValue] = React.useState(value);
    const [prevShown, setPrevShown] = React.useState(shown);
    // A new value, or a new precision for the same value (step 60 to 1), rewrites the text.
    if (value !== prevValue || shown !== prevShown) {
      setPrevValue(value);
      setPrevShown(shown);
      setText(show(parseTime(value)));
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

    const minTime = parseTime(min) ?? 0;
    const maxTime = parseTime(max) ?? DAY - 1;
    const options = React.useMemo(() => {
      const list: number[] = [];
      for (let time = 0; time < DAY; time += Math.max(1, step) * 60_000)
        list.push(time);
      return list;
    }, [step]);

    const inRange = (time: number) => time >= minTime && time <= maxTime;

    const typedTime = parseTypedTime(text, shown);
    const problem = typedProblem(text, typedTime, inRange);
    React.useEffect(() => {
      inputRef.current?.setCustomValidity(problem ? t[problem] : "");
      onProblemChange?.(problem);
    }, [problem, t, onProblemChange]);
    const showInvalid = showsProblem(problem, text, length);

    const commit = (time: number | null) => {
      if (disabled || readOnly || (time !== null && !inRange(time))) return;
      const next = show(time);
      if (next !== show(selected)) onValueChange?.(next);
    };

    const choose = (time: number) => {
      if (disabled || readOnly || !inRange(time)) return;
      setText(show(time));
      commit(time);
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
      const target = selected ?? new Date().getHours() * 3_600_000;
      const enabled = options.filter(inRange);
      return enabled.find((s) => s >= target) ?? enabled[enabled.length - 1];
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
              placeholder={placeholder ?? PLACEHOLDER[shown]}
              form={form}
              disabled={disabled}
              readOnly={readOnly}
              maxLength={length}
              onChange={(event) => {
                const masked = maskTypedTime(event.target.value, shown);
                setText(masked);
                if (masked === "") commit(null);
                else {
                  const typed = parseTypedTime(masked, shown);
                  if (typed !== null) commit(typed);
                }
              }}
              aria-invalid={showInvalid || props["aria-invalid"]}
              onBlur={(event) => {
                // Leaving also accepts a shorter time (10:30 as 10:30:00), if it is in range.
                const typed = typedTime ?? parseTime(text);
                const kept =
                  typed !== null && inRange(typed) ? typed : selected;
                if (kept !== null) commit(kept);
                setText(show(kept));
                onBlur?.(
                  withTarget(
                    event,
                    nativeFieldTarget("time", show(kept), name, props.id),
                  ),
                );
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
            {/* The form value: HH:mm(:ss) like a native time input, empty while the text is wrong. */}
            {name && (
              <input
                type="hidden"
                name={name}
                form={form}
                disabled={disabled}
                value={problem ? "" : show(selected)}
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
                `[data-seconds="${anchorOption()}"]`,
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
              tabIndex={-1}
              aria-label={t.list}
              className={classes.list}
              onKeyDown={handleListKeyDown}
            >
              {options.map((time) => (
                <button
                  key={time}
                  type="button"
                  role="option"
                  data-seconds={time}
                  aria-selected={time === selected}
                  className={classes.option}
                  tabIndex={-1}
                  disabled={!inRange(time)}
                  onClick={() => choose(time)}
                >
                  {formatTime(time)}
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
