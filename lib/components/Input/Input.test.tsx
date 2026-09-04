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
});
