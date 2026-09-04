import { render, screen, fireEvent, createEvent } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { SelectTags } from "./SelectTags";

const options = ["Option 1", "Option 2", "Option 3"];

const onChange = vi.fn();

type NavigationStep = string | { direction: string; times: number };

const mockBounds = {
  top: 400,
  bottom: 450,
  height: 50,
  width: 100,
  left: 0,
  right: 100,
  x: 0,
  y: 400,
};

const mockBoundsWithToJSON = {
  ...mockBounds,
  toJSON: () => mockBounds,
};

const renderSelectTags = (props = {}) => {
  return render(
    <>
      <SelectTags
        options={options}
        value={[]}
        onChange={onChange}
        placeholder={"Select an option"}
        {...props}
      />
      <div data-testid={"outside-element"}>Outside</div>
    </>,
  );
};

const simulateKeyDown = (
  key: string,
  target = screen.getByPlaceholderText("Select an option"),
) => {
  fireEvent.keyDown(target, { key, code: key });
};

const simulateArrowNavigation = (direction: string, times = 1) => {
  const key = direction === "up" ? "ArrowUp" : "ArrowDown";
  for (let i = 0; i < times; i++) {
    simulateKeyDown(key);
  }
};

const setupKeyboardTest = () => {
  renderSelectTags();
  const inputElement = screen.getByPlaceholderText("Select an option");
  inputElement.focus();
  fireEvent.click(inputElement);
  return inputElement;
};

const testNavigationAndSelection = (
  navigationSteps: NavigationStep[],
  expectedOption: string,
) => {
  const originalScrollIntoView = window.HTMLElement.prototype.scrollIntoView;
  window.HTMLElement.prototype.scrollIntoView = vi.fn();

  try {
    setupKeyboardTest();
    navigationSteps.forEach((step) => {
      if (typeof step === "string") {
        simulateArrowNavigation(step);
      } else {
        simulateArrowNavigation(step.direction, step.times);
      }
    });
    simulateKeyDown("Enter");
    expect(onChange).toHaveBeenCalledWith([expectedOption]);
  } finally {
    window.HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
  }
};

