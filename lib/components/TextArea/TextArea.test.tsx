import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { TextArea } from "lib/main";
import { BASE_SIZES, TYPES_FOR_TEXT_AREA } from "lib/utils/constants";

const sendButtonClickMock = vi.fn();
const onChangeMock = vi.fn();
const onTextChangeMock = vi.fn();
const onLimitReachedMock = vi.fn();
const customIcon = <div data-testid="custom-icon">Icon</div>;
const customLoader = <div data-testid="custom-loader">Loading...</div>;
let disconnectMock: ReturnType<typeof vi.fn>;
let resizeObserverCallback: (() => void) | undefined;

const renderTextArea = (props: React.ComponentProps<typeof TextArea> = {}) =>
  render(<TextArea {...props} />);

describe("TextArea", () => {
  beforeEach(() => {
    disconnectMock = vi.fn();
    resizeObserverCallback = undefined;

    const ResizeObserverMock = vi.fn(function ResizeObserver(callback) {
      resizeObserverCallback = callback;

      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: disconnectMock,
      };
    });

    vi.stubGlobal("ResizeObserver", ResizeObserverMock);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should render with default size and type classes", () => {
    renderTextArea();

    const textarea = screen.getByRole("textbox");

    expect(textarea).toBeInTheDocument();
    expect(textarea.className).toContain("md");
    expect(textarea.className).toContain("outline");
  });

  it.each(BASE_SIZES)("should render the %s size variant", (size) => {
    renderTextArea({ size });

    expect(screen.getByRole("textbox").className).toContain(size);
  });

  it.each(TYPES_FOR_TEXT_AREA)("should render the %s type variant", (type) => {
    renderTextArea({ type });

    expect(screen.getByRole("textbox").className).toContain(type);
  });

  it("should render label and helper text when provided", () => {
    renderTextArea({ label: "Test Label", helperText: "Test Helper Text" });

    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.getByText("Test Helper Text")).toBeInTheDocument();
  });

  it("should handle controlled mode and call change callbacks", async () => {
    let currentValue = "initial";

    onTextChangeMock.mockImplementation((text: string) => {
      currentValue = text;
    });

    const { rerender } = renderTextArea({
      value: currentValue,
      onChange: onChangeMock,
      onTextChange: onTextChangeMock,
    });

    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;

    expect(textarea.value).toBe(currentValue);

    await userEvent.type(textarea, "t");

    expect(onTextChangeMock).toHaveBeenCalledWith("initialt");
    expect(onChangeMock).toHaveBeenCalled();

    rerender(
      <TextArea
        value={currentValue}
        onChange={onChangeMock}
        onTextChange={onTextChangeMock}
      />,
    );

    expect(textarea.value).toBe("initialt");
  });

  it("should handle uncontrolled mode starting from defaultValue", async () => {
    renderTextArea({ defaultValue: "default", onChange: onChangeMock });

    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;

    expect(textarea.value).toBe("default");

    await userEvent.type(textarea, "test");

    expect(textarea.value).toBe("defaulttest");
    expect(onChangeMock).toHaveBeenCalled();
  });

  it("should show and update the character counter with maxLength state", async () => {
    renderTextArea({ showCount: true, maxLength: 4 });

    const textarea = screen.getByRole("textbox");

    expect(screen.getByText("0/4")).toHaveAttribute("data-state", "");

    await userEvent.type(textarea, "test");

    expect(screen.getByText("4/4")).toHaveAttribute(
      "data-state",
      "char-length-exceeded",
    );
  });

  it("should update the character counter without a limit", async () => {
    renderTextArea({ showCount: true });

    const textarea = screen.getByRole("textbox");

    await userEvent.type(textarea, "Testing");

    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("should enforce maxLength and notify when the limit is reached", async () => {
    renderTextArea({
      maxLength: 5,
      onLimitReached: onLimitReachedMock,
    });

    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;

    await userEvent.type(textarea, "123456");

    expect(textarea.value).toBe("12345");
    expect(onLimitReachedMock).toHaveBeenCalled();
  });

  it("should adjust the height when autoResize is enabled", async () => {
    renderTextArea({ autoResize: true });

    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;

    Object.defineProperty(textarea, "scrollHeight", {
      configurable: true,
      value: 50,
    });

    await userEvent.type(textarea, "Line 1\nLine 2");

    expect(textarea.style.height).toBe("52px");
  });

  it("should disconnect the resize observer on unmount", () => {
    const { unmount } = renderTextArea({ autoResize: true });

    unmount();

    expect(disconnectMock).toHaveBeenCalled();
  });

  it("should return early when the resize callback runs after unmount", () => {
    const { unmount } = renderTextArea({ autoResize: true });

    unmount();

    expect(() => resizeObserverCallback?.()).not.toThrow();
  });

  it("should handle numeric values and disabled state", () => {
    const { rerender } = renderTextArea({ value: 12345 });

    expect(screen.getByRole("textbox")).toHaveValue("12345");

    rerender(<TextArea disabled />);

    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("should render a disabled send button when text is empty", () => {
    renderTextArea({ sendButton: { onClick: sendButtonClickMock } });

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should send and clear the message in uncontrolled mode", async () => {
    renderTextArea({
      defaultValue: "test message",
      sendButton: { onClick: sendButtonClickMock },
    });

    const textarea = screen.getByRole("textbox");
    const sendButton = screen.getByRole("button");

    expect(sendButton).toHaveAttribute("type", "button");

    await userEvent.click(sendButton);

    expect(sendButtonClickMock).toHaveBeenCalledWith("test message");
    expect(textarea).toHaveValue("");
  });

  it("should adjust the height when sending with autoResize enabled", async () => {
    renderTextArea({
      autoResize: true,
      defaultValue: "test message",
      sendButton: { onClick: sendButtonClickMock },
    });

    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;

    Object.defineProperty(textarea, "scrollHeight", {
      configurable: true,
      value: 50,
    });

    await userEvent.click(screen.getByRole("button"));

    expect(sendButtonClickMock).toHaveBeenCalledWith("test message");
    expect(textarea.style.height).toBe("52px");
  });

  it("should return early when sendButton has no onClick handler at runtime", async () => {
    renderTextArea({
      defaultValue: "test message",
      sendButton: { onClick: undefined as never },
    });

    const textarea = screen.getByRole("textbox");

    await userEvent.click(screen.getByRole("button"));

    expect(textarea).toHaveValue("test message");
  });

  it("should enable the send button when text is not empty", async () => {
    renderTextArea({ sendButton: { onClick: sendButtonClickMock } });

    const textarea = screen.getByRole("textbox");
    const sendButton = screen.getByRole("button");

    await userEvent.type(textarea, "test");

    expect(sendButton).toBeEnabled();
  });

  it("should render the default loading spinner for a loading send button", () => {
    const { container } = renderTextArea({
      sendButton: { onClick: sendButtonClickMock, loading: true },
    });

    expect(container.querySelector(".aitho-spinner__root")).toBeTruthy();
  });

  it("should render custom send button icon and loading element when provided", () => {
    const { rerender } = renderTextArea({
      sendButton: { onClick: sendButtonClickMock, icon: customIcon },
    });

    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();

    rerender(
      <TextArea
        sendButton={{
          onClick: sendButtonClickMock,
          loading: true,
          loadingElement: customLoader,
        }}
      />,
    );

    expect(screen.getByTestId("custom-loader")).toBeInTheDocument();
  });

  it("should send on Enter and ignore Shift+Enter when sendWithEnter is enabled", async () => {
    renderTextArea({
      defaultValue: "test message",
      sendButton: { onClick: sendButtonClickMock, sendWithEnter: true },
    });

    const textarea = screen.getByRole("textbox");

    await userEvent.type(textarea, "{shift>}{enter}{/shift}");
    expect(sendButtonClickMock).not.toHaveBeenCalled();

    await userEvent.type(textarea, "{enter}");
    expect(sendButtonClickMock).toHaveBeenCalledWith("test message\n");
  });

  it("forwards the ref to the textarea element", () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<TextArea ref={ref} />);

    expect(ref.current).toBe(screen.getByRole("textbox"));
  });
});
