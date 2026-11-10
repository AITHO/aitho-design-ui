import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { useRef } from "react";
import "@testing-library/jest-dom";
import { Scrollbar } from "./Scrollbar";

// jsdom has no layout: give the box the sizes a browser would measure.
const sized =
  (scrollHeight: number, clientHeight: number) =>
  (node: HTMLDivElement | null) => {
    if (!node) return;
    Object.defineProperty(node, "scrollHeight", {
      configurable: true,
      value: scrollHeight,
    });
    Object.defineProperty(node, "clientHeight", {
      configurable: true,
      value: clientHeight,
    });
  };

const Box = ({
  scrollHeight,
  clientHeight,
}: {
  scrollHeight: number;
  clientHeight: number;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  return (
    <div style={{ position: "relative" }}>
      <div
        data-testid="box"
        ref={(node) => {
          sized(scrollHeight, clientHeight)(node);
          ref.current = node;
        }}
      />
      <Scrollbar targetRef={ref} />
    </div>
  );
};

describe("Scrollbar", () => {
  it("shows a thumb sized to the visible share while the content overflows", () => {
    const { container, getByTestId } = render(
      <Box scrollHeight={400} clientHeight={202} />,
    );
    const thumb = container.querySelector(".scrollbar-thumb") as HTMLElement;

    expect(thumb).toBeVisible();
    // Track 200px (202 minus 1px at each end), about half of the content visible: a 101px thumb.
    expect(thumb.style.height).toBe("101px");
    expect(getByTestId("box")).toHaveAttribute("data-overflowing");
    expect(getByTestId("box")).toHaveAttribute("data-aitho-scrollbar");
  });

  it("stays hidden, and leaves no room for itself, when everything fits", () => {
    const { container, getByTestId } = render(
      <Box scrollHeight={200} clientHeight={200} />,
    );

    expect(container.querySelector(".scrollbar-thumb")).not.toBeVisible();
    expect(getByTestId("box")).not.toHaveAttribute("data-overflowing");
  });
});
