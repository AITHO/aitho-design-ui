import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { createRef } from "react";
import { FileUpload } from "./FileUpload";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

const handleChange = vi.fn();
const handleFileDelete = vi.fn();

const renderFileUpload = (props = {}) =>
  render(<FileUpload id="file-upload" {...props} />);

describe("FileUpload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render a label with a required asterisk", () => {
    renderFileUpload({ label: "Upload File", required: true });
    expect(screen.getByText(/upload file/i)).toBeInTheDocument();
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("should call onChange when a file is uploaded", async () => {
    renderFileUpload({ onChange: handleChange });

    const input = screen.getByTestId("input");
    const mockFile = new File(["test"], "test-file.txt", {
      type: "text/plain",
    });

    await userEvent.upload(input, mockFile);

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("should allow multiple file uploads", async () => {
    renderFileUpload({ multiple: true });

    const input = screen.getByTestId("input");
    const mockFile1 = new File(["test1"], "file1.txt", { type: "text/plain" });
    const mockFile2 = new File(["test2"], "file2.txt", { type: "text/plain" });

    await userEvent.upload(input, [mockFile1, mockFile2]);
    expect(screen.getByText("file1.txt")).toBeInTheDocument();
    expect(screen.getByText("file2.txt")).toBeInTheDocument();
  });

  it("should clear a single file in multiple mode when the trash icon is clicked", async () => {
    renderFileUpload({ onFileDelete: handleFileDelete, multiple: true });

    const input = screen.getByTestId("input");
    const mockFile1 = new File(["test1"], "file1.txt", { type: "text/plain" });
    const mockFile2 = new File(["test2"], "file2.txt", { type: "text/plain" });

    await userEvent.upload(input, [mockFile1, mockFile2]);

    const trashIcon = screen.getAllByTestId("icon_trash")[0];
    fireEvent.click(trashIcon);

    expect(screen.queryByText("file1.txt")).not.toBeInTheDocument();
    expect(handleFileDelete).toHaveBeenCalledTimes(1);
  });

  it("should display an error message when error is true", () => {
    renderFileUpload({ error: true, errorMessage: "This is an error" });
    expect(screen.getByText(/this is an error/i)).toBeInTheDocument();
  });

  it("should clear the input value when the last file is deleted", async () => {
    render(<FileUpload id="file-upload" multiple />);

    const input = screen.getByTestId("input");
    const file = new File(["file content"], "test.txt", {
      type: "text/plain",
    });

    await userEvent.upload(input, [file]);
    expect(screen.getByText("test.txt")).toBeInTheDocument();

    const trashIcons = screen.getAllByTestId("icon_trash");
    fireEvent.click(trashIcons[0]);

    expect(screen.queryByText("test.txt")).not.toBeInTheDocument();
    expect(input).toHaveValue("");
  });

  it("should clear a single file and call onFileDelete in single mode", async () => {
    renderFileUpload({ onFileDelete: handleFileDelete });

    const input = screen.getByTestId("input");
    const mockFile = new File(["test"], "test-file.txt", {
      type: "text/plain",
    });

    await userEvent.upload(input, mockFile);
    const trashIcon = screen.getByTestId("icon_trash");
    fireEvent.click(trashIcon);

    expect(screen.queryByText("test-file.txt")).not.toBeInTheDocument();
    expect(handleFileDelete).toHaveBeenCalledWith(mockFile);
    expect(handleFileDelete).toHaveBeenCalledTimes(1);
  });

  it("should return early and not update files state when filesValue is null", () => {
    renderFileUpload({ multiple: true });

    const input = screen.getByTestId("input");

    fireEvent.change(input, {
      target: { files: null },
    });

    const fileItems = screen.queryByText(/Link2Icon/i);
    expect(fileItems).toBeNull();
  });

  it("should not clear files when the delete icon is clicked and the component is disabled", () => {
    const { rerender } = render(<FileUpload id="file-upload" />);

    const input = screen.getByTestId("input");
    const file = new File(["hello"], "hello.png", { type: "image/png" });

    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getByText("hello.png")).toBeInTheDocument();

    rerender(<FileUpload id="file-upload" disabled />);

    const deleteIcon = screen.getByTestId("icon_trash");
    fireEvent.click(deleteIcon);

    expect(screen.getByText("hello.png")).toBeInTheDocument();
  });

  it("forwards the ref to the file input", () => {
    const ref = createRef<HTMLInputElement>();
    render(<FileUpload id="file-upload" ref={ref} />);

    expect(ref.current).toBe(screen.getByTestId("input"));
  });
});
