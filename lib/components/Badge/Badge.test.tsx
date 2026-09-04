import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge, BadgeProps } from "./Badge";
import { BASE_POSITIONS } from "lib/utils/constants";

const renderBadge = (props: Partial<BadgeProps> = {}) =>
  render(<Badge {...props}>{props.children ?? <div>Content</div>}</Badge>);

describe("Badge", () => {
  it("should display the correct count", () => {
    renderBadge({ count: 5 });
    expect(screen.getByText("5")).toBeTruthy();
  });

  it("should respect the max prop", () => {
    renderBadge({ count: 100, max: 99 });
    expect(screen.getByText("99+")).toBeTruthy();
  });

  it("should hide the badge when count is zero and showZero is false", () => {
    const { container } = renderBadge({ count: 0, showZero: false });
    expect(container.querySelector('[class*="badge"]')).toBeFalsy();
  });

  it("should render the dot variant without count", () => {
    const { queryByText } = renderBadge({ count: 10, type: "dot" });
    expect(queryByText("10")).toBeFalsy();
  });

  it("should hide the badge when invisible is true", () => {
    const { container } = renderBadge({ invisible: true });
    expect(container.querySelector('[class*="badge"]')).toBeFalsy();
  });

  it.each(BASE_POSITIONS)(
    "should apply the %s placement correctly",
    (placement) => {
      const { container } = renderBadge({ count: 1, placement });
      expect(container.querySelector('[class*="badge"]')?.className).toContain(
        placement,
      );
    },
  );

  it("should render custom content", () => {
    renderBadge({ content: <div>Custom</div> });
    expect(screen.getByText("Custom")).toBeTruthy();
  });
});
