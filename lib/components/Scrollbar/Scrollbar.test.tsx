import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { useRef } from "react";
import "@testing-library/jest-dom";
import { Scrollbar, type ScrollbarProps } from "./Scrollbar";

// jsdom has no layout: give the box the sizes a browser would measure.
const Box = ({
  sizes,
  orientation,
}: {
  sizes: Record<string, number>;
  orientation?: ScrollbarProps["orientation"];
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  return (
    <div style={{ position: "relative" }}>
      <div
        data-testid="box"
        ref={(node) => {
          if (node)
            Object.entries(sizes).forEach(([key, value]) =>
              Object.defineProperty(node, key, { configurable: true, value }),
            );
          ref.current = node;
        }}
      />
      <Scrollbar targetRef={ref} orientation={orientation} />
    </div>
  );
};

const thumbOf = (container: HTMLElement) =>
  container.querySelector(".scrollbar-thumb") as HTMLElement;

describe("Scrollbar", () => {
  it("shows a thumb sized to the visible share while the content overflows", () => {
    const { container, getByTestId } = render(
      <Box sizes={{ scrollHeight: 400, clientHeight: 202 }} />,
    );
    const thumb = thumbOf(container);

    expect(thumb).toBeVisible();
    // Track 200px (202 minus 1px at each end), about half of the content visible: a 101px thumb.
    expect(thumb.style.height).toBe("101px");
    expect(getByTestId("box")).toHaveAttribute("data-overflowing");
    expect(getByTestId("box")).toHaveAttribute("data-aitho-scrollbar");
  });

  it("stays hidden, and leaves no room for itself, when everything fits", () => {
    const { container, getByTestId } = render(
      <Box sizes={{ scrollHeight: 200, clientHeight: 200 }} />,
    );

    expect(thumbOf(container)).not.toBeVisible();
    expect(getByTestId("box")).not.toHaveAttribute("data-overflowing");
  });

  it("runs along the bottom edge when horizontal", () => {
    const { container } = render(
      <Box
        orientation="horizontal"
        sizes={{ scrollWidth: 824, clientWidth: 412, clientHeight: 100 }}
      />,
    );
    const thumb = thumbOf(container);

    expect(thumb).toBeVisible();
    // Track 400px (412 minus 6px at each end), half of the table visible: a 200px thumb.
    expect(thumb.style.width).toBe("200px");
    expect(thumb.style.height).toBe("6px");
    // 100px tall box: 6px thumb, 2px off the bottom edge.
    expect(thumb.style.top).toBe("92px");
  });
});
