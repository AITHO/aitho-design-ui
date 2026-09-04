import { useCallback, useSyncExternalStore } from "react";

/**
 * Viewport width breakpoints (in pixels) shared by the library consumers.
 * Typically used with {@link useMediaQuery}, e.g.
 * `useMediaQuery(`(max-width: ${BREAKPOINTS.mobile}px)`)`.
 */
export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  laptop: 1024,
  desktop: 1360,
} as const;

const isMatchMediaAvailable = () =>
  typeof window !== "undefined" && typeof window.matchMedia === "function";

/**
 * Reactively tracks a CSS media query.
 * SSR/jsdom-safe: returns `false` when `window.matchMedia` is unavailable.
 *
 * @param query - Any valid CSS media query string, e.g. `"(max-width: 768px)"`.
 * @returns Whether the media query currently matches.
 */
export const useMediaQuery = (query: string): boolean => {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (!isMatchMediaAvailable()) {
        return () => undefined;
      }

      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener("change", onStoreChange);

      return () => {
        mediaQueryList.removeEventListener("change", onStoreChange);
      };
    },
    [query],
  );

  const getSnapshot = useCallback(
    () => (isMatchMediaAvailable() ? window.matchMedia(query).matches : false),
    [query],
  );

  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};
