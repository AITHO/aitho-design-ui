import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MenuDropdown } from "./MenuDropdown";
import { convertMenuItems } from "../utils";
import { MenuItem } from "../types";

vi.mock("../utils", () => ({
  convertMenuItems: vi.fn(() => [{ label: "Test Item" }]),
}));

vi.mock("lib/main", () => ({
  DropdownMenu: ({
    trigger,
    side,
    align,
    sideOffset,
    onOpenChange,
  }: {
    trigger: React.ReactNode;
    side: string;
    align: string;
    sideOffset: number;
    onOpenChange: (open: boolean) => void;
  }) => (
    <div
      data-testid="dropdown-menu"
      data-side={side}
      data-align={align}
      data-side-offset={String(sideOffset)}
    >
      {trigger}
      <button type="button" onClick={() => onOpenChange(true)}>
        Open menu
      </button>
    </div>
  ),
}));

const handleMenuOpenChange = vi.fn();

const defaultProps = {
  menuItems: [
    {
      onClick: () => {
        console.log("test");
      },
      type: "item",
      text: "Test",
    } satisfies MenuItem,
  ],
  menuConfig: {
    visible: true,
  },
  handleMenuOpenChange,
  classes: { itemMenuButton: "test-class" },
};

const renderMenuDropdown = (props = {}) =>
  render(<MenuDropdown {...defaultProps} {...props} />);

describe("MenuDropdown", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render vertical dots by default and convert menu items", () => {
    renderMenuDropdown();

    expect(screen.getByTestId("dots-vertical-icon")).toBeInTheDocument();
    expect(convertMenuItems).toHaveBeenCalledWith(defaultProps.menuItems);
  });

  it("should render horizontal dots when specified", () => {
    renderMenuDropdown({
      menuConfig: { iconDirection: "horizontal", visible: true },
    });

    expect(screen.getByTestId("dots-horizontal-icon")).toBeInTheDocument();
  });

  it("should render a custom icon when provided", () => {
    const CustomIcon = () => <div data-testid="custom-icon">Custom</div>;

    renderMenuDropdown({
      menuConfig: {
        customIcon: <CustomIcon />,
        visible: true,
      },
    });

    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("should pass default position props to DropdownMenu", () => {
    renderMenuDropdown();

    const dropdownMenu = screen.getByTestId("dropdown-menu");

    expect(dropdownMenu).toHaveAttribute("data-side", "right");
    expect(dropdownMenu).toHaveAttribute("data-align", "start");
    expect(dropdownMenu).toHaveAttribute("data-side-offset", "1");
  });

  it("should pass custom position props and forward open state changes", () => {
    renderMenuDropdown({
      menuConfig: {
        visible: true,
        position: {
          side: "left",
          align: "end",
          offset: 12,
        },
      },
    });

    const dropdownMenu = screen.getByTestId("dropdown-menu");

    expect(dropdownMenu).toHaveAttribute("data-side", "left");
    expect(dropdownMenu).toHaveAttribute("data-align", "end");
    expect(dropdownMenu).toHaveAttribute("data-side-offset", "12");

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(handleMenuOpenChange).toHaveBeenCalledWith(true);
  });
});
