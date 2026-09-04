import { MixerHorizontalIcon, Cross2Icon } from "@radix-ui/react-icons";
import { filterChipBar } from "@styled/recipes";
import * as React from "react";

export interface FilterChip {
  /** Unique key of the filter. */
  key: string;

  /** Label displayed inside the chip. */
  label: string;

  /** Function called when the chip's remove button is clicked. */
  onRemove: () => void;
}

export interface FilterChipBarProps {
  /** Currently applied filters, rendered as removable chips. */
  filters: FilterChip[];

  /** Function called when the "Filters" pill is clicked (e.g. opens a filters sheet). */
  onOpenFilters: () => void;

  /** *(optional)*
   * Label of the "Filters" pill.
   * @default "Filters"
   */
  filtersLabel?: string;

  /** *(optional)*
   * Function that builds the accessible label of a chip's remove button
   * from the chip label.
   * @default (label) => `Remove filter ${label}`
   */
  removeFilterLabel?: (label: string) => string;

  /** *(optional)*
   * Additional class name applied to the root element.
   */
  className?: string;
}

/**
 * Horizontally scrollable filter row: a "Filters" pill with an active count
 * badge plus one removable chip per applied filter.
 *
 * @param filters - Currently applied filters, rendered as removable chips.
 * @param onOpenFilters - Function called when the "Filters" pill is clicked.
 * @param filtersLabel - *(optional)* Label of the "Filters" pill.
 * @param removeFilterLabel - *(optional)* Function that builds the accessible label of a chip's remove button.
 * @param className - *(optional)* Additional class name applied to the root element.
 */

export const FilterChipBar: React.FC<FilterChipBarProps> = ({
  filters,
  onOpenFilters,
  filtersLabel = "Filters",
  removeFilterLabel = (label) => `Remove filter ${label}`,
  className,
}) => {
  const classes = filterChipBar();

  const rootClassName = className
    ? `${classes.root} ${className}`
    : classes.root;

  return (
    <div className={rootClassName}>
      <button
        type="button"
        className={classes.filtersButton}
        onClick={onOpenFilters}
      >
        <MixerHorizontalIcon aria-hidden />
        <span>{filtersLabel}</span>
        {filters.length > 0 && (
          <span className={classes.count}>{filters.length}</span>
        )}
      </button>
      {filters.map((filter) => (
        <span key={filter.key} className={classes.chip}>
          <span className={classes.chipLabel}>{filter.label}</span>
          <button
            type="button"
            className={classes.chipRemove}
            onClick={filter.onRemove}
            aria-label={removeFilterLabel(filter.label)}
          >
            <Cross2Icon aria-hidden />
          </button>
        </span>
      ))}
    </div>
  );
};

FilterChipBar.displayName = "FilterChipBar";
