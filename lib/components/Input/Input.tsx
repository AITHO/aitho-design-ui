import {
  Cross1Icon,
  EyeNoneIcon,
  EyeOpenIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import { input, type InputVariantProps } from "@styled/recipes";
import React, { useState } from "react";
import { DatePicker } from "../DatePicker/DatePicker";
import { resolveLang } from "../DatePicker/dateUtils";
import { TimePicker } from "../TimePicker/TimePicker";
import { parseTime, type TimePrecision } from "../TimePicker/timeUtils";
import { Label } from "../Label/Label";
import {
  nativeFieldTarget,
  withTarget,
  type TypedProblem,
} from "../../utils/nativeField";
import "./Input.css";

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  type?: Extract<
    React.InputHTMLAttributes<HTMLInputElement>["type"],
    | "text"
    | "email"
    | "password"
    | "number"
    | "tel"
    | "url"
    | "date"
    | "time"
    | "datetime-local"
    | "range"
    | "search"
  >;
} & InputVariantProps & {
    /** *(optional)*
     * Text to display as the label for the input field.
     * Text to be passed as a label for the input field.
     * It will be displayed above or beside the input, and may be followed by an asterisk if the field is required.
     */
    label?: string;

    /** *(optional)*
     * If `true`, the input field is mandatory.
     * Indicates whether the input field is required. If `true`, an asterisk (*) will appear next to the label.
     * @default false
     */
    required?: boolean;

    /** *(optional)*
     * Custom error message to display in case of validation error.
     * Error message to display below the input field if validation fails.
     */
    errorMessage?: string;

    /** *(optional)*
     * If `true`, applies error styling to the input field.
     * Indicates whether the input should be styled with an error state (e.g., red border).
     * @default false
     */
    error?: boolean;

    /** *(optional)*
     * If `true`, the input field will have search functionality.
     * When `type` is "search", a search icon will be displayed (or a delete icon if there is a value).
     * @default false
     */
    inputSearch?: boolean;
  };

type DateTimeFieldProps = Omit<
  React.ComponentProps<typeof DatePicker>,
  "value" | "onValueChange" | "min" | "max"
> & {
  value: string;
  onValueChange: (value: string) => void;
  min?: string;
  max?: string;
  /** The Input label, used to name the time part ("Start, time"). */
  fieldLabel?: string;
  /** How much of the time part is typed and kept (a value written more finely keeps it). */
  precision?: TimePrecision;
};

const TIME_PART = { it: "ora", en: "time" } as const;

// The day and the time, every digit kept: `2026-03-07T10:30:45.123` keeps its `:45.123`.
const splitDateTime = (v: string) => {
  const match =
    /^(\d{4}-\d{2}-\d{2})(?:T(\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?))?/.exec(v);
  return { date: match?.[1] ?? "", time: match?.[2] ?? "" };
};

// A datetime as the day then the time in milliseconds, so limits compare by value and not by
// how they are written: 10:30:00 equals 10:30.
const dateTimeKey = (v: string) => {
  const { date, time } = splitDateTime(v);
  return `${date}T${String(parseTime(time) ?? 0).padStart(8, "0")}`;
};

// The time part of a datetime limit, on its first or last allowed day only.
const timeLimit = (limit: string | undefined, day: string) =>
  limit && day && day === limit.slice(0, 10) ? limit.slice(11) : undefined;

