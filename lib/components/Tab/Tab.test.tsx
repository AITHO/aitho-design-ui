import { afterEach, describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Tab, ITab } from "./Tab";

const tabsMock: ITab[] = [
  { value: "tab1", label: "Tab 1", children: <div>Content 1</div> },
  { value: "tab2", label: "Tab 2", children: <div>Content 2</div> },
  {
    value: "tab3",
    label: "Tab 3",
    children: <div>Content 3</div>,
    disabled: true,
  },
];

const tabsWithIconAndStyles: ITab[] = [
  {
    value: "tab1",
    label: "Tab 1",
    children: "Content 1",
    icon: <span>Icon</span>,
    triggerProps: { style: { color: "red" }, value: "tab1" },
    contentProps: {
      style: { backgroundColor: "lightblue" },
      value: "tab1",
    },
  },
  {
    value: "tab2",
    label: "Tab 2",
    children: "Content 2",
  },
];

const tabsWithHidden: ITab[] = [
  { value: "tab1", label: "Tab 1", children: "Content 1" },
  { value: "tab2", label: "Tab 2", children: "Content 2", hidden: true },
  { value: "tab3", label: "Tab 3", children: "Content 3" },
];

// jsdom has no layout: each trigger gets its offsets from its position among the tabs.
const index = (element: Element) => {
  let position = 0;
  for (const tab of screen.queryAllByRole("tab")) {
    if (tab === element) return position;
    position++;
  }
  return -1;
};

const mockLayout = () => {
  vi.spyOn(HTMLElement.prototype, "offsetLeft", "get").mockImplementation(
    function (this: HTMLElement) {
      return index(this) * 100;
    },
  );
  vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(
    function (this: HTMLElement) {
      return 80 + index(this) * 10;
    },
  );
};

const renderTab = (props?: Partial<React.ComponentProps<typeof Tab>>) =>
  render(<Tab tabs={tabsMock} {...props} />);

describe("Tab", () => {
  it("should render visible triggers and all tab panels", () => {
    renderTab();

    expect(screen.getByRole("tab", { name: "Tab 1" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Tab 2" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Tab 3" })).toBeInTheDocument();
    expect(screen.getByTestId("tab-content-tab1")).toBeInTheDocument();
    expect(screen.getByTestId("tab-content-tab2")).toBeInTheDocument();
    expect(screen.getByTestId("tab-content-tab3")).toBeInTheDocument();
  });

  it("should render icons and apply custom trigger and content styles", () => {
    renderTab({ tabs: tabsWithIconAndStyles });

    expect(screen.getByText("Icon")).toBeInTheDocument();
    expect(screen.getByTestId("tab-trigger-tab1")).toHaveStyle({
      color: "rgb(255, 0, 0)",
    });
    expect(screen.getByTestId("tab-content-tab1")).toHaveStyle({
      backgroundColor: "rgb(173, 216, 230)",
    });
  });

  it("should hide triggers for tabs marked as hidden while keeping their panels mounted", () => {
    renderTab({ tabs: tabsWithHidden });

    expect(
      screen.queryByRole("tab", { name: "Tab 2" }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(2);
    expect(screen.getByTestId("tab-content-tab2")).toBeInTheDocument();
  });

  it("should let the tabs wrap onto more rows when asked", () => {
    const { rerender } = renderTab();
    const list = screen.getByRole("tablist");
    expect(list.className).not.toContain("wrap_true");

    rerender(<Tab tabs={tabsMock} wrap />);
    expect(list.className).toContain("wrap_true");
  });

  describe("indicator", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    // jsdom has no layout: each trigger gets a position from its order in the list.

    it("sits under the selected tab and follows it when the selection changes", async () => {
      mockLayout();
      renderTab({ defaultValue: "tab1" });
      const indicator = screen.getByTestId("tab-indicator");

      expect(indicator.style.width).toBe("80px");
      expect(indicator.style.transform).toContain("translate(0px");
      // The first position is taken without sliding; later changes slide.
      await waitFor(() => expect(indicator).toHaveAttribute("data-ready"));

      fireEvent.mouseDown(screen.getByRole("tab", { name: "Tab 2" }), {
        button: 0,
      });

      await waitFor(() => expect(indicator.style.width).toBe("90px"));
      expect(indicator.style.transform).toContain("translate(100px");
    });

    it("runs along the right edge of a vertical list, as tall as the selected tab", async () => {
      mockLayout();
      vi.spyOn(HTMLElement.prototype, "offsetTop", "get").mockImplementation(
        function (this: HTMLElement) {
          return index(this) * 40;
        },
      );
      vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(
        36,
      );
      renderTab({ defaultValue: "tab1", orientation: "vertical" });
      const indicator = screen.getByTestId("tab-indicator");

      fireEvent.mouseDown(screen.getByRole("tab", { name: "Tab 2" }), {
        button: 0,
      });

      await waitFor(() =>
        expect(indicator.style.transform).toMatch(/, 40px\)$/),
      );
      expect(indicator.style.height).toBe("36px");
    });

    it("drops the old length when the orientation changes", async () => {
      mockLayout();
      // The indicator measures what its inline size says, 2px (the recipe's thickness) when unset.
      vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(
        function (this: HTMLElement) {
          if (this.dataset.testid === "tab-indicator")
            return Number.parseFloat(this.style.width) || 2;
          return 80 + index(this) * 10;
        },
      );
      vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockImplementation(
        function (this: HTMLElement) {
          if (this.dataset.testid === "tab-indicator")
            return Number.parseFloat(this.style.height) || 2;
          return 36;
        },
      );
      const { rerender } = renderTab({ defaultValue: "tab1" });
      const indicator = screen.getByTestId("tab-indicator");
      expect(indicator.style.width).toBe("80px");

      rerender(
        <Tab tabs={tabsMock} defaultValue="tab1" orientation="vertical" />,
      );
      await waitFor(() => expect(indicator.style.height).toBe("36px"));
      expect(indicator.style.width).toBe("");
      // On the right edge of the 80px tab: 80 - 2, not 80 - 80.
      expect(indicator.style.transform).toBe("translate(78px, 0px)");

      rerender(
        <Tab tabs={tabsMock} defaultValue="tab1" orientation="horizontal" />,
      );
      await waitFor(() => expect(indicator.style.width).toBe("80px"));
      expect(indicator.style.height).toBe("");
      // Under the 36px tab: 36 - 2, not 36 - 36.
      expect(indicator.style.transform).toBe("translate(0px, 34px)");
    });

    it("follows size changes and stops observing when it unmounts", () => {
      const observers: { callback: () => void; disconnect: () => void }[] = [];
      vi.stubGlobal(
        "ResizeObserver",
        class {
          callback: () => void;
          observe = vi.fn();
          disconnect = vi.fn();
          constructor(callback: () => void) {
            this.callback = callback;
            observers.push(this);
          }
        },
      );
      mockLayout();
      const { unmount } = renderTab({ defaultValue: "tab1" });
      const indicator = screen.getByTestId("tab-indicator");
      indicator.style.width = "";

      observers[0].callback();
      expect(indicator.style.width).toBe("80px");

      unmount();
      expect(observers[0].disconnect).toHaveBeenCalled();
      vi.unstubAllGlobals();
    });
  });
});
