import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { DropdownMenu } from "./DropdownMenu";
import { type DropdownMenuContentProps } from "./types";

const renderDropdownMenu = (item: DropdownMenuContentProps) =>
  render(<DropdownMenu arrow trigger="icon" menuContent={[item]} />);

describe("DropdownMenu", () => {
  it("should render with a label item", () => {
    const { container } = renderDropdownMenu({ type: "label", text: "label" });
    const root = container.querySelector('[data-testid="label"]');
    expect(root).toBeDefined();
  });

  it("should render with an item", () => {
    const { container } = renderDropdownMenu({
      type: "item",
      text: "item",
      rightSlot: "rightSlotItem",
      onClick: vi.fn(),
    });
    const root = container.querySelector('[data-testid="item"]');
    expect(root).toBeDefined();
  });

  it("should render with a disabled item", () => {
    const { container } = renderDropdownMenu({
      type: "item",
      text: "item",
      rightSlot: "rightSlotItem",
      onClick: vi.fn(),
      disable: true,
    });
    const root = container.querySelector('[data-testid="item"]');
    expect(root).toBeDefined();
  });

  it("should render with a separator", () => {
    const { container } = renderDropdownMenu({ type: "separator" });
    const root = container.querySelector('[data-testid="separator"]');
    expect(root).toBeDefined();
  });

  it("should render with a check item", () => {
    const { container } = renderDropdownMenu({
      type: "check",
      text: "check",
      isCheck: true,
      onChange: vi.fn(),
    });
    const root = container.querySelector('[data-testid="check"]');
    expect(root).toBeDefined();
  });

  it("should render with a radio group", () => {
    const { container } = renderDropdownMenu({
      type: "radioGroup",
      selected: "selected",
      options: ["selected", "unselected"],
      onChange: vi.fn(),
    });
    const root = container.querySelector('[data-testid="radioGroup"]');
    expect(root).toBeDefined();
  });

  it("should render with a submenu", () => {
    const { container } = renderDropdownMenu({
      type: "subMenu",
      text: "subMenu",
      subMenuElements: [{ type: "label", text: "label" }],
    });
    const root = container.querySelector('[data-testid="subMenu"]');
    expect(root).toBeDefined();
  });

  it("should render inside a custom container when one is provided", () => {
    const customContainer = document.createElement("div");
    document.body.appendChild(customContainer);

    render(
      <DropdownMenu
        arrow
        trigger="icon"
        container={customContainer}
        menuContent={[{ type: "label", text: "label" }]}
      />,
    );

    expect(
      customContainer.querySelector("[data-radix-popper-content-wrapper]"),
    ).toBeDefined();
    customContainer.remove();
  });
});
