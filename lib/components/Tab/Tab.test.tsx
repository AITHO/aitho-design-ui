import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
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
});
