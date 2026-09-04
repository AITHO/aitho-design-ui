/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";
import { libInjectCss } from "vite-plugin-lib-inject-css";

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
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
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
      reporter: ["text", "json", "html", "lcov"],
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