describe("SelectTags", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should render the no data state", () => {
    renderSelectTags({ options: [], isSelect: true });
    fireEvent.click(screen.getByTestId("input"));
    expect(screen.getByTestId("no-data")).toBeInTheDocument();
  });

  it("should filter options based on the input value", () => {
    renderSelectTags();

    fireEvent.change(screen.getByTestId("input"), {
      target: { value: "2" },
    });

    expect(screen.getByText("Option 2")).toBeInTheDocument();
    expect(screen.queryByText("Option 1")).not.toBeInTheDocument();
    expect(screen.queryByText("Option 3")).not.toBeInTheDocument();
  });

  it("should call onChange with the correct value when an option is selected", () => {
    renderSelectTags();

    const inputElement = screen.getByPlaceholderText("Select an option");
    fireEvent.click(inputElement);

    const optionToSelect = screen.getByText("Option 2");
    fireEvent.click(optionToSelect);

    expect(onChange).toHaveBeenCalledWith(["Option 2"]);
  });

  it("should remove a selected tag when the delete icon is clicked", () => {
    renderSelectTags({ value: ["Option 1", "Option 2"] });

    fireEvent.click(screen.getByTestId("remove-icon-Option 1"));

    expect(onChange).toHaveBeenCalledWith(["Option 2"]);
  });

  it("should close the dropdown when clicking outside the component", () => {
    renderSelectTags();

    fireEvent.click(screen.getByTestId("input"));
    expect(screen.getByTestId("dropdown")).toHaveClass(
      "aitho-selectTags__dropdownOpen",
    );

    fireEvent.mouseDown(screen.getAllByTestId("outside-element")[0]);
    expect(screen.getByTestId("dropdown")).not.toHaveClass("dropdownOpen");
  });

  it("closes dropdown if click is inside viewport boundaries and outside the component", () => {
    renderSelectTags();

    fireEvent.click(screen.getByTestId("input"));
    expect(screen.getByTestId("dropdown")).toHaveClass(
      "aitho-selectTags__dropdownOpen",
    );

    fireEvent.mouseDown(document, {
      clientX: document.documentElement.offsetWidth - 10,
      clientY: document.documentElement.offsetHeight - 10,
    });

    expect(screen.getByTestId("dropdown")).not.toHaveClass("dropdownOpen");
  });

  it("should toggle the dropdown when the toggle icon is clicked", () => {
    renderSelectTags();

    fireEvent.click(screen.getByTestId("toggle-icon"));
    expect(screen.getByTestId("dropdown")).toHaveClass(
      "aitho-selectTags__dropdownOpen",
    );

    fireEvent.click(screen.getByTestId("toggle-icon"));
    expect(screen.getByTestId("dropdown")).not.toHaveClass("dropdownOpen");
  });

  it("should wrap keyboard navigation with ArrowDown", () => {
    testNavigationAndSelection([{ direction: "down", times: 4 }], "Option 1");
  });

  it("should wrap keyboard navigation with ArrowUp", () => {
    testNavigationAndSelection([{ direction: "up", times: 4 }], "Option 3");
  });

  it("should open the dropdown when ArrowDown is pressed while it is closed", () => {
    renderSelectTags();

    simulateKeyDown("ArrowDown", screen.getByTestId("input"));

    expect(screen.getByTestId("dropdown")).toHaveClass(
      "aitho-selectTags__dropdownOpen",
    );
    expect(onChange).not.toHaveBeenCalled();
  });

  it("should open the dropdown when ArrowUp is pressed while it is closed", () => {
    renderSelectTags();

    simulateKeyDown("ArrowUp", screen.getByTestId("input"));

    expect(screen.getByTestId("dropdown")).toHaveClass(
      "aitho-selectTags__dropdownOpen",
    );
    expect(onChange).not.toHaveBeenCalled();
  });

  it("should open the dropdown when Enter is pressed while it is closed", () => {
    renderSelectTags();

    simulateKeyDown("Enter", screen.getByTestId("input"));
    expect(screen.getByTestId("dropdown")).toHaveClass(
      "aitho-selectTags__dropdownOpen",
    );
  });

  it("should prevent default and close the dropdown when Escape is pressed", () => {
    renderSelectTags();

    const input = screen.getByTestId("input");
    fireEvent.click(input);
    expect(screen.getByTestId("dropdown")).toHaveClass(
      "aitho-selectTags__dropdownOpen",
    );

    const escapeEvent = createEvent.keyDown(input, {
      key: "Escape",
      code: "Escape",
    });
    const preventDefaultSpy = vi.spyOn(escapeEvent, "preventDefault");

    fireEvent(input, escapeEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(screen.getByTestId("dropdown")).not.toHaveClass(
      "aitho-selectTags__dropdownOpen",
    );
  });

  it("should ignore unhandled keys when the dropdown is open", () => {
    renderSelectTags();

    const input = screen.getByTestId("input");
    fireEvent.click(input);
    expect(screen.getByTestId("dropdown")).toHaveClass(
      "aitho-selectTags__dropdownOpen",
    );

    input.focus();
    simulateKeyDown("Tab", input);

    expect(screen.getByTestId("dropdown")).toHaveClass(
      "aitho-selectTags__dropdownOpen",
    );
    expect(onChange).not.toHaveBeenCalled();
  });

  it("should not add duplicate options", () => {
    renderSelectTags({ value: ["Option 1"] });

    fireEvent.click(screen.getByTestId("input"));

    fireEvent.change(screen.getByTestId("input"), {
      target: { value: "Option 1" },
    });

    simulateKeyDown("Enter", screen.getByTestId("input"));

    expect(onChange).not.toHaveBeenCalled();
  });

  it("should add the input value as a new option when clicked", () => {
    renderSelectTags();

    fireEvent.change(screen.getByTestId("input"), {
      target: { value: "New Option" },
    });

    fireEvent.click(screen.getByText("New Option"));

    expect(onChange).toHaveBeenCalledWith(["New Option"]);
  });

  it("should add the trimmed input value when Enter is pressed without a highlighted option", () => {
    renderSelectTags();

    const input = screen.getByTestId("input");
    fireEvent.change(input, { target: { value: "  New Value  " } });
    input.focus();

    simulateKeyDown("Enter", input);
    simulateKeyDown("Enter", input);

    expect(onChange).toHaveBeenCalledWith(["New Value"]);
  });

  it("should close the dropdown when the input is focused and the wrapper is clicked again", () => {
    renderSelectTags();

    const inputElement = screen.getByTestId("input");
    fireEvent.click(inputElement);
    expect(screen.getByTestId("dropdown")).toHaveClass(
      "aitho-selectTags__dropdownOpen",
    );

    inputElement.focus();

    const inputWrapper = inputElement.parentElement;
    if (inputWrapper) {
      fireEvent.click(inputWrapper);
    }

    expect(screen.getByTestId("dropdown")).not.toHaveClass("dropdownOpen");
  });

  it("should set the dropdown position to up when there is not enough space below", () => {
    const originalGetBoundingClientRect =
      Element.prototype.getBoundingClientRect;
    const originalInnerHeight = window.innerHeight;

    Element.prototype.getBoundingClientRect = vi.fn(() => mockBoundsWithToJSON);

    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 500,
    });

    renderSelectTags();
    fireEvent.click(screen.getByTestId("input"));

    const dropdown = screen.getByTestId("dropdown");
    expect(dropdown.className).toContain("dropdownUp");

    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    window.innerHeight = originalInnerHeight;
  });
});
