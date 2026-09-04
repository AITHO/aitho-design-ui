import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { ThemeProvider } from "./ThemeProvider";
import { useTheme } from "./useTheme";
import { Theme } from "./themeEnum";

const TestComponent = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <p data-testid="current-theme">{theme}</p>
      <button onClick={toggleTheme} data-testid="toggle-button">
        Toggle Theme
      </button>
    </div>
  );
};

const renderThemeProvider = () =>
  render(
    <ThemeProvider>
      <TestComponent />
    </ThemeProvider>,
  );

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-panda-theme");
  });

  it("should render children and initialize the light theme by default", () => {
    renderThemeProvider();

    expect(screen.getByTestId("current-theme")).toHaveTextContent(Theme.LIGHT);
    expect(localStorage.getItem("theme")).toBe(Theme.LIGHT);
    expect(document.documentElement.getAttribute("data-panda-theme")).toBe(
      Theme.LIGHT,
    );
  });

  it("should initialize the dark theme from localStorage", () => {
    localStorage.setItem("theme", Theme.DARK);

    renderThemeProvider();

    expect(screen.getByTestId("current-theme")).toHaveTextContent(Theme.DARK);
    expect(localStorage.getItem("theme")).toBe(Theme.DARK);
    expect(document.documentElement.getAttribute("data-panda-theme")).toBe(
      Theme.DARK,
    );
  });

  it("should toggle the theme between light and dark", () => {
    renderThemeProvider();

    const themeDisplay = screen.getByTestId("current-theme");
    const toggleButton = screen.getByTestId("toggle-button");

    expect(themeDisplay.textContent).toBe(Theme.LIGHT);
    expect(document.documentElement.getAttribute("data-panda-theme")).toBe(
      Theme.LIGHT,
    );

    fireEvent.click(toggleButton);
    expect(themeDisplay.textContent).toBe(Theme.DARK);
    expect(document.documentElement.getAttribute("data-panda-theme")).toBe(
      Theme.DARK,
    );

    fireEvent.click(toggleButton);
    expect(themeDisplay.textContent).toBe(Theme.LIGHT);
    expect(document.documentElement.getAttribute("data-panda-theme")).toBe(
      Theme.LIGHT,
    );
  });
});
