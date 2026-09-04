import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Accordion } from "./Accordion";
import "@testing-library/jest-dom";

describe("Accordion", () => {
  it("should render Accordion", () => {
    render(
      <Accordion
        type="multiple"
        items={[
          {
            value: "item-1",
            header: "item 1",
            content: ["Content of item 1"],
          },
        ]}
      />,
    );
    expect(screen.getByText("item 1")).toBeInTheDocument();
  });

  it("should render Accordion with ariaDescription", () => {
    render(
      <Accordion
        type="multiple"
        items={[
          {
            value: "item-1",
            header: "item 1",
            content: ["Content of item 1"],
            ariaDescription: "Description for item 1",
          },
        ]}
      />,
    );
    expect(screen.getByText("item 1")).toBeInTheDocument();
  });
});
