import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Avatar } from "./Avatar";

describe("Avatar", () => {
  it.each([
    {
      name: "full name",
      input: "Rick Sanchez",
      expected: "RS",
    },
    { name: "single name", input: "Rick", expected: "R" },
    { name: "multiple words", input: "Rick & Morty", expected: "RM" },
    {
      name: "with whitespace",
      input: " Rick    and    Morty",
      expected: "RM",
    },
  ])("should generate correct initials for $name", ({ input, expected }) => {
    render(<Avatar name={input} />);
    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  it("should render an empty fallback for a whitespace-only name", () => {
    const { container } = render(<Avatar name="   " />);
    expect(container.textContent).toBe("");
  });

  it("should render children when no image or name is provided", () => {
    render(<Avatar>Rick</Avatar>);
    expect(screen.getByText("Rick")).toBeInTheDocument();
  });
});
