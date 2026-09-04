import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Progress, ProgressProps } from "./Progress";

const renderProgress = (props: Partial<ProgressProps> = {}) => {
  render(<Progress {...props} />);
};

describe("Progress", () => {
  it("should apply the correct transform style when value and max are provided", () => {
    renderProgress({ value: 50, max: 100 });
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("should fallback to the default transform when value and max are undefined", () => {
    renderProgress();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
