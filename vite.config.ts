/// <reference types="vitest/config" />
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";
import { libInjectCss } from "vite-plugin-lib-inject-css";
import { readFileSync } from "node:fs";

const pkg = JSON.parse(
  readFileSync(resolve(__dirname, "package.json"), "utf-8"),
) as {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

// Runtime and peer dependencies are installed by the consumer, so they stay
// out of the bundle (subpath imports such as "react/jsx-runtime" included).
const externalPackages = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
];

const isExternal = (id: string) =>
  externalPackages.some((name) => id === name || id.startsWith(`${name}/`));

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    libInjectCss(),
    react(),
    dts({
      include: ["lib"],
      exclude: [
        "**/*.stories.{js,jsx,ts,tsx}",
        "**/*.test.{js,jsx,ts,tsx}",
        "**/*.recipe.{js,jsx,ts,tsx}",
        "lib/keyframes/**",
        "lib/preset.ts",
      ],
      tsconfigPath: resolve(__dirname, "tsconfig.app.json"),
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "lib/main.ts"),
      formats: ["es"],
    },
    rollupOptions: {
      external: isExternal,
      output: {
        // One file per module, so bundlers can drop unused components.
        preserveModules: true,
        preserveModulesRoot: "lib",
        // Components use hooks and browser APIs: mark every module as a client
        // module so React Server Components frameworks (e.g. Next.js) accept it.
        banner: '"use client";',
        entryFileNames: "[name].js",
        assetFileNames: "assets/[name][extname]",
        globals: {
          react: "React",
          "react-dom": "React-dom",
          "react/jsx-runtime": "react/jsx-runtime",
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./test/setup.ts",
    include: [
      "lib/components/**/*.test.{ts,tsx}",
      "lib/providers/**/*.test.{ts,tsx}",
      "lib/utils/*.test.{ts,tsx}",
      "lib/hooks/*.test.{ts,tsx}",
    ],
    exclude: ["node_modules", "dist"],
    testTimeout: 10000,
    coverage: {
      enabled: true,
      provider: "v8",
      reporter: ["text", "json", "json-summary", "html", "lcov"],
      include: [
        "lib/components/**/*.{ts,tsx}",
        "lib/providers/**/*.{ts,tsx}",
        "lib/utils/*.{ts,tsx}",
        "lib/hooks/*.{ts,tsx}",
      ],
      exclude: [
        "lib/components/**/*.stories.tsx",
        "lib/components/**/*.test.{ts,tsx}",
        "lib/components/**/*.recipe.ts",
      ],
    },
  },
});
