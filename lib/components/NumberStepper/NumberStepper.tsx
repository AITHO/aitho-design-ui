import { numberStepper } from "@styled/recipes";
import * as React from "react";

export interface NumberStepperProps {
  /** Current numeric value of the stepper. */
  value: number;

  /** Function called with the new value when it changes. */
  onChange: (value: number) => void;

  /** *(optional)*
   * Minimum value that can be selected.
   * @default 0
   */
  min?: number;

  /** *(optional)*
   * Maximum value that can be selected.
   * @default Number.MAX_SAFE_INTEGER
   */
  max?: number;

  /** *(optional)*
   * Increment applied by the − / + buttons.
   * @default 0.5
   */
  step?: number;

  /** *(optional)*
   * Whether the stepper is disabled.
   * @default false
   */
  disabled?: boolean;

  /** *(optional)*
   * Accessible name for the input and − / + buttons, e.g. the row label.
   */
  label?: string;

  /** *(optional)*
   * Highlight the stepper with a 2px primary border (row being edited).
   * @default false
   */
  active?: boolean;

  /** *(optional)*
   * Additional class name applied to the root element.
   */
  className?: string;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const round2 = (value: number) => Math.round(value * 100) / 100;

/**
 * Touch-friendly numeric input with − / + buttons (44×44px hit targets) and a
 * tap-to-type value. Accepts both comma and dot decimals; commits on blur/Enter.
 *
 * @param value - Current numeric value of the stepper.
 * @param onChange - Function called with the new value when it changes.
 * @param min - *(optional)* Minimum value that can be selected.
 * @param max - *(optional)* Maximum value that can be selected.
 * @param step - *(optional)* Increment applied by the − / + buttons.
 * @param disabled - *(optional)* Whether the stepper is disabled.
 * @param label - *(optional)* Accessible name for the input and − / + buttons.
 * @param active - *(optional)* Highlight the stepper with a 2px primary border.
 * @param className - *(optional)* Additional class name applied to the root element.
 */

export const NumberStepper: React.FC<NumberStepperProps> = ({
  value,
  onChange,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  step = 0.5,
  disabled = false,
  label,
  active = false,
  className,
}) => {
  const classes = numberStepper();
  const [text, setText] = React.useState(() => String(value));

  React.useEffect(() => {
    setText(String(value));
  }, [value]);

  const commitText = React.useCallback(() => {
    const parsed = Number.parseFloat(text.replace(",", "."));
    if (Number.isNaN(parsed)) {
      setText(String(value));
      return;
    }
    const next = round2(clamp(parsed, min, max));
    setText(String(next));
    if (next !== value) {
      onChange(next);
    }
  }, [text, value, min, max, onChange]);

  const applyDelta = React.useCallback(
    (delta: number) => {
      const next = round2(clamp(value + delta, min, max));
      if (next !== value) {
        onChange(next);
      }
    },
    [value, min, max, onChange],
  );

  const rootClassName = className
    ? `${classes.root} ${className}`
    : classes.root;

  return (
    <div
      className={rootClassName}
      data-active={active ? "true" : "false"}
      data-disabled={disabled ? "true" : "false"}
    >
      <button
        type="button"
        className={classes.button}
        onClick={() => applyDelta(-step)}
        disabled={disabled || value <= min}
        aria-label={label ? `${label}: −${step}` : `−${step}`}
      >
        −
      </button>
      <input
        className={classes.value}
        type="text"
        inputMode="decimal"
        value={text}
        disabled={disabled}
        aria-label={label}
        onChange={(event) => setText(event.target.value)}
        onFocus={(event) => event.target.select()}
        onBlur={commitText}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.currentTarget.blur();
          }
        }}
      />
      <button
        type="button"
        className={classes.button}
        onClick={() => applyDelta(step)}
        disabled={disabled || value >= max}
        aria-label={label ? `${label}: +${step}` : `+${step}`}
      >
        +
      </button>
    </div>
  );
};

NumberStepper.displayName = "NumberStepper";
