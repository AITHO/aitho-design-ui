import * as Popover from "@radix-ui/react-popover";
import { colorPicker } from "@styled/recipes";
import React from "react";
import {
  clampHue,
  clampUnit,
  hexToHsv,
  hsvToHex,
  normalizeHex,
  type Hsv,
} from "./colorUtils";

export interface ColorPickerProps {
  /** *(optional)* Current colour as `#rrggbb` (`#rgb` is accepted too). */
  value?: string;

  /** *(optional)* Called with the new colour as `#rrggbb`, while dragging too. */
  onChange?: (value: string) => void;

  /** *(optional)* Quick colours shown under the sliders. */
  presets?: string[];

  /** *(optional)* Disables the picker. */
  disabled?: boolean;

  /** *(optional)* Id of the trigger button, for a `<label htmlFor>`. */
  id?: string;

  /** *(optional)* Accessible name of the trigger. */
  "aria-label"?: string;

  /** *(optional)* Language of the slider labels; defaults to the page language. */
  lang?: string;
}

const TEXT = {
  it: { area: "Saturazione e luminosità", hue: "Tonalità", preset: "Colore" },
  en: { area: "Saturation and brightness", hue: "Hue", preset: "Colour" },
} as const;

const FALLBACK: Hsv = { h: 0, s: 0, v: 0 };

/**
 * A colour picker: a swatch that opens a panel with a saturation/brightness area, a hue slider and
 * optional quick colours. Everything works with the keyboard (arrows, Shift for bigger steps).
 */
export const ColorPicker = ({
  value,
  onChange,
  presets,
  disabled,
  id,
  "aria-label": ariaLabel,
  lang,
}: ColorPickerProps) => {
  const classes = colorPicker();
  const language = (
    lang ||
    (typeof document !== "undefined" ? document.documentElement.lang : "")
  )
    .toLowerCase()
    .startsWith("it")
    ? "it"
    : "en";
  const t = TEXT[language];
  const hex = normalizeHex(value) ?? "#000000";

  // The hue is kept apart: a grey has no hue, and dragging through one must not reset it to red.
  const [hsv, setHsv] = React.useState<Hsv>(() => hexToHsv(hex) ?? FALLBACK);
  const [prevHex, setPrevHex] = React.useState(hex);
  if (hex !== prevHex) {
    setPrevHex(hex);
    if (hsvToHex(hsv) !== hex) {
      const next = hexToHsv(hex) ?? FALLBACK;
      setHsv(next.s === 0 || next.v === 0 ? { ...next, h: hsv.h } : next);
    }
  }

  const update = (next: Hsv) => {
    const clamped = {
      h: clampHue(next.h),
      s: clampUnit(next.s),
      v: clampUnit(next.v),
    };
    setHsv(clamped);
    const nextHex = hsvToHex(clamped);
    setPrevHex(nextHex);
    if (nextHex !== hex) onChange?.(nextHex);
  };

  const areaRef = React.useRef<HTMLDivElement>(null);
  const hueRef = React.useRef<HTMLDivElement>(null);

  const fromPointer = (
    event: React.PointerEvent<HTMLDivElement>,
    target: "area" | "hue",
  ) => {
    const rect = (
      target === "area" ? areaRef : hueRef
    ).current?.getBoundingClientRect();
    if (!rect || !rect.width) return;
    const x = clampUnit((event.clientX - rect.left) / rect.width);
    if (target === "hue") {
      update({ ...hsv, h: x * 360 });
    } else {
      const y = clampUnit((event.clientY - rect.top) / (rect.height || 1));
      update({ ...hsv, s: x, v: 1 - y });
    }
  };

  const dragHandlers = (target: "area" | "hue") => ({
    onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => {
      event.currentTarget.setPointerCapture?.(event.pointerId);
      event.currentTarget.focus();
      fromPointer(event, target);
    },
    onPointerMove: (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
        fromPointer(event, target);
      }
    },
  });

  const handleAreaKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 0.1 : 0.01;
    const moves: Record<string, Partial<Hsv>> = {
      ArrowLeft: { s: hsv.s - step },
      ArrowRight: { s: hsv.s + step },
      ArrowUp: { v: hsv.v + step },
      ArrowDown: { v: hsv.v - step },
    };
    if (moves[event.key]) {
      event.preventDefault();
      update({ ...hsv, ...moves[event.key] });
    }
  };

  const handleHueKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 10 : 1;
    const moves: Record<string, number> = {
      ArrowLeft: hsv.h - step,
      ArrowDown: hsv.h - step,
      ArrowRight: hsv.h + step,
      ArrowUp: hsv.h + step,
      Home: 0,
      End: 360,
    };
    if (event.key in moves) {
      event.preventDefault();
      update({ ...hsv, h: moves[event.key] });
    }
  };

  const pureHue = hsvToHex({ h: hsv.h, s: 1, v: 1 });

  return (
    <Popover.Root>
      <Popover.Trigger asChild disabled={disabled}>
        <button
          type="button"
          id={id}
          className={classes.trigger}
          aria-label={ariaLabel ? `${ariaLabel}: ${hex}` : hex}
          disabled={disabled}
        >
          <span className={classes.swatch} style={{ backgroundColor: hex }} />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className={classes.popoverContent}
          side="bottom"
          align="start"
          sideOffset={4}
          collisionPadding={8}
        >
          <div
            ref={areaRef}
            role="slider"
            tabIndex={0}
            aria-label={t.area}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(hsv.s * 100)}
            aria-valuetext={`${Math.round(hsv.s * 100)}%, ${Math.round(hsv.v * 100)}%`}
            className={classes.area}
            style={{
              background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, ${pureHue})`,
            }}
            onKeyDown={handleAreaKey}
            {...dragHandlers("area")}
          >
            <span
              className={classes.areaThumb}
              style={{
                left: `${hsv.s * 100}%`,
                top: `${(1 - hsv.v) * 100}%`,
                backgroundColor: hex,
              }}
            />
          </div>

          <div
            ref={hueRef}
            role="slider"
            tabIndex={0}
            aria-label={t.hue}
            aria-valuemin={0}
            aria-valuemax={360}
            aria-valuenow={Math.round(hsv.h)}
            className={classes.hue}
            onKeyDown={handleHueKey}
            {...dragHandlers("hue")}
          >
            <span
              className={classes.hueThumb}
              style={{
                left: `${(hsv.h / 360) * 100}%`,
                backgroundColor: pureHue,
              }}
            />
          </div>

          {presets && presets.length > 0 && (
            <div className={classes.presets}>
              {presets.map((preset) => {
                const presetHex = normalizeHex(preset);
                if (!presetHex) return null;
                return (
                  <button
                    key={presetHex}
                    type="button"
                    className={classes.preset}
                    style={{ backgroundColor: presetHex }}
                    aria-label={`${t.preset} ${presetHex}`}
                    aria-pressed={presetHex === hex}
                    onClick={() => update(hexToHsv(presetHex) ?? FALLBACK)}
                  />
                );
              })}
            </div>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

ColorPicker.displayName = "ColorPicker";
