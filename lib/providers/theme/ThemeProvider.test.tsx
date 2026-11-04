import { fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { act } from "react";
import { hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { ThemeProvider } from "./ThemeProvider";
import { useTheme } from "./useTheme";
import { Theme } from "./themeEnum";
import { BrandTokens } from "./brandTokens";

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

const renderThemeProvider = (brand?: BrandTokens) =>
  render(
    <ThemeProvider brand={brand}>
      <TestComponent />
    </ThemeProvider>,
  );

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-panda-theme");
    document.documentElement.removeAttribute("style");
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

  it("should not set any inline custom property when no brand is provided", () => {
    renderThemeProvider();

    expect(
      document.documentElement.style.getPropertyValue("--color-primary"),
    ).toBe("");
  });

  it("should apply the brand palette for the current theme", () => {
    renderThemeProvider({
      light: { "color-primary": "#ff0000" },
      dark: { "color-primary": "#00ff00" },
    });

    expect(
      document.documentElement.style.getPropertyValue("--color-primary"),
    ).toBe("#ff0000");
  });

  it("should clear the brand tokens from document.documentElement on unmount", () => {
    const { unmount } = renderThemeProvider({
      light: { "color-primary": "#ff0000" },
      dark: { "color-primary": "#00ff00" },
    });

    expect(
      document.documentElement.style.getPropertyValue("--color-primary"),
    ).toBe("#ff0000");

    unmount();

    expect(
      document.documentElement.style.getPropertyValue("--color-primary"),
    ).toBe("");
  });

  it("should warn when more than one instance is mounted at the same time", () => {
    const warnSpy = vi
      .spyOn(console, "warn")
      .mockImplementation(() => undefined);

    const first = renderThemeProvider();
    expect(warnSpy).not.toHaveBeenCalled();

    const second = renderThemeProvider();
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy.mock.calls[0][0]).toContain("singleton");

    second.unmount();
    first.unmount();
    warnSpy.mockRestore();
  });

  it("should not warn again after going back down to a single instance", () => {
    const warnSpy = vi
      .spyOn(console, "warn")
      .mockImplementation(() => undefined);

    const first = renderThemeProvider();
    const second = renderThemeProvider();
    expect(warnSpy).toHaveBeenCalledTimes(1);

    second.unmount();
    first.unmount();

    renderThemeProvider();
    expect(warnSpy).toHaveBeenCalledTimes(1);

    warnSpy.mockRestore();
  });

  it("should swap the brand palette and clear tokens missing in the new theme on toggle", () => {
    renderThemeProvider({
      light: { "color-primary": "#ff0000", "text-primary": "#111111" },
      dark: { "color-primary": "#00ff00" },
    });

    const toggleButton = screen.getByTestId("toggle-button");

    expect(
      document.documentElement.style.getPropertyValue("--color-primary"),
    ).toBe("#ff0000");
    expect(
      document.documentElement.style.getPropertyValue("--text-primary"),
    ).toBe("#111111");

    fireEvent.click(toggleButton);

    expect(
      document.documentElement.style.getPropertyValue("--color-primary"),
    ).toBe("#00ff00");
    expect(
      document.documentElement.style.getPropertyValue("--text-primary"),
    ).toBe("");
  });

  it("should hydrate server HTML without mismatch and then apply the saved dark theme", async () => {
    const ui = (
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    const container = document.createElement("div");
    // The server has no localStorage: its HTML always uses the light theme.
    container.innerHTML = renderToString(ui);
    document.body.appendChild(container);
    localStorage.setItem("theme", Theme.DARK);
    const onRecoverableError = vi.fn();

    let root: Root | undefined;
    try {
      await act(async () => {
        root = hydrateRoot(container, ui, { onRecoverableError });
      });

      expect(onRecoverableError).not.toHaveBeenCalled();
      expect(screen.getByTestId("current-theme")).toHaveTextContent(Theme.DARK);
      expect(localStorage.getItem("theme")).toBe(Theme.DARK);
    } finally {
      // hydrateRoot is not tracked by Testing Library's automatic cleanup.
      act(() => root?.unmount());
      container.remove();
    }
  });
});
