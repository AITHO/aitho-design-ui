import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ToggleSwitch } from "./ToggleSwitch";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

const renderToggleSwitch = (
  props: React.ComponentProps<typeof ToggleSwitch> = {},
) => render(<ToggleSwitch size="sm" {...props} />);

const handleCheckedChange = vi.fn();

describe("ToggleSwitch", () => {
  it("should render the switch with the default size", () => {
    const { container } = renderToggleSwitch();
    const toggle = screen.getByRole("switch");

    expect(container.firstChild).toBeTruthy();
    expect(toggle).toBeTruthy();
    expect(toggle.className).toContain("sm");
  });

  it("should forward disabled and checked props to the switch", () => {
    const { rerender } = renderToggleSwitch({ disabled: true });
    const toggle = screen.getByRole("switch");

    expect(toggle).toBeDisabled();

    rerender(<ToggleSwitch size="sm" checked />);

    expect(toggle).toBeChecked();
  });

  it("should support uncontrolled mode and call onCheckedChange when toggled", async () => {
    renderToggleSwitch({
      defaultChecked: true,
      onCheckedChange: handleCheckedChange,
    });
    const toggle = screen.getByRole("switch");

    expect(toggle).toBeChecked();

    await userEvent.click(toggle);

    expect(handleCheckedChange).toHaveBeenCalledTimes(1);
  });
});
