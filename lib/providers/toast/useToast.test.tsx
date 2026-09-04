import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useToast } from "./useToast";
import { ToastProvider } from "./ToastProvider";

const ToastConsumerComponent = () => {
  useToast();
  return <div>Context Found</div>;
};

const renderToastConsumer = () => render(<ToastConsumerComponent />);

const renderToastConsumerWithProvider = () =>
  render(
    <ToastProvider>
      <ToastConsumerComponent />
    </ToastProvider>,
  );

describe("useToast", () => {
  it("should return the toast context when used inside ToastProvider", () => {
    renderToastConsumerWithProvider();

    expect(screen.getByText("Context Found")).toBeInTheDocument();
  });

  it("should throw an error when used outside ToastProvider", () => {
    expect(renderToastConsumer).toThrow(
      "useToast must be used within a ToastProvider",
    );
  });
});
