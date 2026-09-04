import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { AnimationEvent as ReactAnimationEvent, ComponentProps } from "react";
import { Toast } from "./Toast";
import * as ToastPrimitive from "@radix-ui/react-toast";

const toastRootMockState = vi.hoisted(() => ({
  enabled: false,
  capturedOnAnimationEnd: undefined as
    | ((event: ReactAnimationEvent<HTMLLIElement>) => void)
    | undefined,
}));

vi.mock("@radix-ui/react-toast", async () => {
  const actual = await vi.importActual<typeof import("@radix-ui/react-toast")>(
    "@radix-ui/react-toast",
  );

  return {
    ...actual,
    Root: (props: ComponentProps<typeof actual.Root>) => {
      if (!toastRootMockState.enabled) {
        return <actual.Root {...props} />;
      }

      toastRootMockState.capturedOnAnimationEnd = props.onAnimationEnd as
        | ((event: ReactAnimationEvent<HTMLLIElement>) => void)
        | undefined;

      return <li data-testid="toast">{props.children}</li>;
    },
  };
});

const renderWithProvider = (ui: React.ReactElement) => {
  return render(
    <ToastPrimitive.Provider swipeDirection="right">
      {ui}
      <ToastPrimitive.Viewport />
    </ToastPrimitive.Provider>,
  );
};

const renderToast = (props: ComponentProps<typeof Toast> = {}) =>
  renderWithProvider(<Toast open={true} {...props} />);

const renderAnimationToast = (props: ComponentProps<typeof Toast>) => {
  toastRootMockState.enabled = true;
  return render(<Toast {...props} />);
};

describe("Toast", () => {
  beforeEach(() => {
    toastRootMockState.enabled = false;
    toastRootMockState.capturedOnAnimationEnd = undefined;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render with default variant and size classes", () => {
    renderToast();

    const root = screen.getByTestId("toast");

    expect(root.className).toContain("base");
    expect(root.className).toContain("md");
    expect(root.className).not.toContain("clickable");
  });

  it.each([
    ["variant", { variant: "warning" as const }, "warning"],
    ["size", { size: "lg" as const }, "lg"],
    ["borders", { borders: "pills" as const }, "pills"],
  ])("should apply the %s class when provided", (_, props, expectedClass) => {
    renderToast(props);

    expect(screen.getByTestId("toast").className).toContain(expectedClass);
  });

  it("should render the title and description content", () => {
    renderToast({ title: "Toast Title", content: "Toast Description" });

    expect(screen.getByText("Toast Title")).toBeInTheDocument();
    expect(screen.getByText("Toast Description")).toBeInTheDocument();
  });

  it("should render a transparent close button and close when it is clicked", () => {
    const handleOpenChange = vi.fn();

    renderToast({ closable: true, onOpenChange: handleOpenChange });

    const closeButton = screen.getByRole("button", { name: "Close" });

    expect(closeButton.className).toContain("transparent");

    fireEvent.click(closeButton);

    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it("should hide the close button when closable is false", () => {
    renderToast({ closable: false });

    expect(
      screen.queryByRole("button", { name: "Close" }),
    ).not.toBeInTheDocument();
  });

  it("should only close on content click when closeOnClick is enabled", () => {
    const handleOpenChange = vi.fn();

    const { rerender } = renderWithProvider(
      <Toast
        open={true}
        closable={true}
        onOpenChange={handleOpenChange}
        title="title"
        content="content"
      />,
    );

    fireEvent.click(screen.getByText("content"));

    expect(handleOpenChange).not.toHaveBeenCalled();

    rerender(
      <ToastPrimitive.Provider swipeDirection="right">
        <Toast
          open={true}
          closable={true}
          closeOnClick
          onOpenChange={handleOpenChange}
          title="title"
          content="content"
        />
        <ToastPrimitive.Viewport />
      </ToastPrimitive.Provider>,
    );

    expect(screen.getByTestId("toast").className).toContain("clickable");

    fireEvent.click(screen.getByText("content"));

    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it("should ignore animation end callbacks when the toast is open or the animation is not a swipe", () => {
    const handleAnimationEnd = vi.fn();

    const { rerender } = renderAnimationToast({
      open: true,
      onAnimationEnd: handleAnimationEnd,
    });

    toastRootMockState.capturedOnAnimationEnd?.({
      animationName: "toastSwipeOutRight",
    } as ReactAnimationEvent<HTMLLIElement>);
    expect(handleAnimationEnd).not.toHaveBeenCalled();

    rerender(<Toast open={false} onAnimationEnd={handleAnimationEnd} />);

    toastRootMockState.capturedOnAnimationEnd?.({
      animationName: "someOtherAnimation",
    } as ReactAnimationEvent<HTMLLIElement>);

    expect(handleAnimationEnd).not.toHaveBeenCalled();
  });

  it("should call onAnimationEnd when the toast is closed and the animation is a swipe", () => {
    const handleAnimationEnd = vi.fn();

    renderAnimationToast({ open: false, onAnimationEnd: handleAnimationEnd });

    toastRootMockState.capturedOnAnimationEnd?.({
      animationName: "toastSwipeOutRight",
    } as ReactAnimationEvent<HTMLLIElement>);

    expect(handleAnimationEnd).toHaveBeenCalledOnce();
  });
});
