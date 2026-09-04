import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { List } from "./List";
import "@testing-library/jest-dom";

const renderList = () =>
  render(
    <List
      items={[
        {
          leftSlot: ["Stringa 1"],
          rightSlot: ["Stringa 2"],
        },
      ]}
    />,
  );

describe("List", () => {
  it("should render the list", () => {
    renderList();
    expect(screen.getByText("Stringa 1")).toBeInTheDocument();
  });
});
