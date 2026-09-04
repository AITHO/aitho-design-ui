import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Label } from "./Label";
import "@testing-library/jest-dom";

describe("Label", () => {
  it("should render without crashing", () => {
    const { container } = render(<Label>Test</Label>);
    expect(container.firstChild).toBeTruthy();
  });

  it("should render a disabled label", () => {
    render(<Label disabled={true}>Disabled</Label>);
    const label = screen.getByText(/Disabled/i);
    expect(label).toBeTruthy();
    expect(label).toHaveAttribute("disabled");
  });

  it("should render with required=true and apply 'primary' as the required variant", () => {
    const { container } = render(<Label required={true}>Required True</Label>);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("primary");
  });
});
