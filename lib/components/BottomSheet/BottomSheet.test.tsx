import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BottomSheet, BottomSheetProps } from "./BottomSheet";

const renderBottomSheet = (props: Partial<BottomSheetProps> = {}) => {
  const onClose = vi.fn();

  const defaultProps: BottomSheetProps = {
    isOpen: true,
    onClose,
    title: "Sheet title",
    children: <div>Sheet content</div>,
    ...props,
  };

  const utils = render(<BottomSheet {...defaultProps} />);

  return { ...utils, onClose };
};

describe("BottomSheet", () => {
  it("should render title, content and close button when open", () => {
    renderBottomSheet();

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Sheet title")).toBeInTheDocument();
    expect(screen.getByText("Sheet content")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("should render nothing when closed", () => {
    renderBottomSheet({ isOpen: false });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should call onClose when the close button is clicked", () => {
    const { onClose } = renderBottomSheet({ closeAriaLabel: "Dismiss" });

    fireEvent.click(screen.getByRole("button", { name: "Dismiss" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should hide the close button when showCloseButton is false", () => {
    renderBottomSheet({ showCloseButton: false });

    expect(screen.queryByRole("button", { name: "Close" })).toBeNull();
  });

  it("should call onClose when the overlay is clicked", () => {
    const { onClose } = renderBottomSheet();

    const overlay = screen.getByRole("dialog")
      .previousElementSibling as HTMLElement;
    fireEvent.click(overlay);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should call onClose when Escape is pressed", () => {
    const { onClose } = renderBottomSheet();

    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should call onClose on swipe down beyond the threshold", () => {
    const { onClose } = renderBottomSheet();

    const grabberRow = screen.getByTestId("bottom-sheet-grabber");
    fireEvent.touchStart(grabberRow, { touches: [{ clientY: 100 }] });
    fireEvent.touchEnd(grabberRow, { changedTouches: [{ clientY: 300 }] });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("should not call onClose on a short swipe", () => {
    const { onClose } = renderBottomSheet();

    const grabberRow = screen.getByTestId("bottom-sheet-grabber");
    fireEvent.touchStart(grabberRow, { touches: [{ clientY: 100 }] });
    fireEvent.touchEnd(grabberRow, { changedTouches: [{ clientY: 130 }] });

    expect(onClose).not.toHaveBeenCalled();
  });

  it("should lock body scroll while open and restore it on close", () => {
    const { unmount } = renderBottomSheet();

    expect(document.body.style.overflow).toBe("hidden");

    unmount();

    expect(document.body.style.overflow).toBe("");
  });

  it("should render a custom header instead of the default title row", () => {
    renderBottomSheet({ header: <div>Custom header</div> });

    expect(screen.getByText("Custom header")).toBeInTheDocument();
    expect(screen.queryByText("Sheet title")).toBeNull();
  });

  it("should render the footer content", () => {
    renderBottomSheet({ footer: <button type="button">Save</button> });

    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("should not render the grabber in fullScreen mode", () => {
    renderBottomSheet({ fullScreen: true });

    expect(screen.queryByTestId("bottom-sheet-grabber")).toBeNull();
  });
});
