import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import { ItemMenuButton } from "./ItemMenuButton";

const defaultProps = {
  item: { key: "test-key", text: "Test Item" },
  hasSubItems: false,
  expandedItems: new Set<string>(),
  toggleSubItems: vi.fn(),
  handleMenuOpenChange: vi.fn(),
  classes: { itemMenuButton: "test-class" },
};

const nonDropdownOnClick = vi.fn();
const subItemsToggleSubItems = vi.fn();
const propagationOnClick = vi.fn();

const renderItemMenuButton = (props = {}) =>
  render(<ItemMenuButton {...defaultProps} {...props} />);

describe("ItemMenuButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return null when the item is disabled", () => {
    renderItemMenuButton({
      item: { ...defaultProps.item, disabled: true },
    });

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("should return null when the menu config is not visible", () => {
    renderItemMenuButton({
      menuConfig: { visible: false },
    });

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("should render a menu button with horizontal dots when specified", () => {
    renderItemMenuButton({
      menuConfig: { visible: true, iconDirection: "horizontal" },
    });

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should render a custom icon when provided", () => {
    const CustomIcon = () => <div data-testid="custom-icon">Custom</div>;

    renderItemMenuButton({
      menuConfig: { visible: true, customIcon: <CustomIcon /> },
    });

    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("should handle clicks on a non-dropdown menu", () => {
    renderItemMenuButton({
      menuConfig: {
        visible: true,
        withDropDown: false,
        defaultItems: [
          { type: "item", text: "Test Item", onClick: nonDropdownOnClick },
        ],
      },
    });

    fireEvent.click(screen.getByRole("button"));
    expect(nonDropdownOnClick).toHaveBeenCalled();
  });

  it("should render MenuDropdown when withDropDown is true", () => {
    renderItemMenuButton({
      menuConfig: {
        visible: true,
        withDropDown: true,
        defaultItems: [],
      },
    });

    expect(screen.getByTestId("dots-vertical-icon")).toBeInTheDocument();
  });

  it("should render arrow icons for collapsed and expanded subitems", () => {
    const { rerender } = renderItemMenuButton({
      hasSubItems: true,
      expandedItems: new Set(),
    });
    const button = screen.getByRole("button");
    const initialMarkup = button.innerHTML;

    rerender(
      <ItemMenuButton
        {...defaultProps}
        hasSubItems={true}
        expandedItems={new Set(["test-key"])}
      />,
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByRole("button").innerHTML).not.toBe(initialMarkup);
  });

  it("should call toggleSubItems when clicking on the subitems arrow", () => {
    renderItemMenuButton({
      hasSubItems: true,
      toggleSubItems: subItemsToggleSubItems,
    });

    fireEvent.click(screen.getByRole("button"));
    expect(subItemsToggleSubItems).toHaveBeenCalledWith("test-key");
  });

  it("should prevent event propagation on menu button click", () => {
    renderItemMenuButton({
      menuConfig: {
        visible: true,
        withDropDown: false,
        defaultItems: [
          { type: "item", onClick: propagationOnClick, text: "Test Item" },
        ],
      },
    });

    const event = new MouseEvent("click", { bubbles: true });
    const stopPropagation = vi.spyOn(event, "stopPropagation");

    fireEvent(screen.getByRole("button"), event);
    expect(stopPropagation).toHaveBeenCalled();
  });
});
