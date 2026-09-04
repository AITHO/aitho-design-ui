import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BREAKPOINTS, useMediaQuery } from "./useMediaQuery";

type ChangeListener = (event: { matches: boolean }) => void;

const mockMatchMedia = (initialMatches: boolean) => {
  const listeners = new Set<ChangeListener>();
  let matches = initialMatches;

  const matchMedia = vi.fn().mockImplementation((query: string) => ({
    get matches() {
      return matches;
    },
    media: query,
    addEventListener: (_: string, listener: ChangeListener) => {
      listeners.add(listener);
    },
    removeEventListener: (_: string, listener: ChangeListener) => {
      listeners.delete(listener);
    },
  }));

  vi.stubGlobal("matchMedia", matchMedia);

  return {
    matchMedia,
    listeners,
    setMatches: (next: boolean) => {
      matches = next;
      listeners.forEach((listener) => listener({ matches: next }));
    },
  };
};

describe("useMediaQuery", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should return false when matchMedia is unavailable", () => {
    vi.stubGlobal("matchMedia", undefined);

    const { result } = renderHook(() => useMediaQuery("(max-width: 480px)"));

    expect(result.current).toBe(false);
  });

  it("should return the initial match state", () => {
    const { matchMedia } = mockMatchMedia(true);

    const { result } = renderHook(() => useMediaQuery("(max-width: 480px)"));

    expect(result.current).toBe(true);
    expect(matchMedia).toHaveBeenCalledWith("(max-width: 480px)");
  });

  it("should update when the media query match changes", () => {
    const media = mockMatchMedia(false);

    const { result } = renderHook(() => useMediaQuery("(max-width: 480px)"));
    expect(result.current).toBe(false);

    act(() => {
      media.setMatches(true);
    });

    expect(result.current).toBe(true);
  });

  it("should remove the change listener on unmount", () => {
    const media = mockMatchMedia(false);

    const { unmount } = renderHook(() => useMediaQuery("(max-width: 480px)"));
    expect(media.listeners.size).toBe(1);

    unmount();

    expect(media.listeners.size).toBe(0);
  });

  it("should expose the shared breakpoint constants", () => {
    expect(BREAKPOINTS).toEqual({
      mobile: 480,
      tablet: 768,
      laptop: 1024,
      desktop: 1360,
    });
  });
});
