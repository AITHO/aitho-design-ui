import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "./Input";
import "@testing-library/jest-dom";

const handleChange = vi.fn();

const renderInput = (props = {}) => render(<Input {...props} />);

describe("Input", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render a label with a required asterisk when required is true", () => {
    renderInput({ label: "Test Label", required: true });
    expect(screen.getByText(/test label/i)).toBeInTheDocument();
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("should update internal state when the value prop changes", () => {
    const { rerender } = render(<Input value="initial" />);

    const input = screen.getByTestId("input");
    expect(input).toHaveValue("initial");

    rerender(<Input value="updated" />);

    expect(screen.getByTestId("input")).toHaveValue("updated");
  });

  it("should set an empty string when the value prop becomes undefined", () => {
    const { rerender } = render(<Input value="initial" />);

    const input = screen.getByTestId("input");
    expect(input).toHaveValue("initial");

    rerender(<Input value={undefined} />);

    expect(screen.getByTestId("input")).toHaveValue("");
  });

  it("should call onChange when the input value changes", () => {
    renderInput({ onChange: handleChange });
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "new value" } });
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: "new value" }),
      }),
    );
  });

  it("should display an error message when error is true", () => {
    renderInput({ error: true, errorMessage: "This is an error" });
    expect(screen.getByText(/this is an error/i)).toBeInTheDocument();
  });

  it("should render the search icon when the search value is empty", () => {
    renderInput({
      type: "search",
      inputSearch: true,
      value: "",
    });
    expect(screen.getByTestId("magnifying-glass-icon")).toBeInTheDocument();
  });

  it("should render the delete icon when the search input has a query", () => {
    renderInput({
      type: "search",
      inputSearch: true,
      value: "query",
    });
    expect(screen.getByTestId("cross-icon")).toBeInTheDocument();
  });

  it("should clear the search value when the delete icon is clicked", () => {
    renderInput({
      type: "search",
      inputSearch: true,
      value: "query",
      onChange: handleChange,
    });

    const deleteIcon = screen.getByTestId("cross-icon");
    fireEvent.click(deleteIcon);

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: "" }),
      }),
    );
  });

  it("should clear the search value without calling onChange when no handler is provided", () => {
    renderInput({
      type: "search",
      inputSearch: true,
      value: "query",
    });

    fireEvent.click(screen.getByTestId("cross-icon"));

    expect(screen.getByTestId("input")).toHaveValue("");
  });

  it("should render no password icon when the value is empty", () => {
    renderInput({
      type: "password",
      value: "",
    });
    expect(screen.queryByTestId("hide-password-icon")).not.toBeInTheDocument();
    expect(screen.queryByTestId("show-password-icon")).not.toBeInTheDocument();
  });

  it("should render the show eye icon when the password input has text", () => {
    renderInput({
      type: "password",
      value: "query",
    });
    expect(screen.getByTestId("show-password-icon")).toBeInTheDocument();
  });

  it("should render the hide eye icon when the password eye icon is clicked", () => {
    renderInput({
      type: "password",
      value: "query",
    });

    const showIcon = screen.getByTestId("show-password-icon");
    fireEvent.click(showIcon);

    expect(screen.getByTestId("hide-password-icon")).toBeInTheDocument();
  });

  it("should render the show eye icon again when the password hide icon is clicked", () => {
    renderInput({
      type: "password",
      value: "query",
    });

    fireEvent.click(screen.getByTestId("show-password-icon"));
    fireEvent.click(screen.getByTestId("hide-password-icon"));

    expect(screen.getByTestId("show-password-icon")).toBeInTheDocument();
  });

  it("should update the value when onValChange is called", () => {
    renderInput();
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "new value" } });
    expect(input).toHaveValue("new value");
  });

  it("should keep the label associated with a consumer-provided id", () => {
    renderInput({ label: "Email", id: "email-field" });

    expect(screen.getByLabelText(/email/i)).toHaveAttribute(
      "id",
      "email-field",
    );
  });

  it("should link and announce the error message when error is true", () => {
    renderInput({ label: "Email", error: true, errorMessage: "Required" });

    const input = screen.getByRole("textbox");
    const alert = screen.getByRole("alert");

    expect(alert).toHaveTextContent("Required");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Required");
  });

  it("should merge a consumer aria-describedby with the error message id", () => {
    render(
      <>
        <span id="hint">Use your work email</span>
        <Input aria-describedby="hint" error errorMessage="Required" />
      </>,
    );

    expect(screen.getByRole("textbox")).toHaveAccessibleDescription(
      "Use your work email Required",
    );
  });

  it("should not mark the input as invalid when there is no error", () => {
    renderInput({ errorMessage: "Required" });

    const input = screen.getByRole("textbox");
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input).not.toHaveAttribute("aria-describedby");
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("should expose aria-required when required is true", () => {
    renderInput({ label: "Name", required: true });

    expect(screen.getByRole("textbox")).toHaveAttribute(
      "aria-required",
      "true",
    );
  });
});
