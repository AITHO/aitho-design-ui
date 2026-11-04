import type { Preview } from "@storybook/react-vite";
import { withThemeByClassName } from "@storybook/addon-themes";
import React from "react";
import "../lib/main"; // import the main.ts file to ensure ThemeContext loads correctly
// package.json marks only CSS as having side effects, so the production build
// drops the bare import above together with its styles: import them explicitly.
import "../lib/main.css";

const StoryRenderer = (args: { Story }) => {
  const { Story } = args;

  // Insert here provider components
  return <Story />;
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "centered",
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: "light",
        dark: "dark",
      },
      defaultTheme: "light",
    }),
    (Story, context) => {
      const theme = context.globals.theme || "light";
      document.documentElement.setAttribute("data-panda-theme", theme);

      if (theme === "dark") {
        return (
          <div style={{ background: "black", padding: "1rem" }}>
            <StoryRenderer Story={Story} />
          </div>
        );
      }

      return <StoryRenderer Story={Story} />;
    },
  ],
};
export default preview;
