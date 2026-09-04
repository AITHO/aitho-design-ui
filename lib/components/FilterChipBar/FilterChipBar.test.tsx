import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { FilterChipBar, FilterChipBarProps } from "./FilterChipBar";

const renderFilterChipBar = (props: Partial<FilterChipBarProps> = {}) => {
  const onOpenFilters = vi.fn();

  const defaultProps: FilterChipBarProps = {
    filters: [],
    onOpenFilters,
    ...props,
  };

  const utils = render(<FilterChipBar {...defaultProps} />);

  return { ...utils, onOpenFilters };
};

describe("FilterChipBar", () => {
  it("should render the filters pill with the default label", () => {
    renderFilterChipBar();

    expect(screen.getByRole("button", { name: "Filters" })).toBeInTheDocument();
  });

  it("should render a custom filters label", () => {
    renderFilterChipBar({ filtersLabel: "Filtri" });

    expect(screen.getByRole("button", { name: "Filtri" })).toBeInTheDocument();
  });

  it("should call onOpenFilters when the filters pill is clicked", () => {
    const { onOpenFilters } = renderFilterChipBar();

    fireEvent.click(screen.getByRole("button", { name: "Filters" }));

    expect(onOpenFilters).toHaveBeenCalledTimes(1);
  });

  it("should not render the count badge when there are no filters", () => {
    const { container } = renderFilterChipBar();

    expect(container.querySelector('[class*="count"]')).toBeNull();
  });

  it("should render the active filter count and one chip per filter", () => {
    renderFilterChipBar({
      filters: [
        { key: "status", label: "Status: Open", onRemove: vi.fn() },
        { key: "year", label: "Year: 2026", onRemove: vi.fn() },
      ],
    });

    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Status: Open")).toBeInTheDocument();
    expect(screen.getByText("Year: 2026")).toBeInTheDocument();
  });

  it("should call the filter's onRemove when its remove button is clicked", () => {
    const onRemove = vi.fn();
    renderFilterChipBar({
      filters: [{ key: "status", label: "Status: Open", onRemove }],
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Remove filter Status: Open" }),
    );

    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("should use a custom removeFilterLabel for the remove buttons", () => {
    renderFilterChipBar({
      filters: [{ key: "status", label: "Aperte", onRemove: vi.fn() }],
      removeFilterLabel: (label) => `Rimuovi filtro ${label}`,
    });

    expect(
      screen.getByRole("button", { name: "Rimuovi filtro Aperte" }),
    ).toBeInTheDocument();
  });
});
