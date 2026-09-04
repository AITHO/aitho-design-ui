import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SidebarItemComponent } from "./SidebarItemComponent";
import { SidebarItem } from "../types";
import { CheckIcon, Pencil1Icon } from "@radix-ui/react-icons";

const mockClasses = {
  item: "item",
  itemContainer: "itemContainer",
  itemText: "itemText",
  itemInput: "itemInput",
  itemIcon: "itemIcon",
  editContainer: "editContainer",
  editActions: "editActions",
  subItems: "subItems",
  itemMenuButton: "itemMenuButton",
};

const mockItem: SidebarItem = {
  key: "1",
  text: "Test Item",
  editable: true,
};

const mockNestedItem: SidebarItem = {
  key: "parent",
  text: "Parent Item",
  subItems: [
    { key: "child1", text: "Child 1" },
    { key: "child2", text: "Child 2" },
  ],
};

const defaultMenuItems = [
  {
    type: "item" as const,
    text: "Edit",
    onClick: () => console.log("Edit clicked"),
    rightSlot: <Pencil1Icon data-testid="edit-button" />,
    action: "edit" as const,
  },
];

const disabledItemOnClick = vi.fn();
const leafItemOnClick = vi.fn();
const nestedToggleSubItems = vi.fn();
const saveOnItemTextChange = vi.fn();
const saveHandleMenuOpenChange = vi.fn();
const saveItemOnClick = vi.fn();
const cancelHandleMenuOpenChange = vi.fn();
const cancelItemOnClick = vi.fn();
const inputItemOnClick = vi.fn();
const inputToggleSubItems = vi.fn();
const passthroughMenuItemOnClick = vi.fn();

const defaultProps = {
  item: mockItem,
  level: 0,
  isOpen: false,
  expandedItems: new Set<string>(),
  toggleSubItems: vi.fn(),
  classes: mockClasses,
  handleMenuOpenChange: vi.fn(),
  selectedItemRef: { current: null },
};

const renderSidebarItemComponent = (props = {}) =>
  render(<SidebarItemComponent {...defaultProps} {...props} />);

