import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Dialog, DialogProps } from "./Dialog";
import "@testing-library/jest-dom";

const renderDialog = (props: Partial<DialogProps> = {}) =>
  render(
    <Dialog
      open={true}
      title="Test Title"
      description="Test Description"
      {...props}
    />,
  );

describe("Dialog", () => {
  it("should render the dialog with the provided title and description", () => {
    renderDialog();
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("should render the dialog inside a custom container when one is provided", () => {
    const customContainer = document.createElement("div");
    document.body.appendChild(customContainer);

    renderDialog({ container: customContainer, description: undefined });

    expect(customContainer).toHaveTextContent("Test Title");
    customContainer.remove();
  });

  it("should render the close button and trigger onCancel when clicked if close is true", () => {
    const onCancel = vi.fn();

    renderDialog({ close: true, onCancel, description: undefined });

    const closeButton = screen.getByTestId("cross-icon");
    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("should call onCancel once when Escape is pressed", () => {
    const onCancel = vi.fn();

    renderDialog({ onCancel, description: undefined });

    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("should label the close button with 'Close dialog' by default", () => {
    renderDialog({ description: undefined });

    expect(
      screen.getByRole("button", { name: "Close dialog" }),
    ).toBeInTheDocument();
  });

  it("should label the close button with closeLabel when provided", () => {
    renderDialog({ closeLabel: "Chiudi finestra", description: undefined });

    expect(
      screen.getByRole("button", { name: "Chiudi finestra" }),
    ).toBeInTheDocument();
  });

  it("should only close the topmost dialog when two dialogs are open", () => {
    const onCancelOuter = vi.fn();
    const onCancelInner = vi.fn();

    const renderDialogs = (innerOpen: boolean) => (
      <>
        <Dialog open title="Outer" footer={false} onCancel={onCancelOuter} />
        <Dialog
          open={innerOpen}
          title="Inner"
          footer={false}
          onCancel={onCancelInner}
        />
      </>
    );

    const { rerender } = render(renderDialogs(false));
    rerender(renderDialogs(true));

    const inner = screen.getByRole("dialog", { name: "Inner" });
    fireEvent.keyDown(inner, { key: "Escape" });

    expect(onCancelInner).toHaveBeenCalledTimes(1);
    expect(onCancelOuter).not.toHaveBeenCalled();
  });

  it("should not render the close button when close is set to false", () => {
    renderDialog({ close: false, description: undefined });

    const closeButton = screen.queryByTestId("cross-icon");
    expect(closeButton).not.toBeInTheDocument();
  });

  it("should render the footer with OK and Cancel buttons when footer is true", () => {
    renderDialog({
      footer: true,
      title: "Test",
      okText: "OK",
      cancelText: "Cancel",
      description: undefined,
    });
    expect(screen.getByRole("button", { name: "OK" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("should not render the footer when footer is set to false", () => {
    renderDialog({ footer: false, title: "Test", description: undefined });
    expect(screen.queryByTestId("dialog-footer")).not.toBeInTheDocument();
  });
});
