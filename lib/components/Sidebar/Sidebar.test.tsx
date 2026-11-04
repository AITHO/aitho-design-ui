import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Sidebar, SidebarProps } from "./Sidebar";
import { ReactNode, createRef } from "react";

vi.mock("lib/main", async (importOriginal) => {
  const actual = await importOriginal<typeof import("lib/main")>();

  return {
    ...actual,
    DropdownMenu: ({
      trigger,
      onOpenChange,
    }: {
      trigger: ReactNode;
      onOpenChange?: (open: boolean) => void;
    }) => (
      <div>
        {trigger}
        <button type="button" onClick={() => onOpenChange?.(true)}>
          Open menu
        </button>
      </div>
    ),
  };
});

interface RenderSidebarOptions {
  props?: Partial<SidebarProps>;
  children?: ReactNode;
}

const nestedItems = [
  {
    key: "1",
    text: "Parent",
    subItems: [
      { key: "1.1", text: "Child 1" },
      { key: "1.2", text: "Child 2" },
    ],
  },
  {
    key: "2",
    text: "Parent 2",
    subItems: [{ key: "2.1", text: "Child 3" }],
  },
];

const renderSidebar = ({ props = {}, children }: RenderSidebarOptions = {}) => {
  const onOpenChange = vi.fn();

  const defaultProps: SidebarProps = {
    open: false,
    items: [],
    onOpenChange,
    ...props,
  };

  const utils = render(<Sidebar {...defaultProps}>{children}</Sidebar>);

  return {
    ...utils,
    onOpenChange,
  };
};

