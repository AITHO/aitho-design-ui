import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import { Pagination, PaginationProps } from "./Pagination";

const onPageChange = vi.fn();

const renderPagination = (props?: Partial<PaginationProps>) =>
  render(
    <Pagination
      {...props}
      itemsPerPage={10}
      totalItems={props?.totalItems ?? 50}
    />,
  );

describe("Pagination", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the visible page numbers", () => {
    renderPagination();

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("should disable the current page", () => {
    renderPagination();

    expect(screen.getByText("2").parentElement).not.toBeDisabled();
    fireEvent.click(screen.getByText("2"));
    expect(screen.getByText("2").parentElement).toBeDisabled();
  });

  it.each([
    [0, "1"],
    [10, "5"],
  ])("should fix the initial page when page is %s", (page, expectedPage) => {
    renderPagination({ page: page });

    expect(screen.getByText(expectedPage).parentElement).toBeDisabled();
  });

  it("should call onPageChange with the correct page number", () => {
    renderPagination({ onPageChange: onPageChange });

    fireEvent.click(screen.getByText("2"));
    expect(onPageChange).toHaveBeenCalledWith(2);

    fireEvent.click(screen.getByText("4"));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it("should hide page numbers when showPageNumbers is false", () => {
    renderPagination({ showPageNumbers: false });

    expect(screen.queryByText("1")).toBeNull();
  });

  it("should render the correct number of visible pages", () => {
    renderPagination({ maxVisiblePages: 3 });

    expect(screen.queryByText("1")).toBeInTheDocument();
    expect(screen.queryByText("2")).toBeInTheDocument();
    expect(screen.queryByText("3")).toBeInTheDocument();
    expect(screen.queryByText("4")).toBeNull();
    expect(screen.queryByText("5")).toBeNull();
  });

  it("should render the correct number of visible pages when near the end", () => {
    renderPagination({
      maxVisiblePages: 3,
      page: 5,
    });

    expect(screen.queryByText("1")).toBeNull();
    expect(screen.queryByText("2")).toBeNull();
    expect(screen.queryByText("3")).toBeInTheDocument();
    expect(screen.queryByText("4")).toBeInTheDocument();
    expect(screen.queryByText("5")).toBeInTheDocument();
  });

  it("should change the visible pages correctly", () => {
    renderPagination({
      maxVisiblePages: 3,
      page: 5,
    });

    fireEvent.click(screen.getByText("3"));

    expect(screen.queryByText("2")).toBeInTheDocument();
    expect(screen.queryByText("3")).toBeInTheDocument();
    expect(screen.queryByText("4")).toBeInTheDocument();
  });

  describe("navigation buttons", () => {
    it("should disable the Prev button on the first page", () => {
      renderPagination({ showPrevNext: true });

      expect(screen.getByTestId("Prev")).toBeDisabled();
    });

    it("should disable the Next button on the last page", () => {
      renderPagination({
        showPrevNext: true,
      });

      fireEvent.click(screen.getByText("5"));
      expect(screen.getByTestId("Next")).toBeDisabled();
    });

    it.each([
      ["5", "First", "1"],
      ["5", "Prev", "4"],
      ["1", "Next", "2"],
      ["1", "Last", "5"],
    ])(
      "should handle the %s navigation flow using the %s button",
      (labelFirstButton, labelButtonToClick, buttonShouldBeDisabled) => {
        renderPagination({
          showPrevNext: true,
          showFirstLast: true,
        });
        fireEvent.click(screen.getByText(labelFirstButton));
        fireEvent.click(screen.getByTestId(labelButtonToClick));
        expect(
          screen.getByText(buttonShouldBeDisabled).parentElement,
        ).toBeDisabled();
      },
    );

    it("should hide navigation buttons by default", () => {
      renderPagination();

      expect(screen.queryByTestId("First")).toBeNull();
      expect(screen.queryByTestId("Last")).toBeNull();

      expect(screen.queryByTestId("Prev")).toBeNull();
      expect(screen.queryByTestId("Next")).toBeNull();
    });

    it("should hide disabled navigation buttons when the prop is enabled", () => {
      renderPagination({
        showFirstLast: true,
        showPrevNext: true,
        hideNavigationOnDisabled: true,
      });
      expect(screen.queryByTestId("First")).toBeNull();
      expect(screen.queryByTestId("Prev")).toBeNull();

      fireEvent.click(screen.getByTestId("Last"));
      expect(screen.queryByTestId("Last")).toBeNull();
      expect(screen.queryByTestId("Next")).toBeNull();
    });
  });
});
