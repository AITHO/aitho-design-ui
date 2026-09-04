import { describe, it, expect } from "vitest";
import { filterValidHtmlProps } from "./validHtmlPropsFiltering";

describe("filterValidHtmlProps", () => {
  it("should keep valid HTML button props", () => {
    const props = {
      type: "submit",
      onClick: () => {
        console.log("Clicked");
      },
      className: "btn",
      "data-testid": "button",
      "aria-label": "Submit",
      invalidProp: "test",
    };

    const filtered = filterValidHtmlProps(props, "button");

    expect(filtered).toHaveProperty("type");
    expect(filtered).toHaveProperty("onClick");
    expect(filtered).toHaveProperty("className");
    expect(filtered).toHaveProperty("data-testid");
    expect(filtered).toHaveProperty("aria-label");
    expect(filtered).not.toHaveProperty("invalidProp");
  });

  it("should keep valid HTML input props", () => {
    const props = {
      type: "text",
      value: "test",
      onChange: () => {
        console.log("Changed");
      },
      placeholder: "Enter text",
      invalidProp: "test",
    };

    const filtered = filterValidHtmlProps(props, "input");

    expect(filtered).toHaveProperty("type");
    expect(filtered).toHaveProperty("value");
    expect(filtered).toHaveProperty("onChange");
    expect(filtered).toHaveProperty("placeholder");
    expect(filtered).not.toHaveProperty("invalidProp");
  });

  it("should handle React event props", () => {
    const props = {
      onMouseEnter: () => {
        console.log("Mouse entered");
      },
      onMouseLeave: () => {
        console.log("Mouse left");
      },
      onClick: () => {
        console.log("Clicked");
      },
      invalidProp: "test",
    };

    const filtered = filterValidHtmlProps(props, "div");

    expect(filtered).toHaveProperty("onMouseEnter");
    expect(filtered).toHaveProperty("onMouseLeave");
    expect(filtered).toHaveProperty("onClick");
    expect(filtered).not.toHaveProperty("invalidProp");
  });

  it("should handle data and aria attributes", () => {
    const props = {
      "data-testid": "test",
      "data-custom": "value",
      "aria-label": "label",
      "aria-hidden": true,
    };

    const filtered = filterValidHtmlProps(props, "div");

    expect(filtered).toHaveProperty("data-testid");
    expect(filtered).toHaveProperty("data-custom");
    expect(filtered).toHaveProperty("aria-label");
    expect(filtered).toHaveProperty("aria-hidden");
  });
});
