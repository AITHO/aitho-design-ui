import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Stepper, Step, StepContext, StepperProps } from "./Stepper";

const createSteps = () => [
  <Step key="step-1">Step 1</Step>,
  <Step key="step-2">Step 2</Step>,
  <Step key="step-3">Step 3</Step>,
];

const renderStepper = ({
  index = 0,
  children = createSteps(),
  ...props
}: Partial<StepperProps> & { children?: React.ReactNode }) => {
  const stepChildren = React.Children.toArray(children);
  const TestStepper = Stepper as React.ComponentType<
    React.PropsWithChildren<Omit<StepperProps, "children">>
  >;

  render(
    React.createElement(TestStepper, { index, ...props }, ...stepChildren),
  );

  return {
    root: screen.getByTestId("stepper-root"),
  };
};

describe("Stepper", () => {
  it("should render the children with horizontal orientation by default", () => {
    const { root } = renderStepper({ index: 0 });

    expect(root.className).toContain("orientation_horizontal");
    expect(screen.getByText("Step 1")).toBeInTheDocument();
    expect(screen.getByText("Step 2")).toBeInTheDocument();
    expect(screen.getByText("Step 3")).toBeInTheDocument();
  });

  it("should apply vertical orientation classes when specified", () => {
    const { root } = renderStepper({ index: 0, orientation: "vertical" });

    expect(root.className).toContain("orientation_vertical");
  });

  it("should mark complete, active, and incomplete steps based on the index", () => {
    renderStepper({ index: 1 });

    const activeIndicators = screen.getAllByTestId("stepper-indicator-active");
    const completeIndicators = screen.getAllByTestId(
      "stepper-indicator-complete",
    );
    const incompleteIndicators = screen.getAllByTestId(
      "stepper-indicator-incomplete",
    );

    expect(activeIndicators).toHaveLength(1);
    expect(activeIndicators[0]).toHaveAttribute("aria-current", "step");
    expect(completeIndicators).toHaveLength(1);
    expect(incompleteIndicators).toHaveLength(1);
  });

  it("should render fallback indicators when custom status props are not provided", () => {
    renderStepper({ index: 1 });

    const completeIndicators = screen.getAllByTestId(
      "stepper-indicator-complete",
    );

    expect(completeIndicators[0].querySelector("svg")).not.toBeNull();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("should render custom node indicators for complete, active, and incomplete steps", () => {
    renderStepper({
      index: 1,
      children: [
        <Step key="step-1" complete="Done">
          Step 1
        </Step>,
        <Step key="step-2" active="Current">
          Step 2
        </Step>,
        <Step key="step-3" incomplete="Pending">
          Step 3
        </Step>,
      ],
    });

    expect(screen.getByText("Done")).toBeInTheDocument();
    expect(screen.getByText("Current")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("should render function-based indicators with the correct context values", () => {
    const renderIndicator = vi.fn(
      (context: StepContext) => `Custom Step ${context.step}`,
    );

    renderStepper({
      index: 1,
      children: [
        <Step key="step-1" complete={renderIndicator}>
          Step 1
        </Step>,
        <Step key="step-2" active={renderIndicator}>
          Step 2
        </Step>,
        <Step key="step-3" incomplete={renderIndicator}>
          Step 3
        </Step>,
      ],
    });

    expect(screen.getByText("Custom Step 1")).toBeInTheDocument();
    expect(screen.getByText("Custom Step 2")).toBeInTheDocument();
    expect(screen.getByText("Custom Step 3")).toBeInTheDocument();
    expect(renderIndicator).toHaveBeenNthCalledWith(1, {
      isActive: false,
      isComplete: true,
      step: 1,
    });
    expect(renderIndicator).toHaveBeenNthCalledWith(2, {
      isActive: true,
      isComplete: false,
      step: 2,
    });
    expect(renderIndicator).toHaveBeenNthCalledWith(3, {
      isActive: false,
      isComplete: false,
      step: 3,
    });
  });

  it("should render separators only between steps", () => {
    renderStepper({ index: 0 });

    const steps = screen.getAllByTestId("stepper-step");
    const separators = screen.getAllByTestId("stepper-separator");

    expect(separators).toHaveLength(steps.length - 1);
  });

  it("should filter out invalid children", () => {
    renderStepper({
      index: 0,
      children: [
        <Step key="valid-step">Valid Step</Step>,
        <div key="invalid-child">Invalid Child</div>,
        <Step key="another-valid-step">Another Valid Step</Step>,
      ],
    });

    expect(screen.queryByText("Invalid Child")).not.toBeInTheDocument();
    expect(screen.getByText("Valid Step")).toBeInTheDocument();
    expect(screen.getByText("Another Valid Step")).toBeInTheDocument();
  });
});

describe("Stepper.Step", () => {
  it("should render its children", () => {
    render(<Step>Step 1</Step>);
    expect(screen.getByText("Step 1")).toBeInTheDocument();
  });
});
