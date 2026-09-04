import { expect, describe, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { createRef } from "react";
import { Tooltip } from "./Tooltip";
import { Popover } from "../Popover/Popover";
import "@testing-library/jest-dom";

const renderTooltip = (props = {}) =>
  render(
    <Tooltip textContent="This is a Tooltip" {...props}>
      Hover Me
    </Tooltip>,
  );

describe("Tooltip", () => {
  it("should render the default trigger element", () => {
    renderTooltip();

    const trigger = screen.getByText("Hover Me");

    expect(trigger).toBeInTheDocument();
    expect(trigger.tagName.toLowerCase()).toBe("div");
  });

  it("should render the trigger as a button when requested", () => {
    renderTooltip({ triggerAs: "button" });

    const trigger = screen.getByText("Hover Me");

    expect(trigger.tagName.toLowerCase()).toBe("button");
  });

  it("should forward the ref to the trigger element", () => {
    const ref = createRef<HTMLElement>();

    renderTooltip({ ref });

    expect(ref.current).toBe(screen.getByText("Hover Me"));
  });

  it("should forward DOM props (e.g. onClick) to the trigger element", () => {
    const onClick = vi.fn();

    renderTooltip({ onClick, "data-custom": "yes" });

    const trigger = screen.getByText("Hover Me");
    fireEvent.click(trigger);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(trigger).toHaveAttribute("data-custom", "yes");
  });

  it("should work as `asChild` target of a Popover trigger", () => {
    // Radix Popover content measures itself with ResizeObserver, missing in jsdom.
    class ResizeObserverMock {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    }
    vi.stubGlobal("ResizeObserver", ResizeObserverMock);

    render(
      <Popover
        trigger={
          <Tooltip textContent="Open the popover">
            <button type="button">Actions</button>
          </Tooltip>
        }
      >
        Popover content
      </Popover>,
    );

    fireEvent.click(screen.getByText("Actions"));

    expect(screen.getByText("Popover content")).toBeInTheDocument();
  });
});
