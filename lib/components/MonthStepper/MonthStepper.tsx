import { monthStepper } from "@styled/recipes";
import * as React from "react";

export interface MonthStepperProps {
  /** Currently selected year. */
  year: number;

  /** Currently selected month, 1-based (1 = January). */
  month: number;

  /** Function called with the new year and 1-based month when the period changes. */
  onChange: (year: number, month: number) => void;

  /** *(optional)*
   * Whether the stepper is disabled.
   * @default false
   */
  disabled?: boolean;

  /** *(optional)*
   * Language code used to localize the month label.
   * @default "en"
   */
  lang?: "it" | "en";

  /** *(optional)*
   * Accessible label for the previous-month button.
   * @default "Previous month"
   */
  previousLabel?: string;

  /** *(optional)*
   * Accessible label for the next-month button.
   * @default "Next month"
   */
  nextLabel?: string;

  /** *(optional)*
   * Additional class name applied to the root element.
   */
  className?: string;
}

/**
 * Compact period selector `‹ July 2026 ›` replacing separate year/month selects
 * on mobile. 44px-wide hit targets, capitalized localized month label.
 *
 * @param year - Currently selected year.
 * @param month - Currently selected month, 1-based (1 = January).
 * @param onChange - Function called with the new year and 1-based month.
 * @param disabled - *(optional)* Whether the stepper is disabled.
 * @param lang - *(optional)* Language code used to localize the month label.
 * @param previousLabel - *(optional)* Accessible label for the previous-month button.
 * @param nextLabel - *(optional)* Accessible label for the next-month button.
 * @param className - *(optional)* Additional class name applied to the root element.
 */

export const MonthStepper: React.FC<MonthStepperProps> = ({
  year,
  month,
  onChange,
  disabled = false,
  lang = "en",
  previousLabel = "Previous month",
  nextLabel = "Next month",
  className,
}) => {
  const classes = monthStepper();

  const label = React.useMemo(() => {
    const raw = new Date(year, month - 1, 1).toLocaleDateString(lang, {
      month: "long",
      year: "numeric",
    });
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }, [year, month, lang]);

  const shift = React.useCallback(
    (delta: number) => {
      const zeroBased = month - 1 + delta;
      const nextYear = year + Math.floor(zeroBased / 12);
      const nextMonth = ((zeroBased % 12) + 12) % 12;
      onChange(nextYear, nextMonth + 1);
    },
    [year, month, onChange],
  );

  const rootClassName = className
    ? `${classes.root} ${className}`
    : classes.root;

  return (
    <div className={rootClassName}>
      <button
        type="button"
        className={classes.arrow}
        onClick={() => shift(-1)}
        disabled={disabled}
        aria-label={previousLabel}
      >
        ‹
      </button>
      <span className={classes.label}>{label}</span>
      <button
        type="button"
        className={classes.arrow}
        onClick={() => shift(1)}
        disabled={disabled}
        aria-label={nextLabel}
      >
        ›
      </button>
    </div>
  );
};

MonthStepper.displayName = "MonthStepper";
