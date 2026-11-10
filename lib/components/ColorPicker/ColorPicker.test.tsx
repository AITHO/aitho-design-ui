import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import * as React from "react";
import { ColorPicker, type ColorPickerProps } from "./ColorPicker";

const ControlledPicker = ({
  initial = "#71ad00",
  onChange,
  ...props
}: Partial<ColorPickerProps> & { initial?: string }) => {
  const [value, setValue] = React.useState(initial);
  return (
    <ColorPicker
      {...props}
      value={value}
      onChange={(next) => {
        setValue(next);
        onChange?.(next);
      }}
    />
  );
};

const openPicker = async () => {
  await userEvent.click(screen.getByRole("button", { name: /choose color/i }));
};

describe("ColorPicker", () => {
  afterEach(() => {
    delete (window as unknown as { EyeDropper?: unknown }).EyeDropper;
  });

  it("names the trigger with its label and describes it with the current color", () => {
    render(<ColorPicker value="#71AD00" onChange={vi.fn()} />);

    expect(
      screen.getByRole("button", {
        name: "Choose color",
        description: "#71ad00",
      }),
    ).toBeInTheDocument();
  });

  it("lets an external label with htmlFor name the trigger", () => {
    render(
      <>
        <label htmlFor="brand">Brand color</label>
        <ColorPicker id="brand" value="#71ad00" onChange={vi.fn()} />
      </>,
    );

    expect(
      screen.getByRole("button", {
        name: "Brand color",
        description: "#71ad00",
      }),
    ).toBeInTheDocument();
  });

  it("names the panel after the trigger", async () => {
    render(
      <>
        <label htmlFor="brand">Brand color</label>
        <ColorPicker id="brand" value="#71ad00" onChange={vi.fn()} />
      </>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Brand color" }));

    expect(
      screen.getByRole("dialog", { name: "Brand color" }),
    ).toBeInTheDocument();
  });

  it("uses aria-labelledby instead of the default label when provided", () => {
    render(
      <>
        <span id="primary-label">Primary color</span>
        <ColorPicker
          value="#71ad00"
          onChange={vi.fn()}
          aria-labelledby="primary-label"
        />
      </>,
    );

    expect(
      screen.getByRole("button", { name: "Primary color" }),
    ).toBeInTheDocument();
  });

  it("does not open when disabled", async () => {
    render(<ColorPicker value="#71ad00" onChange={vi.fn()} disabled />);

    const trigger = screen.getByRole("button", { name: /choose color/i });
    expect(trigger).toBeDisabled();
    await userEvent.click(trigger);

    expect(screen.queryByRole("slider")).not.toBeInTheDocument();
  });

  it("opens a panel with the sliders and the hex field", async () => {
    render(<ColorPicker value="#ff0000" onChange={vi.fn()} />);
    await openPicker();

    expect(
      screen.getByRole("slider", { name: "Saturation and brightness" }),
    ).toHaveAttribute("aria-valuetext", "100%, 100%");
    expect(screen.getByRole("slider", { name: "Hue" })).toHaveAttribute(
      "aria-valuenow",
      "0",
    );
    expect(screen.getByLabelText(/hex/i)).toHaveValue("#ff0000");
  });

  it("changes the hue from the keyboard", async () => {
    const onChange = vi.fn();
    render(<ControlledPicker initial="#ff0000" onChange={onChange} />);
    await openPicker();

    const hue = screen.getByRole("slider", { name: "Hue" });
    fireEvent.keyDown(hue, { key: "End" });
    expect(hue).toHaveAttribute("aria-valuenow", "360");
    // 360° is still red: the same color is not reported again.
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.keyDown(hue, { key: "Home" });
    fireEvent.keyDown(hue, { key: "ArrowRight", shiftKey: true });
    fireEvent.keyDown(hue, { key: "ArrowRight", shiftKey: true });
    fireEvent.keyDown(hue, { key: "ArrowRight", shiftKey: true });
    fireEvent.keyDown(hue, { key: "ArrowRight", shiftKey: true });
    fireEvent.keyDown(hue, { key: "ArrowRight", shiftKey: true });
    fireEvent.keyDown(hue, { key: "ArrowRight", shiftKey: true });

    expect(hue).toHaveAttribute("aria-valuenow", "60");
    expect(onChange).toHaveBeenLastCalledWith("#ffff00");
  });

  it("changes saturation and brightness from the keyboard", async () => {
    const onChange = vi.fn();
    render(<ControlledPicker initial="#ff0000" onChange={onChange} />);
    await openPicker();

    const area = screen.getByRole("slider", {
      name: "Saturation and brightness",
    });
    for (let i = 0; i < 10; i++) {
      fireEvent.keyDown(area, { key: "ArrowLeft", shiftKey: true });
    }

    expect(area).toHaveAttribute("aria-valuetext", "0%, 100%");
    expect(onChange).toHaveBeenLastCalledWith("#ffffff");

    fireEvent.keyDown(area, { key: "ArrowDown", shiftKey: true });
    expect(area).toHaveAttribute("aria-valuetext", "0%, 90%");
  });

  it("keeps the hue when passing through grey", async () => {
    render(<ControlledPicker initial="#0000ff" />);
    await openPicker();

    const area = screen.getByRole("slider", {
      name: "Saturation and brightness",
    });
    for (let i = 0; i < 10; i++) {
      fireEvent.keyDown(area, { key: "ArrowLeft", shiftKey: true });
    }

    expect(screen.getByRole("slider", { name: "Hue" })).toHaveAttribute(
      "aria-valuenow",
      "240",
    );
  });

  it("applies a complete hex typed in the field, but not a partial one", async () => {
    const onChange = vi.fn();
    render(<ControlledPicker initial="#000000" onChange={onChange} />);
    await openPicker();

    const field = screen.getByLabelText(/hex/i);
    await userEvent.clear(field);
    await userEvent.type(field, "#71a");
    expect(onChange).not.toHaveBeenCalled();
    expect(field).toHaveAttribute("aria-invalid", "false");

    await userEvent.type(field, "d0");
    expect(field).toHaveAttribute("aria-invalid", "true");

    await userEvent.type(field, "0");
    expect(onChange).toHaveBeenLastCalledWith("#71ad00");
  });

  it("expands a short hex and restores an invalid one on blur", async () => {
    const onChange = vi.fn();
    render(<ControlledPicker initial="#000000" onChange={onChange} />);
    await openPicker();

    const field = screen.getByLabelText(/hex/i);
    await userEvent.clear(field);
    await userEvent.type(field, "abc");
    fireEvent.blur(field);
    expect(onChange).toHaveBeenLastCalledWith("#aabbcc");
    expect(field).toHaveValue("#aabbcc");

    await userEvent.clear(field);
    await userEvent.type(field, "zz");
    fireEvent.blur(field);
    expect(field).toHaveValue("#aabbcc");
  });

  it("selects a preset color and marks it as pressed", async () => {
    const onChange = vi.fn();
    render(
      <ControlledPicker
        initial="#000000"
        onChange={onChange}
        swatches={["#71ad00", "#1E90FF", "not-a-color"]}
      />,
    );
    await openPicker();

    const group = screen.getByRole("group", { name: "Preset colors" });
    expect(group.querySelectorAll("button")).toHaveLength(2);

    await userEvent.click(screen.getByRole("button", { name: "#1e90ff" }));

    expect(onChange).toHaveBeenLastCalledWith("#1e90ff");
    expect(screen.getByRole("button", { name: "#1e90ff" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("resyncs when the value changes from outside", async () => {
    const { rerender } = render(
      <ColorPicker value="#ff0000" onChange={vi.fn()} />,
    );
    await openPicker();

    rerender(<ColorPicker value="#00ff00" onChange={vi.fn()} />);

    expect(screen.getByRole("slider", { name: "Hue" })).toHaveAttribute(
      "aria-valuenow",
      "120",
    );
    expect(screen.getByLabelText(/hex/i)).toHaveValue("#00ff00");
  });

  it("hides the eye dropper where the browser does not support it", async () => {
    render(<ColorPicker value="#ff0000" onChange={vi.fn()} />);
    await openPicker();

    expect(
      screen.queryByRole("button", { name: "Pick a color from the screen" }),
    ).not.toBeInTheDocument();
  });

  it("applies the color picked with the eye dropper", async () => {
    const onChange = vi.fn();
    (window as unknown as { EyeDropper: unknown }).EyeDropper = class {
      open = () => Promise.resolve({ sRGBHex: "#123456" });
    };
    render(<ControlledPicker initial="#000000" onChange={onChange} />);
    await openPicker();

    await userEvent.click(
      screen.getByRole("button", { name: "Pick a color from the screen" }),
    );

    expect(onChange).toHaveBeenLastCalledWith("#123456");
  });

  it("keeps the color when the eye dropper is dismissed", async () => {
    const onChange = vi.fn();
    (window as unknown as { EyeDropper: unknown }).EyeDropper = class {
      open = () => Promise.reject(new DOMException("Canceled", "AbortError"));
    };
    render(<ControlledPicker initial="#000000" onChange={onChange} />);
    await openPicker();

    await userEvent.click(
      screen.getByRole("button", { name: "Pick a color from the screen" }),
    );

    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByLabelText(/hex/i)).toHaveValue("#000000");
  });

  it("falls back to black for a value that is not a hex color", () => {
    render(<ColorPicker value="not-a-color" onChange={vi.fn()} />);

    expect(
      screen.getByRole("button", { description: "#000000" }),
    ).toBeInTheDocument();
  });

  it("applies id and className to the trigger", () => {
    render(
      <ColorPicker
        value="#71ad00"
        onChange={vi.fn()}
        id="brand-color"
        className="custom-trigger"
      />,
    );

    const trigger = screen.getByRole("button", { name: /choose color/i });
    expect(trigger).toHaveAttribute("id", "brand-color");
    expect(trigger).toHaveClass("custom-trigger");
  });

  it("uses single steps without Shift and ignores other keys", async () => {
    const onChange = vi.fn();
    render(<ControlledPicker initial="#ff0000" onChange={onChange} />);
    await openPicker();

    const area = screen.getByRole("slider", {
      name: "Saturation and brightness",
    });
    const hue = screen.getByRole("slider", { name: "Hue" });

    fireEvent.keyDown(area, { key: "Enter" });
    fireEvent.keyDown(hue, { key: "Enter" });
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.keyDown(area, { key: "ArrowDown" });
    fireEvent.keyDown(hue, { key: "ArrowUp" });

    expect(area).toHaveAttribute("aria-valuetext", "100%, 99%");
    expect(hue).toHaveAttribute("aria-valuenow", "1");
  });

  it("keeps the hue when the hex field is left untouched on a grey", async () => {
    render(<ControlledPicker initial="#0000ff" />);
    await openPicker();

    const area = screen.getByRole("slider", {
      name: "Saturation and brightness",
    });
    for (let i = 0; i < 10; i++) {
      fireEvent.keyDown(area, { key: "ArrowLeft", shiftKey: true });
    }
    const field = screen.getByLabelText(/hex/i);
    fireEvent.focus(field);
    fireEvent.blur(field);

    expect(screen.getByRole("slider", { name: "Hue" })).toHaveAttribute(
      "aria-valuenow",
      "240",
    );
    // Saturation back up: still blue, not red.
    fireEvent.keyDown(area, { key: "ArrowRight", shiftKey: true });
    expect(field).toHaveValue("#e6e6ff");
  });

  it("keeps hue and saturation when the hex field is left untouched on black", async () => {
    render(<ControlledPicker initial="#0000ff" />);
    await openPicker();

    const area = screen.getByRole("slider", {
      name: "Saturation and brightness",
    });
    for (let i = 0; i < 10; i++) {
      fireEvent.keyDown(area, { key: "ArrowDown", shiftKey: true });
    }
    const field = screen.getByLabelText(/hex/i);
    expect(field).toHaveValue("#000000");
    fireEvent.blur(field);

    expect(area).toHaveAttribute("aria-valuetext", "100%, 0%");
    expect(screen.getByRole("slider", { name: "Hue" })).toHaveAttribute(
      "aria-valuenow",
      "240",
    );
  });

  it("closes an open panel when it becomes disabled", async () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <ColorPicker value="#ff0000" onChange={onChange} />,
    );
    await openPicker();
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    rerender(<ColorPicker value="#ff0000" onChange={onChange} disabled />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    // Enabled again: the panel stays closed until it is opened again.
    rerender(<ColorPicker value="#ff0000" onChange={onChange} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("ignores an eye dropper result that arrives after the picker is disabled", async () => {
    const onChange = vi.fn();
    let resolvePick: (value: { sRGBHex: string }) => void = () => undefined;
    (window as unknown as { EyeDropper: unknown }).EyeDropper = class {
      open = () =>
        new Promise<{ sRGBHex: string }>((resolve) => {
          resolvePick = resolve;
        });
    };
    const { rerender } = render(
      <ColorPicker value="#000000" onChange={onChange} />,
    );
    await openPicker();
    await userEvent.click(
      screen.getByRole("button", { name: "Pick a color from the screen" }),
    );

    rerender(<ColorPicker value="#000000" onChange={onChange} disabled />);
    await act(async () => {
      resolvePick({ sRGBHex: "#123456" });
    });

    expect(onChange).not.toHaveBeenCalled();
  });

  describe("pointer", () => {
    const captured = new Set<number>();

    beforeEach(() => {
      captured.clear();
      vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
        left: 0,
        top: 0,
        width: 200,
        height: 100,
      } as DOMRect);
      Object.assign(HTMLElement.prototype, {
        setPointerCapture: (pointerId: number) => captured.add(pointerId),
        hasPointerCapture: (pointerId: number) => captured.has(pointerId),
      });
    });

    afterEach(() => {
      vi.restoreAllMocks();
      const prototype = HTMLElement.prototype as unknown as Record<
        string,
        unknown
      >;
      delete prototype.setPointerCapture;
      delete prototype.hasPointerCapture;
    });

    it("picks saturation and brightness from where the area is pressed and dragged", async () => {
      const onChange = vi.fn();
      render(<ControlledPicker initial="#ff0000" onChange={onChange} />);
      await openPicker();

      const area = screen.getByRole("slider", {
        name: "Saturation and brightness",
      });
      fireEvent.pointerDown(area, { pointerId: 1, clientX: 100, clientY: 50 });
      expect(area).toHaveAttribute("aria-valuetext", "50%, 50%");

      // Outside the area while captured: clamped to the edge.
      fireEvent.pointerMove(area, { pointerId: 1, clientX: 400, clientY: -20 });
      expect(area).toHaveAttribute("aria-valuetext", "100%, 100%");
      expect(onChange).toHaveBeenLastCalledWith("#ff0000");
    });

    it("picks the hue from where the slider is pressed", async () => {
      const onChange = vi.fn();
      render(<ControlledPicker initial="#ff0000" onChange={onChange} />);
      await openPicker();

      const hue = screen.getByRole("slider", { name: "Hue" });
      fireEvent.pointerDown(hue, { pointerId: 1, clientX: 100, clientY: 0 });

      expect(hue).toHaveAttribute("aria-valuenow", "180");
      expect(onChange).toHaveBeenLastCalledWith("#00ffff");
    });

    it("ignores pointer moves that are not part of a drag", async () => {
      const onChange = vi.fn();
      render(<ControlledPicker initial="#ff0000" onChange={onChange} />);
      await openPicker();

      fireEvent.pointerMove(screen.getByRole("slider", { name: "Hue" }), {
        pointerId: 1,
        clientX: 100,
      });

      expect(onChange).not.toHaveBeenCalled();
    });

    it("treats a zero-size area as its origin", async () => {
      vi.mocked(HTMLElement.prototype.getBoundingClientRect).mockReturnValue({
        left: 0,
        top: 0,
        width: 0,
        height: 0,
      } as DOMRect);
      render(<ControlledPicker initial="#ff0000" />);
      await openPicker();

      const area = screen.getByRole("slider", {
        name: "Saturation and brightness",
      });
      fireEvent.pointerDown(area, { pointerId: 1, clientX: 10, clientY: 10 });

      expect(area).toHaveAttribute("aria-valuetext", "0%, 100%");
    });
  });
});