describe("Sidebar", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("should render the sidebar with header, footer, navigation items, and data attributes", () => {
    renderSidebar({
      props: {
        open: true,
        anchor: "left",
        header: <div>Header Content</div>,
        footer: <div>Footer Content</div>,
        items: [
          { key: "1", text: "Item 1" },
          { key: "2", text: "Item 2" },
        ],
      },
    });

    const sidebar = screen.getByRole("complementary");

    expect(sidebar).toHaveAttribute("data-state", "open");
    expect(sidebar).toHaveAttribute("data-direction", "left");
    expect(screen.getByText("Header Content")).toBeInTheDocument();
    expect(screen.getByText("Footer Content")).toBeInTheDocument();
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  it("should render children instead of items when provided", () => {
    renderSidebar({
      props: { items: [{ key: "1", text: "Item 1" }] },
      children: <div>Custom Child Content</div>,
    });

    expect(screen.getByText("Custom Child Content")).toBeInTheDocument();
    expect(screen.queryByText("Item 1")).not.toBeInTheDocument();
  });

  it("should render a spinner when items are loading", () => {
    const { container } = renderSidebar({
      props: {
        items: [{ key: "1", text: "Item 1" }],
        itemsLoading: true,
      },
    });

    expect(
      container.querySelector('span[class*="circularFlashingDots"]'),
    ).toBeInTheDocument();
    expect(screen.queryByText("Item 1")).toBeNull();
    expect(screen.queryByRole("navigation")).toBeNull();
  });

  it("should return no navigation content when children, loading, and items are absent", () => {
    renderSidebar({ props: { items: [] } });

    expect(screen.queryByRole("navigation")).toBeNull();
  });

  it("should expand and collapse on hover when expandOnHover is enabled", async () => {
    const { onOpenChange } = renderSidebar({
      props: { expandOnHover: true },
    });

    const sidebar = screen.getByRole("complementary");

    await act(async () => {
      fireEvent.mouseEnter(sidebar);
      vi.runAllTimers();
    });

    expect(onOpenChange).toHaveBeenCalledWith(true);

    await act(async () => {
      fireEvent.mouseLeave(sidebar);
      vi.runAllTimers();
    });

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("should ignore hover events when expandOnHover is disabled", async () => {
    const { onOpenChange } = renderSidebar({
      props: { expandOnHover: false },
    });

    await act(async () => {
      fireEvent.mouseEnter(screen.getByRole("complementary"));
      vi.runAllTimers();
    });

    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("should keep the sidebar open on mouse leave when a menu is opened", async () => {
    const { onOpenChange } = renderSidebar({
      props: {
        expandOnHover: true,
        items: [
          {
            key: "1",
            text: "Item 1",
            menuItems: [{ text: "Edit", type: "item", onClick: vi.fn() }],
          },
        ],
        menuConfig: {
          visible: true,
          withDropDown: true,
          customIcon: <span>Menu</span>,
        },
      },
    });

    const sidebar = screen.getByRole("complementary");

    await act(async () => {
      fireEvent.mouseEnter(sidebar);
      vi.runAllTimers();
    });

    onOpenChange.mockClear();

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));

    await act(async () => {
      fireEvent.mouseLeave(sidebar);
      vi.runAllTimers();
    });

    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("should ignore outside mousedown when expandOnHover is disabled", async () => {
    const { onOpenChange } = renderSidebar({
      props: { items: [{ key: "1", text: "Item 1" }] },
    });

    await act(async () => {
      fireEvent.mouseDown(document.body);
    });

    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("should ignore outside mousedown when the sidebar is closed", async () => {
    const { onOpenChange } = renderSidebar({
      props: {
        expandOnHover: true,
        items: [{ key: "1", text: "Item 1" }],
      },
    });

    await act(async () => {
      fireEvent.mouseDown(document.body);
    });

    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("should close on outside mousedown when no dropdown is open", async () => {
    const { onOpenChange } = renderSidebar({
      props: {
        expandOnHover: true,
        items: [{ key: "1", text: "Item 1" }],
      },
    });

    await act(async () => {
      fireEvent.mouseEnter(screen.getByRole("complementary"));
      vi.runAllTimers();
    });

    onOpenChange.mockClear();

    await act(async () => {
      fireEvent.mouseDown(document.body);
    });

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("should not close on outside mousedown when a dropdown is open", async () => {
    const { onOpenChange } = renderSidebar({
      props: {
        expandOnHover: true,
        items: [{ key: "1", text: "Item 1" }],
      },
    });

    await act(async () => {
      fireEvent.mouseEnter(screen.getByRole("complementary"));
      vi.runAllTimers();
    });

    const dropdownContent = document.createElement("div");
    dropdownContent.className = "aitho-dropdown-menu__content";
    document.body.appendChild(dropdownContent);

    onOpenChange.mockClear();

    await act(async () => {
      fireEvent.mouseDown(document.body);
    });

    expect(onOpenChange).not.toHaveBeenCalled();

    dropdownContent.remove();
  });

  it("should toggle sub items when clicking a parent item", () => {
    renderSidebar({
      props: { items: nestedItems, open: true },
    });

    expect(screen.queryByText("Child 1")).toBeNull();

    fireEvent.click(screen.getByText("Parent"));
    expect(screen.getByText("Child 1")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Parent"));
    expect(screen.queryByText("Child 1")).toBeNull();
  });

  it("should expand parent items for the selected key and reset when lastSelectedKey changes", () => {
    const { rerender } = renderSidebar({
      props: {
        items: nestedItems,
        openLastSelected: true,
        lastSelectedKey: "1.1",
        open: true,
      },
    });

    expect(screen.getByText("Child 1")).toBeInTheDocument();
    expect(screen.queryByText("Child 3")).toBeNull();

    rerender(
      <Sidebar
        items={nestedItems}
        openLastSelected
        lastSelectedKey="2.1"
        open={true}
      />,
    );

    expect(screen.getByText("Child 3")).toBeInTheDocument();
    expect(screen.queryByText("Child 1")).toBeNull();
  });

  it("should scroll to the selected item when openLastSelected is enabled", async () => {
    const scrollIntoViewMock = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

    renderSidebar({
      props: {
        items: nestedItems,
        openLastSelected: true,
        lastSelectedKey: "1.1",
        open: true,
      },
    });

    await act(async () => {
      vi.runAllTimers();
    });

    expect(scrollIntoViewMock).toHaveBeenCalled();
  });

  it("should render an overlay when the drawer is open", () => {
    renderSidebar({
      props: {
        behaviour: "drawer",
        open: true,
        items: [{ key: "1", text: "Item 1" }],
      },
    });

    expect(screen.getByTestId("sidebar-overlay")).toBeInTheDocument();
    expect(screen.getByRole("complementary")).toHaveAttribute(
      "data-state",
      "open",
    );
  });

  it("should not render an overlay when the drawer is closed", () => {
    renderSidebar({
      props: {
        behaviour: "drawer",
        open: false,
        items: [{ key: "1", text: "Item 1" }],
      },
    });

    expect(screen.queryByTestId("sidebar-overlay")).toBeNull();
    expect(screen.getByRole("complementary")).toHaveAttribute(
      "data-state",
      "closed",
    );
  });

  it("should not render an overlay for non-drawer behaviours", () => {
    renderSidebar({
      props: {
        behaviour: "toggle",
        open: true,
        items: [{ key: "1", text: "Item 1" }],
      },
    });

    expect(screen.queryByTestId("sidebar-overlay")).toBeNull();
  });

  it("should call onOpenChange(false) when the drawer overlay is clicked", () => {
    const { onOpenChange } = renderSidebar({
      props: {
        behaviour: "drawer",
        open: true,
        items: [{ key: "1", text: "Item 1" }],
      },
    });

    fireEvent.click(screen.getByTestId("sidebar-overlay"));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("should clean up timers and event listeners on unmount", async () => {
    const { onOpenChange, unmount } = renderSidebar({
      props: { expandOnHover: true },
    });

    unmount();

    await act(async () => {
      fireEvent.mouseDown(document.body);
      vi.runAllTimers();
    });

    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("forwards the ref to the aside element", () => {
    const ref = createRef<HTMLElement>();
    render(<Sidebar ref={ref} />);

    expect(ref.current?.tagName).toBe("ASIDE");
  });
});
