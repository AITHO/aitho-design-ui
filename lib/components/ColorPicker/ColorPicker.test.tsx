import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { ColorPicker } from "./ColorPicker";
import { hexToHsv, hsvToHex, normalizeHex } from "./colorUtils";

describe("colorUtils", () => {
  it("normalizes hex values", () => {
    expect(normalizeHex("#ABC")).toBe("#aabbcc");
    expect(normalizeHex("00d9ea")).toBe("#00d9ea");
    expect(normalizeHex("#12")).toBeNull();
  });

  it("round-trips hex through HSV", () => {
    for (const hex of [
      "#000000",
      "#ffffff",
      "#ff0000",
      "#00d9ea",
      "#7c3aed",
      "#808080",
    ]) {
      expect(hsvToHex(hexToHsv(hex)!)).toBe(hex);
    }
    expect(hexToHsv("#ff0000")).toEqual({ h: 0, s: 1, v: 1 });
  });
});

const Controlled = ({ onChange }: { onChange?: (value: string) => void }) => {
  const [value, setValue] = useState("#ff0000");
  return (
    <ColorPicker
      lang="it"
      aria-label="Colore primario"
      value={value}
      presets={["#00d9ea", "#7c3aed"]}
      onChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
    />
  );
};

describe("ColorPicker", () => {
  it("shows the colour on the trigger and opens the panel", () => {
    render(<Controlled />);
    const trigger = screen.getByRole("button", {
      name: "Colore primario: #ff0000",
    });
    fireEvent.click(trigger);
    expect(
      screen.getByRole("slider", { name: "Tonalità" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("slider", { name: "Saturazione e luminosità" }),
    ).toBeInTheDocument();
  });

  it("changes hue and brightness with the keyboard", () => {
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: /Colore primario/ }));
    fireEvent.keyDown(screen.getByRole("slider", { name: "Tonalità" }), {
      key: "End",
    });
    // 360 is red again: nothing changed, nothing emitted.
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.keyDown(screen.getByRole("slider", { name: "Tonalità" }), {
      key: "ArrowLeft",
      shiftKey: true,
    });
    expect(onChange).toHaveBeenLastCalledWith(hsvToHex({ h: 350, s: 1, v: 1 }));
    fireEvent.keyDown(
      screen.getByRole("slider", { name: "Saturazione e luminosità" }),
      {
        key: "ArrowDown",
        shiftKey: true,
      },
    );
    expect(onChange).toHaveBeenLastCalledWith(
      hsvToHex({ h: 350, s: 1, v: 0.9 }),
    );
  });

  it("picks a preset", () => {
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: /Colore primario/ }));
    fireEvent.click(screen.getByRole("button", { name: "Colore #00d9ea" }));
    expect(onChange).toHaveBeenLastCalledWith("#00d9ea");
    expect(
      screen.getByRole("button", { name: "Colore #00d9ea" }),
    ).toHaveAttribute("aria-pressed", "true");
  });
});
