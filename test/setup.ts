import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import { ensureUsableLocalStorage } from "./localStorage";

ensureUsableLocalStorage(globalThis);

afterEach(() => {
  cleanup();
});