// datetime-local as a DatePicker and a TimePicker side by side; the value is YYYY-MM-DDTHH:mm
// (with seconds or milliseconds by precision), emitted once both parts are there (like the native
// field) and "" as soon as either is cleared. Blur reports the field name and that whole value.
const DateTimeField = React.forwardRef<HTMLInputElement, DateTimeFieldProps>(
  (
    {
      value,
      onValueChange,
      min,
      max,
      disabled,
      readOnly,
      iconClassName,
      fieldClassName,
      fieldLabel,
      precision,
      name,
      form,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const [parts, setParts] = React.useState(() => splitDateTime(value));
    // The value this field emitted and is waiting to see back: when it returns as the prop it is
    // our own echo, and the parts typed so far stay (clearing the time keeps the day). Anything
    // else came from outside, a reset to "" included, and replaces both parts.
    const [emitted, setEmitted] = React.useState<string | null>(null);
    // A part with wrong text empties the form value, as an incomplete native field does.
    const [dayProblem, setDayProblem] = React.useState<TypedProblem>(null);
    const [timeProblem, setTimeProblem] = React.useState<TypedProblem>(null);
    const [prevValue, setPrevValue] = React.useState(value);
    if (value !== prevValue) {
      setPrevValue(value);
      // An echo is recognised once, then forgotten: a later update to the same value is external.
      if (value === emitted) setEmitted(null);
      else setParts(splitDateTime(value));
    }

    const minDay = min?.slice(0, 10);
    const maxDay = max?.slice(0, 10);
    const isOutOfRange = (dateTime: string) => {
      const key = dateTimeKey(dateTime);
      return Boolean(
        (min && key < dateTimeKey(min)) || (max && key > dateTimeKey(max)),
      );
    };

    const change = (next: { date: string; time: string }) => {
      setParts(next);
      const combined =
        next.date && next.time ? `${next.date}T${next.time}` : "";
      // A full date and time outside min/max is never emitted, like each part on its own.
      if (combined && isOutOfRange(combined)) return;
      if (combined !== value) {
        setEmitted(combined);
        onValueChange(combined);
      }
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) =>
      onBlur?.(
        withTarget(
          event,
          nativeFieldTarget("datetime-local", value, name, props.id),
        ),
      );

    const timeWord = TIME_PART[resolveLang(props.lang)];
    return (
      <div style={{ display: "flex", gap: "8px", width: "100%" }}>
        <div style={{ flex: "1.4 1 0", minWidth: 0 }}>
          <DatePicker
            {...props}
            ref={ref}
            value={parts.date}
            min={minDay}
            max={maxDay}
            form={form}
            disabled={disabled}
            readOnly={readOnly}
            fieldClassName={fieldClassName}
            iconClassName={iconClassName}
            onBlur={handleBlur}
            onProblemChange={setDayProblem}
            onValueChange={(date) => change({ ...parts, date })}
          />
        </div>
        <div style={{ flex: "1 1 0", minWidth: 0 }}>
          <TimePicker
            value={parts.time}
            // The time limits only bind on the first and the last allowed day.
            min={timeLimit(min, parts.date)}
            max={timeLimit(max, parts.date)}
            precision={precision}
            form={form}
            disabled={disabled}
            readOnly={readOnly}
            lang={props.lang}
            fieldClassName={fieldClassName}
            iconClassName={iconClassName}
            aria-label={fieldLabel ? `${fieldLabel}, ${timeWord}` : timeWord}
            aria-describedby={props["aria-describedby"]}
            aria-invalid={props["aria-invalid"]}
            aria-required={props["aria-required"]}
            onBlur={handleBlur}
            onProblemChange={setTimeProblem}
            onValueChange={(time) => change({ ...parts, time })}
          />
        </div>
        {/* One form value for both parts, YYYY-MM-DDTHH:mm(:ss), like a native datetime-local. */}
        {name && (
          <input
            type="hidden"
            name={name}
            form={form}
            disabled={disabled}
            value={dayProblem || timeProblem ? "" : value}
          />
        )}
      </div>
    );
  },
);
DateTimeField.displayName = "DateTimeField";

type PickerType = "date" | "time" | "datetime-local";

const isPickerType = (type: InputProps["type"]): type is PickerType =>
  type === "date" || type === "time" || type === "datetime-local";

const asLimit = (limit: InputProps["min"]) =>
  limit === undefined ? undefined : String(limit);

const asValue = (value: InputProps["value"]) => value ?? "";

// A native time step is in seconds: whole minutes show hh:mm, whole seconds hh:mm:ss, a fraction
// of a second hh:mm:ss.sss (step "any" too).
const precisionOfStep = (step: InputProps["step"]): TimePrecision => {
  if (step === undefined || Number(step) % 60 === 0) return "minutes";
  return Number.isInteger(Number(step)) ? "seconds" : "milliseconds";
};

type PickerInputProps = DateTimeFieldProps & {
  type: PickerType;
  step?: InputProps["step"];
};

// The library picker behind each date and time type, all fed the same props by Input.
const PickerInput = React.forwardRef<HTMLInputElement, PickerInputProps>(
  ({ type, step, fieldLabel, ...props }, ref) => {
    const precision = precisionOfStep(step);
    if (type === "time") {
      // The list step is in minutes.
      const minutes = step
        ? Math.max(1, Math.round(Number(step) / 60))
        : undefined;
      return (
        <TimePicker {...props} ref={ref} step={minutes} precision={precision} />
      );
    }
    if (type === "datetime-local") {
      return (
        <DateTimeField
          {...props}
          ref={ref}
          fieldLabel={fieldLabel}
          precision={precision}
        />
      );
    }
    return <DatePicker {...props} ref={ref} />;
  },
);
PickerInput.displayName = "PickerInput";

// A change event whose target is a real input of the native type holding the value
// (YYYY-MM-DD, HH:mm or YYYY-MM-DDTHH:mm), so it reads like a native date input's event.
const nativeChangeEvent = (
  type: PickerType,
  value: string,
  name: string,
  id: string,
) => {
  const target = nativeFieldTarget(type, value, name, id);
  return {
    target,
    currentTarget: target,
    type: "change",
    preventDefault: () => undefined,
    stopPropagation: () => undefined,
    persist: () => undefined,
  } as unknown as React.ChangeEvent<HTMLInputElement>;
};

const FieldLabel = ({
  label,
  required,
  htmlFor,
  markClassName,
}: {
  label?: string;
  required?: boolean;
  htmlFor: string;
  markClassName: string;
}) =>
  label ? (
    <Label htmlFor={htmlFor}>
      {required && <span className={markClassName}>*</span>}
      {label}:
    </Label>
  ) : null;

const SearchAdornment = ({
  empty,
  onClear,
  className,
}: {
  empty: boolean;
  onClear: () => void;
  className: string;
}) =>
  empty ? (
    <MagnifyingGlassIcon
      className={className}
      data-testid="magnifying-glass-icon"
    />
  ) : (
    <button
      type="button"
      className={className}
      onClick={onClear}
      data-testid="cross-icon"
    >
      <Cross1Icon />
    </button>
  );

const PasswordToggle = ({
  visible,
  onToggle,
  className,
}: {
  visible: boolean;
  onToggle: (visible: boolean) => void;
  className: string;
}) => (
  <button
    type="button"
    className={className}
    onClick={() => onToggle(!visible)}
    data-testid={visible ? "hide-password-icon" : "show-password-icon"}
  >
    {visible ? <EyeNoneIcon /> : <EyeOpenIcon />}
  </button>
);

/**
 *
 * Provides an input bar of the chosen type.
 *
 * @param label - *(optional)* Text to display as the label for the input field.
 * @param required - *(optional)* If `true`, the input field is mandatory.
 * @param errorMessage - *(optional)* Custom error message to display in case of validation error.
 * @param error - *(optional)* If `true`, applies error styling to the input field.
 * @param inputSearch - *(optional)* If `true`, the input field will have search functionality.
 * @param placeholder - *(optional)* Placeholder text displayed in the input field.
 * @param type - *(optional)* The input field type. Options: 'text', 'email', 'password', 'number', 'tel', 'url', 'search, 'date', 'time', 'datetime-local', 'range'.
 * @param disabled - *(optional)* Disables the input field.
 * @param borderRadius - *(optional)* The border radius style of the input field. Options: 'none', 'rounded'.
 * @param borderColor - *(optional)* The border color of the input field. Options: 'base', 'primary', 'error'.
 * @param onChange - *(optional)* Callback function called when the user does type or interact with the input field.
 */

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      required,
      errorMessage,
      error,
      inputSearch,
      onChange,
      borderRadius,
      borderColor,
      type,
      value,
      id,
      className,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const uniqueId = id ?? generatedId;
    const errorId = `${uniqueId}-error`;
    const showError = Boolean(error && errorMessage);
    const classes = input({ borderRadius, borderColor });
    // A caller's class adds to the field style instead of replacing it (it used to drop the
    // whole recipe, native number spinners included).
    const fieldClassName = [classes.inputField, className]
      .filter(Boolean)
      .join(" ");
    const fieldAria = {
      "aria-invalid": error || undefined,
      "aria-required": required || undefined,
      "aria-describedby":
        [ariaDescribedBy, showError && errorId].filter(Boolean).join(" ") ||
        undefined,
    };
    const internalRef = React.useRef<HTMLInputElement>(null);
    const inputRef = (ref as React.RefObject<HTMLInputElement>) ?? internalRef;

    const [val, setVal] = useState(asValue(value));
    const [prevValue, setPrevValue] = useState(value);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    // Update state during render when prop changes
    if (value !== prevValue) {
      setPrevValue(value);
      setVal(asValue(value));
    }

    const onValChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setVal(e.target.value);
      onChange?.(e);
    };

    // The date and time fields are the library pickers, not the browser's: callers still get a
    // change event shaped like a native date input's.
    const emitDate = (picked: string) => {
      setVal(picked);
      onChange?.(
        nativeChangeEvent(
          type as PickerType,
          picked,
          String(props.name ?? ""),
          uniqueId,
        ),
      );
    };

    const deleteValue = () => {
      setVal("");
      onChange?.({
        target: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>);
      inputRef.current?.focus();
    };

    return (
      <>
        <div className={classes.inputWrapper}>
          <FieldLabel
            label={label}
            required={required}
            htmlFor={uniqueId}
            markClassName={classes.requiredMark}
          />

          <div className={classes.inputContainer}>
            {isPickerType(type) ? (
              <PickerInput
                {...props}
                {...fieldAria}
                type={type}
                ref={inputRef}
                id={uniqueId}
                data-testid="input"
                value={String(val)}
                min={asLimit(props.min)}
                max={asLimit(props.max)}
                onValueChange={emitDate}
                fieldClassName={fieldClassName}
                iconClassName={classes.iconStyle}
                fieldLabel={label}
              />
            ) : (
              <input
                id={uniqueId}
                ref={inputRef}
                data-testid="input"
                className={fieldClassName}
                value={val}
                onChange={onValChange}
                type={isPasswordVisible ? "text" : type}
                {...fieldAria}
                {...props}
              />
            )}
            {inputSearch && type === "search" && (
              <SearchAdornment
                empty={val === ""}
                onClear={deleteValue}
                className={classes.iconStyle}
              />
            )}
            {type === "password" && String(val).length > 0 && (
              <PasswordToggle
                visible={isPasswordVisible}
                onToggle={setIsPasswordVisible}
                className={classes.iconStyle}
              />
            )}
          </div>
        </div>

        {showError && (
          <span id={errorId} role="alert" className={classes.errorText}>
            {errorMessage}
          </span>
        )}
      </>
    );
  },
);

Input.displayName = "Input";
