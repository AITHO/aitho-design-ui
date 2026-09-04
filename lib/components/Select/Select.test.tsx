import * as React from "react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";

import { Select } from "./Select";
import { MoonIcon } from "@radix-ui/react-icons";

interface RadixSelectContentProps {
  onOpenAutoFocus?: (event: Event) => void;
  [key: string]: unknown;
}

vi.mock("@radix-ui/react-select", async () => {
  const actual = await vi.importActual<typeof import("@radix-ui/react-select")>(
    "@radix-ui/react-select",
  );

  const MockRadixSelectContent = React.forwardRef<
    HTMLElement,
    RadixSelectContentProps
  >(({ onOpenAutoFocus, ...rest }) => {
    React.useEffect(() => {
      if (typeof onOpenAutoFocus === "function") {
        onOpenAutoFocus(new Event("openAutoFocus"));
      }
    }, [onOpenAutoFocus]);

    const ActualContent = actual.Content as React.ComponentType<unknown>;

    return React.createElement(ActualContent, { ...rest });
  });
  MockRadixSelectContent.displayName = "MockRadixSelectContent";

  return {
    ...actual,
    Content: MockRadixSelectContent,
  };
});

const mockItems = [
  { value: "1", textValue: "Opzione 1" },
  { value: "2", textValue: "Opzione 2" },
  { value: "3", textValue: "Opzione 3", disabled: true },
];

const OPTIONS_SHOWS = 2;
const OPTIONS_SHOWS_MAX_HEIGHT = `${OPTIONS_SHOWS * 2.188}rem`;
const handleChange = vi.fn();
const keydownHandler = vi.fn();

const renderSelect = (props = {}) => {
  return render(
    <Select items={mockItems} placeholder="Seleziona un'opzione" {...props} />,
  );
};

describe("Select", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call onValueChange when an option is selected", () => {
    renderSelect({ onValueChange: handleChange });

    const trigger = screen.getByRole("combobox");
    fireEvent.click(trigger);

    const option = screen.getByText("Opzione 1");
    fireEvent.click(option);

    expect(handleChange).toHaveBeenCalledWith("1");
  });

  it("should render with disabled state", () => {
    renderSelect({ disabled: true });
    const trigger = screen.getByRole("combobox");
    expect(trigger).toHaveAttribute("data-disabled");
  });

  it("should render correctly with icon", () => {
    const items = [
      {
        value: "test",
        textValue: "Test Option",
        icon: <MoonIcon data-testid="select-icon" />,
      },
    ];

    render(
      <Select value="test" items={items} placeholder="Seleziona un'opzione" />,
    );

    expect(screen.getByTestId("select-icon")).toBeInTheDocument();
  });

  it("should display value when textValue is not available", () => {
    const items = [{ value: "test-value" }];
    render(<Select items={items} placeholder="Select" />);

    const trigger = screen.getByRole("combobox");
    fireEvent.click(trigger);

    expect(screen.getByText("test-value")).toBeInTheDocument();
  });

  it("should apply the maxHeight derived from optionsShows", () => {
    renderSelect({ optionsShows: OPTIONS_SHOWS });

    const trigger = screen.getByRole("combobox");
    fireEvent.click(trigger);

    expect(document.querySelector(".select-viewport")).toHaveStyle({
      maxHeight: OPTIONS_SHOWS_MAX_HEIGHT,
    });
  });

  it("should filters items when searchable is true", () => {
    renderSelect({ searchable: true, searchablePlaceholder: "Cerca..." });

    const trigger = screen.getByRole("combobox");
    fireEvent.click(trigger);

    const searchInput = screen.getByPlaceholderText("Cerca...");
    fireEvent.change(searchInput, { target: { value: "Opzione 2" } });

    expect(screen.queryByText("Opzione 1")).not.toBeInTheDocument();
    expect(screen.getByText("Opzione 2")).toBeInTheDocument();
    expect(screen.queryByText("Opzione 3")).not.toBeInTheDocument();
  });

  it("should hide the selected item in the dropdown while searching", () => {
    renderSelect({
      value: mockItems[0].value,
      searchable: true,
      searchablePlaceholder: "Cerca...",
    });

    const trigger = screen.getByRole("combobox");
    fireEvent.click(trigger);

    const searchInput = screen.getByPlaceholderText("Cerca...");
    fireEvent.change(searchInput, { target: { value: "Opzione" } });

    const selectedItemText = screen
      .getAllByText("Opzione 1")
      .find((el) => el.closest(".select-item"));

    expect(selectedItemText).toBeTruthy();
    expect(selectedItemText!.closest(".select-item")).toHaveStyle({
      display: "none",
    });
  });

  it("should clear the search input when the dropdown closes", () => {
    renderSelect({ searchable: true, searchablePlaceholder: "Cerca..." });

    const trigger = screen.getByRole("combobox");
    fireEvent.click(trigger);

    const searchInput = screen.getByPlaceholderText("Cerca...");
    fireEvent.change(searchInput, { target: { value: "Opzione" } });
    expect(searchInput).toHaveValue("Opzione");

    fireEvent.click(screen.getByText("Opzione 2"));
    fireEvent.click(trigger);

    expect(screen.getByPlaceholderText("Cerca...")).toHaveValue("");
  });

  it("should prevent keydown event propagation on the search input", () => {
    renderSelect({ searchable: true, searchablePlaceholder: "Cerca..." });

    const trigger = screen.getByRole("combobox");
    fireEvent.click(trigger);

    const searchInput = screen.getByPlaceholderText("Cerca...");
    document.addEventListener("keydown", keydownHandler);

    fireEvent.keyDown(searchInput, { key: "Enter" });

    expect(keydownHandler).not.toHaveBeenCalled();

    document.removeEventListener("keydown", keydownHandler);
  });

  it("should auto-focus the search input when the dropdown opens", () => {
    vi.useFakeTimers();

    renderSelect({ searchable: true, searchablePlaceholder: "Cerca..." });

    const trigger = screen.getByRole("combobox");
    fireEvent.click(trigger);

    const searchInput = screen.getByPlaceholderText("Cerca...");
    expect(searchInput).toBeInTheDocument();

    act(() => {
      vi.runAllTimers();
    });

    expect(searchInput).toHaveFocus();

    vi.useRealTimers();
  });
});
