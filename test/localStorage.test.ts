import { afterEach, describe, expect, it } from "vitest";
import { ensureUsableLocalStorage } from "./localStorage";

// A real browser Storage, separate from the localStorage used by the test setup.
const fallback = window.sessionStorage;

afterEach(() => fallback.clear());

describe("ensureUsableLocalStorage", () => {
  it("keeps valid storage without accessing the fallback", () => {
    const storage = window.localStorage;
    const host = {
      localStorage: storage,
      get jsdom(): never {
        throw new Error("The fallback should not be accessed");
      },
    };

    ensureUsableLocalStorage(host);

    expect(host.localStorage).toBe(storage);
  });

  it.each(["missing", "throwing getter", "incomplete API"])(
    "replaces storage with %s and supports reading, writing and removing items",
    (scenario) => {
      const host = {
        jsdom: { window: { localStorage: fallback } },
        localStorage: undefined as unknown,
      };
      if (scenario === "throwing getter") {
        Object.defineProperty(host, "localStorage", {
          configurable: true,
          get() {
            throw new Error("No Node storage file configured");
          },
        });
      } else if (scenario === "incomplete API") {
        host.localStorage = {
          clear: fallback.clear,
          getItem: fallback.getItem,
        };
      }

      ensureUsableLocalStorage(host);

      expect(host.localStorage).toBe(fallback);
      const storage = host.localStorage as Storage;
      storage.setItem("theme", "dark");
      expect(storage.getItem("theme")).toBe("dark");
      storage.removeItem("theme");
      expect(storage.getItem("theme")).toBeNull();
      storage.setItem("theme", "light");
      storage.clear();
      expect(storage).toHaveLength(0);
    },
  );

  it("leaves missing storage alone when no jsdom window is available", () => {
    const host = { localStorage: undefined };

    expect(() => ensureUsableLocalStorage(host)).not.toThrow();
    expect(host.localStorage).toBeUndefined();
  });
});
