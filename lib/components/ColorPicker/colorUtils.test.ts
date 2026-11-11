import { describe, expect, it } from "vitest";
import {
  clampHsv,
  hexToHsv,
  hexToRgb,
  hsvToHex,
  normalizeHex,
  rgbToHex,
} from "./colorUtils";

describe("colorUtils", () => {
  it("normalizes short, long and unprefixed hex values", () => {
    expect(normalizeHex("#ABC")).toBe("#aabbcc");
    expect(normalizeHex("71AD00")).toBe("#71ad00");
    expect(normalizeHex("  #71ad00 ")).toBe("#71ad00");
  });

  it("rejects values that are not hex colors", () => {
    expect(normalizeHex("#71ad0")).toBeNull();
    expect(normalizeHex("#ggg")).toBeNull();
    expect(normalizeHex("")).toBeNull();
  });

  it("converts primary colors to HSV", () => {
    expect(hexToHsv("#ff0000")).toEqual({ h: 0, s: 100, v: 100 });
    expect(hexToHsv("#00ff00")).toEqual({ h: 120, s: 100, v: 100 });
    expect(hexToHsv("#0000ff")).toEqual({ h: 240, s: 100, v: 100 });
    expect(hexToHsv("#000000")).toEqual({ h: 0, s: 0, v: 0 });
  });

  it("round-trips hex through HSV", () => {
    ["#71ad00", "#1e90ff", "#808080", "#ffffff", "#ff00ff"].forEach((hex) => {
      expect(hsvToHex(hexToHsv(hex))).toBe(hex);
    });
  });

  it("treats hue 360 as red and clamps out-of-range values", () => {
    expect(hsvToHex({ h: 360, s: 100, v: 100 })).toBe("#ff0000");
    expect(clampHsv({ h: -5, s: 120, v: -1 })).toEqual({ h: 0, s: 100, v: 0 });
  });

  it("converts between hex and RGB channels", () => {
    expect(hexToRgb("#71AD00")).toEqual([113, 173, 0]);
    expect(hexToRgb("#abc")).toEqual([170, 187, 204]);
    expect(hexToRgb("not a color")).toEqual([0, 0, 0]);
    expect(rgbToHex([113, 173, 0])).toBe("#71ad00");
  });

  it("rounds RGB channels and keeps them within 0-255", () => {
    expect(rgbToHex([12.6, -4, 300])).toBe("#0d00ff");
  });
});
