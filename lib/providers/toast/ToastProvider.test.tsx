// ToastProvider.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ToastProvider } from "./ToastProvider";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useToast } from "./useToast";
import { ToastProps } from "lib/main";

const defaultProps: Partial<ToastProps> = {
  content: "This is a test toast.",
  closable: true,
  position: "top-right",
  duration: 5000,
};

let mockIds: string[];

vi.mock("nanoid", () => ({
  nanoid: vi.fn(() => mockIds.shift() ?? "unknown-id"),
}));

beforeEach(() => {
  mockIds = ["id-1", "id-2", "id-3"];
  vi.clearAllMocks();
});

vi.mock("lib/components/Toast/Toast", () => ({
  Toast: ({
    onAnimationEnd,
    onOpenChange,
    title,
    open,
  }: {
    onAnimationEnd: () => void;
    onOpenChange: (open: boolean) => void;
    title: string;
    open: boolean;
  }) => {
    if (!open) return null;

    return (
      <div data-testid="toast">
        <span>{title}</span>
        <button
          data-testid="mock-animation-end"
          onClick={() => onAnimationEnd()}
        >
          Close
        </button>
        <button
          data-testid="mock-on-open-false"
          onClick={() => {
            onOpenChange(false);
          }}
        >
          Mock Close
        </button>
        {open ? "Open" : "Closed"}
      </div>
    );
  },
}));

const TestComponent: React.FC = (props: Partial<ToastProps>) => {
  const { showToast, closeToast } = useToast();

  const handleShow = () => {
    const id = showToast({
      title: "Test Toast",
      closable: true,
      ...props,
    });
    return id;
  };

  const handleShowMultiple = () => {
    showToast({
      title: "First Toast",
      ...props,
    });
    showToast({
      title: "Second Toast",
      ...props,
    });
    showToast({
      title: "Third Toast",
      ...props,
    });
  };

  const handleRemoveToast = () => {
    closeToast("id-2");
  };

  const handleRemoveAll = () => {
    closeToast();
  };

  return (
    <>
      <button onClick={handleShow}>Show Toast</button>
      <button onClick={handleShowMultiple}>Show Multiple Toasts</button>
      <button onClick={handleRemoveToast}>Remove single Toast</button>
      <button onClick={handleRemoveAll}>Remove All Toasts</button>
    </>
  );
};

const renderTestComponent = (props?: Partial<ToastProps>) =>
  render(
    <ToastProvider>
      <TestComponent {...props} />
    </ToastProvider>,
  );

const renderToastProviderChildren = (children: React.ReactNode) =>
  render(<ToastProvider>{children}</ToastProvider>);

describe("ToastProvider", () => {
  it("should render provider children", () => {
    renderToastProviderChildren(<div data-testid="child">Child Content</div>);

    expect(screen.getByTestId("child")).toHaveTextContent("Child Content");
  });

  it("should add a toast when showToast is called", () => {
    renderTestComponent(defaultProps);

    fireEvent.click(screen.getByText("Show Toast"));

    expect(screen.getByText("Test Toast")).toBeInTheDocument();
  });

  it("should remove a single toast when closeToast is called with an id", async () => {
    renderTestComponent(defaultProps);

    fireEvent.click(screen.getByText("Show Multiple Toasts"));

    expect(screen.getAllByTestId("toast")).toHaveLength(3);

    fireEvent.click(screen.getByText("Remove single Toast"));

    await waitFor(() => {
      expect(screen.queryByText("Second Toast")).not.toBeInTheDocument();
    });

    expect(screen.getAllByTestId("toast")).toHaveLength(2);
  });

  it("should close a toast and propagate onOpenChange when the toast requests closing", () => {
    const mockCallback = vi.fn();

    renderTestComponent({ ...defaultProps, onOpenChange: mockCallback });

    fireEvent.click(screen.getByText("Show Toast"));

    const toast = screen.getByTestId("toast");
    expect(toast).toBeInTheDocument();

    fireEvent.click(screen.getByTestId("mock-on-open-false"));

    expect(screen.queryByTestId("toast")).not.toBeInTheDocument();
    expect(mockCallback).toHaveBeenNthCalledWith(1, false);
  });

  it("should remove a toast when its exit animation ends", async () => {
    renderTestComponent(defaultProps);

    fireEvent.click(screen.getByText("Show Toast"));

    const toast = screen.getByTestId("toast");
    expect(toast).toBeInTheDocument();

    const animationEndBtn = screen.getByTestId("mock-animation-end");
    fireEvent.click(animationEndBtn);

    await waitFor(() => {
      expect(screen.queryByTestId("toast")).not.toBeInTheDocument();
    });
  });

  it("should remove all toasts when closeToast is called without an id", () => {
    renderTestComponent(defaultProps);

    fireEvent.click(screen.getByText("Show Multiple Toasts"));

    expect(screen.getAllByTestId("toast")).toHaveLength(3);

    fireEvent.click(screen.getByText("Remove All Toasts"));

    expect(screen.queryByTestId("toast")).not.toBeInTheDocument();
  });
});
