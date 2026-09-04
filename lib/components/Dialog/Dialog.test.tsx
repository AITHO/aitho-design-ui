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
    expect(onCancel).toHaveBeenCalledTimes(2);
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
