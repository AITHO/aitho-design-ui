import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  fireEvent,
  waitFor,
  act,
  screen,
} from "@testing-library/react";
import { CodeBlock, CodeBlockHighlighter, CodeBlockProps } from "./CodeBlock";
import { Theme } from "lib/providers/theme/themeEnum";

const mockHighlighter: CodeBlockHighlighter = vi
  .fn()
  .mockResolvedValue("<span>Highlighted Code</span>");

Object.assign(window.navigator, {
  clipboard: {
    writeText: vi.fn().mockImplementation(() => Promise.resolve()),
  },
});

const originalConsoleError = console.error;

const sampleCode = `function test() {
    console.log("hello");
  }`;

const renderCodeBlock = (props: Partial<CodeBlockProps> = {}) =>
  render(
    <CodeBlock code={sampleCode} highlighter={mockHighlighter} {...props} />,
  );

describe("CodeBlock", () => {
  beforeEach(() => {
    console.error = vi.fn();
    document.documentElement.removeAttribute("data-panda-theme");
    vi.mocked(navigator.clipboard.writeText).mockClear();
    vi.mocked(mockHighlighter).mockClear();
  });

  afterEach(() => {
    console.error = originalConsoleError;
    vi.clearAllMocks();
  });

  it("should render without crashing", () => {
    renderCodeBlock({ lang: "typescript" });
    expect(screen.getByTestId("code-block")).toBeDefined();
  });

  it("should call the highlighter with the correct parameters", async () => {
    renderCodeBlock({ theme: "dark-plus" });

    await waitFor(() => {
      expect(mockHighlighter).toHaveBeenCalledWith(
        sampleCode,
        "plaintext",
        "dark-plus",
      );
    });
  });

  it("should use the dark-plus theme when the global theme is dark", async () => {
    document.documentElement.setAttribute("data-panda-theme", Theme.DARK);

    renderCodeBlock();

    await waitFor(() => {
      expect(mockHighlighter).toHaveBeenCalledWith(
        sampleCode,
        "plaintext",
        "dark-plus",
      );
    });
  });

  it("should render highlighted code", async () => {
    renderCodeBlock({ lang: "typescript" });

    await waitFor(() => {
      expect(screen.getByTestId("code-block-content")).toBeDefined();
    });
  });

  it("should fall back to plain code when the highlighter throws", async () => {
    const failingHighlighter: CodeBlockHighlighter = vi
      .fn()
      .mockRejectedValue(new Error("highlighter failed"));

    renderCodeBlock({
      lang: "typescript",
      highlighter: failingHighlighter,
    });

    await waitFor(() => {
      const content = screen.getByTestId("code-block-content");
      expect(content.innerHTML).toContain("function test()");
    });
    expect(console.error).toHaveBeenCalled();
  });

  it("should show line numbers when showLineNumbers is true", () => {
    renderCodeBlock({
      lang: "typescript",
      showLineNumbers: true,
    });

    expect(screen.getByTestId("code-block-line-numbers")).toBeDefined();
    expect(screen.getByTestId("code-block-line-number-1")).toBeDefined();
    expect(screen.getByTestId("code-block-line-number-2")).toBeDefined();
  });

  it("should not show line numbers when showLineNumbers is false", () => {
    renderCodeBlock({
      lang: "typescript",
      showLineNumbers: false,
    });

    expect(screen.queryByTestId("code-block-line-numbers")).toBeNull();
  });

  it("should handle single line code correctly", () => {
    renderCodeBlock({
      code: "const x = 1;",
      lang: "typescript",
      showLineNumbers: true,
    });

    expect(screen.getByTestId("code-block-line-number-1")).toBeDefined();
    expect(screen.queryByTestId("code-block-line-number-2")).toBeNull();
  });

  it("should copy code to the clipboard when the copy button is clicked", async () => {
    renderCodeBlock({ lang: "typescript" });

    const copyButton = screen.getByTestId("code-block-copy-button");
    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(sampleCode);
  });

  it("should transition through the correct button states during and after the timeout", async () => {
    vi.useFakeTimers();
    const timeout = 2000;

    renderCodeBlock({
      copyButtonContent: <div data-testid="copy-icon" />,
      copiedIcon: <div data-testid="check-icon" />,
      timeoutCopyFeedback: timeout,
    });

    const copyButton = screen.getByTestId("code-block-copy-button");

    expect(screen.getByTestId("copy-icon")).toBeDefined();

    await act(async () => {
      fireEvent.click(copyButton);
    });

    expect(screen.getByTestId("check-icon")).toBeDefined();

    await act(async () => {
      vi.advanceTimersByTime(timeout);
    });

    expect(screen.getByTestId("copy-icon")).toBeDefined();
    vi.useRealTimers();
  });

  it("should clear the timeout when the button is clicked multiple times", async () => {
    const timeout = 2000;
    const clearTimeoutSpy = vi.spyOn(window, "clearTimeout");

    renderCodeBlock({
      copyButtonContent: <div data-testid="copy-icon" />,
      copiedIcon: <div data-testid="check-icon" />,
      timeoutCopyFeedback: timeout,
    });

    const copyButton = screen.getByTestId("code-block-copy-button");

    await act(async () => {
      fireEvent.click(copyButton);
    });

    await act(async () => {
      fireEvent.click(copyButton);
    });

    expect(vi.mocked(clearTimeoutSpy)).toHaveBeenCalledTimes(1);

    clearTimeoutSpy.mockRestore();
  });

  it("should clear the timeout when the component unmounts", async () => {
    const timeout = 2000;
    const clearTimeoutSpy = vi.spyOn(window, "clearTimeout");

    const { unmount } = renderCodeBlock({
      copyButtonContent: <div data-testid="copy-icon" />,
      copiedIcon: <div data-testid="check-icon" />,
      timeoutCopyFeedback: timeout,
    });

    const copyButton = screen.getByTestId("code-block-copy-button");
    await act(async () => {
      fireEvent.click(copyButton);
    });

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();

    clearTimeoutSpy.mockRestore();
  });
});
