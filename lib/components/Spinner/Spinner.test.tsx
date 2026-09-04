import { describe, it, expect } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { Spinner } from "./Spinner";
import { SIZES_WITH_XL, SPINNER_TYPES } from "lib/utils/constants";

const SPINNER_TEST_ID = "spinner";

const renderSpinner = (props = {}) => {
  cleanup();
  render(<Spinner data-testid={SPINNER_TEST_ID} {...props} />);

  const [root, element] = screen.getAllByTestId(SPINNER_TEST_ID);

  return { root, element };
};

describe("Spinner", () => {
  it("should render with default variants and apply additional props", () => {
    const { root } = renderSpinner();

    expect(root.className).toContain("linearFlashingDots");
    expect(root.className).toContain("md");
    expect(root).toBeInTheDocument();
  });

  it.each(SIZES_WITH_XL)("should render with size variant %s", (size) => {
    const { root } = renderSpinner({ size });
    expect(root.className).toContain(size);
  });

  it.each(SPINNER_TYPES)("should render with type variant %s", (type) => {
    const { element } = renderSpinner({ type });
    expect(element.className).toContain(type);
  });
});
