import "@testing-library/jest-dom";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Popover } from "./Popover";

const renderPopover = (props = {}) => {
  return render(<Popover trigger={<div>Click me</div>} {...props} />);
};

describe("Popover", () => {
  it("should render the trigger button with the correct text", () => {
    renderPopover();
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });
});
