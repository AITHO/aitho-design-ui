import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useTheme } from "./useTheme";
import { ThemeProvider } from "./ThemeProvider";

const ThemeConsumerComponent = () => {
  const theme = useTheme();
  return <div>{theme.theme}</div>;
};

const renderThemeConsumer = () => render(<ThemeConsumerComponent />);

const renderThemeConsumerWithProvider = () =>
  render(
    <ThemeProvider>
      <ThemeConsumerComponent />
    </ThemeProvider>,
  );

describe("useTheme", () => {
  it("should return the theme context when used inside ThemeProvider", () => {
    renderThemeConsumerWithProvider();
    expect(screen.getByText("light")).toBeInTheDocument();
  });

  it("should throw an error when used outside ThemeProvider", () => {
    expect(renderThemeConsumer).toThrow(
      "useTheme must be used within a ThemeProvider",
    );
  });
});
