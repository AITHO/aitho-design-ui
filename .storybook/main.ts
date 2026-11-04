import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../docs/*.mdx", "../lib/**/*.stories.@(js|jsx|mjs|ts|tsx)"],

  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-links",
    "@storybook/addon-themes",
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
  ],

  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

  core: {
    disableWhatsNewNotifications: true,
    disableTelemetry: true,
  },
  build: {
    test: {
      disableBlocks: false,
      disableMDXEntries: false,
      disableAutoDocs: false,
      disabledAddons: [],
      disableDocgen: false,
      disableSourcemaps: true,
      disableTreeShaking: false,
    },
  },
  typescript: {
    reactDocgen: "react-docgen",
  },

  staticDirs: ["../assets"],

  docs: {},
};

export default config;