describe("SidebarItemComponent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render item text with the correct indentation and icon", () => {
    const itemWithIcon = {
      ...mockItem,
      icon: <CheckIcon data-testid="check-icon" />,
    };

    renderSidebarItemComponent({ item: itemWithIcon, level: 2 });

    expect(screen.getByTestId("item-text")).toHaveTextContent("Test Item");
    expect(screen.getByTestId("sidebar-item-button")).toHaveStyle({
      paddingLeft: "3.15rem",
    });
    expect(screen.getByTestId("check-icon")).toBeInTheDocument();
  });

  it("should expose the open state on the item text when the sidebar is open", () => {
    renderSidebarItemComponent({ isOpen: true });

    expect(screen.getByTestId("item-text")).toHaveAttribute(
      "data-state",
      "open",
    );
  });

  it("should mark the item as selected and assign the selected ref", () => {
    const ref = { current: null };

    renderSidebarItemComponent({
      lastSelectedKey: mockItem.key,
      selectedItemRef: ref,
    });

    expect(screen.getByTestId("sidebar-item-button")).toHaveAttribute(
      "data-selected",
      "true",
    );
    expect(ref.current).toHaveAttribute("data-selected", "true");
  });

  it("should mark the item as selected when a nested child is selected", () => {
    renderSidebarItemComponent({
      item: {
        ...mockNestedItem,
        subItems: [
          { key: "child1", text: "Child 1", selected: true },
          { key: "child2", text: "Child 2" },
        ],
      },
      expandedItems: new Set(["parent"]),
    });

    const parentButton = screen
      .getByText("Parent Item")
      .closest("[data-testid='sidebar-item-button']");

    expect(parentButton).toHaveAttribute("data-selected", "true");
    expect(screen.getByTestId("sub-items-container")).toHaveAttribute(
      "data-selected",
      "true",
    );
  });

  it("should disable the button and avoid clicks when the item is disabled", () => {
    renderSidebarItemComponent({
      item: { ...mockItem, disabled: true, onClick: disabledItemOnClick },
    });

    fireEvent.click(screen.getByTestId("sidebar-item-button"));

    expect(screen.getByTestId("sidebar-item-button")).toHaveAttribute(
      "data-disabled",
      "true",
    );
    expect(disabledItemOnClick).not.toHaveBeenCalled();
  });

  it("should call onClick when a leaf item is clicked", () => {
    renderSidebarItemComponent({
      item: { ...mockItem, onClick: leafItemOnClick },
    });

    fireEvent.click(screen.getByTestId("sidebar-item-button"));
    expect(leafItemOnClick).toHaveBeenCalled();
  });

  it("should toggle subitems and render nested items when expanded", () => {
    const { rerender } = renderSidebarItemComponent({
      item: mockNestedItem,
      toggleSubItems: nestedToggleSubItems,
      expandedItems: new Set(),
    });

    expect(screen.queryByTestId("sub-items-container")).not.toBeInTheDocument();

    fireEvent.click(screen.getByTestId("sidebar-item-button"));
    expect(nestedToggleSubItems).toHaveBeenCalledWith("parent");

    rerender(
      <SidebarItemComponent
        {...defaultProps}
        item={mockNestedItem}
        expandedItems={new Set(["parent"])}
        toggleSubItems={nestedToggleSubItems}
      />,
    );

    expect(screen.getByTestId("sub-items-container")).toBeInTheDocument();
    expect(screen.getByText("Child 1")).toBeInTheDocument();
    expect(screen.getByText("Child 2")).toBeInTheDocument();
  });

  it("should enter edit mode when the edit action is triggered", () => {
    renderSidebarItemComponent({
      item: { ...mockItem, editable: true, menuItems: defaultMenuItems },
      menuConfig: {
        visible: true,
        customIcon: <Pencil1Icon data-testid="icon-menu-test" />,
      },
    });

    fireEvent.click(screen.getByTestId("icon-menu-test"));

    expect(screen.getByTestId("save-button")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("should preserve non-edit menu items without entering edit mode", () => {
    renderSidebarItemComponent({
      item: {
        ...mockItem,
        menuItems: [
          {
            type: "item" as const,
            text: "Open",
            action: "open" as const,
            onClick: passthroughMenuItemOnClick,
          },
        ],
      },
      menuConfig: {
        visible: true,
        customIcon: <Pencil1Icon data-testid="icon-menu-test" />,
      },
    });

    fireEvent.click(screen.getByTestId("icon-menu-test"));

    expect(passthroughMenuItemOnClick).toHaveBeenCalled();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("should save edited text, close edit mode, and stop parent interactions", () => {
    renderSidebarItemComponent({
      onItemTextChange: saveOnItemTextChange,
      handleMenuOpenChange: saveHandleMenuOpenChange,
      item: {
        ...mockItem,
        onClick: saveItemOnClick,
        editable: true,
        menuItems: defaultMenuItems,
      },
      menuConfig: {
        visible: true,
        customIcon: <Pencil1Icon data-testid="icon-menu-test" />,
      },
    });

    fireEvent.click(screen.getByTestId("icon-menu-test"));
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "  New Text  " },
    });
    fireEvent.click(screen.getByTestId("save-button"));

    expect(saveOnItemTextChange).toHaveBeenCalledWith("New Text");
    expect(saveHandleMenuOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(saveItemOnClick).not.toHaveBeenCalled();
  });

  it("should cancel edit mode and keep parent interactions stopped", () => {
    renderSidebarItemComponent({
      handleMenuOpenChange: cancelHandleMenuOpenChange,
      item: {
        ...mockItem,
        onClick: cancelItemOnClick,
        editable: true,
        menuItems: defaultMenuItems,
      },
      menuConfig: {
        visible: true,
        customIcon: <Pencil1Icon data-testid="icon-menu-test" />,
      },
    });

    fireEvent.click(screen.getByTestId("icon-menu-test"));
    fireEvent.click(screen.getByTestId("cancel-button"));

    expect(cancelHandleMenuOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(cancelItemOnClick).not.toHaveBeenCalled();
  });

  it("should stop propagation when clicking inside the edit input", () => {
    renderSidebarItemComponent({
      toggleSubItems: inputToggleSubItems,
      item: {
        ...mockItem,
        onClick: inputItemOnClick,
        editable: true,
        menuItems: defaultMenuItems,
      },
      menuConfig: {
        visible: true,
        customIcon: <Pencil1Icon data-testid="icon-menu-test" />,
      },
    });

    fireEvent.click(screen.getByTestId("icon-menu-test"));
    fireEvent.click(screen.getByRole("textbox"));

    expect(inputItemOnClick).not.toHaveBeenCalled();
    expect(inputToggleSubItems).not.toHaveBeenCalled();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });
});
