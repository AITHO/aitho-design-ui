interface LocalStorageHost {
  localStorage?: unknown;
  jsdom?: { window?: { localStorage: Storage } };
}

// Node can expose a throwing localStorage getter or an incomplete API. In that
// case use jsdom's Storage, without replacing a working browser storage.
export const ensureUsableLocalStorage = (host: LocalStorageHost) => {
  try {
    const storage = host.localStorage as Partial<Storage> | null | undefined;
    const methods = ["clear", "getItem", "setItem", "removeItem"] as const;
    if (methods.every((method) => typeof storage?.[method] === "function")) {
      return;
    }
  } catch {
    // Accessing Node's localStorage can throw without a storage file.
  }

  const jsdomWindow = host.jsdom?.window;
  if (jsdomWindow) {
    Object.defineProperty(host, "localStorage", {
      configurable: true,
      value: jsdomWindow.localStorage,
    });
  }
};
