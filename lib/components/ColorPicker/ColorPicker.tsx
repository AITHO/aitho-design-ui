import { Crosshair1Icon } from "@radix-ui/react-icons";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { colorPicker } from "@styled/recipes";
import * as React from "react";
import { Input } from "../Input/Input";
import {
  clampHsv,
  hexToHsv,
  hsvToHex,
  normalizeHex,
  type Hsv,
} from "./colorUtils";

/** Browser EyeDropper API (Chromium only), not yet in the TypeScript DOM lib. */
interface EyeDropperApi {
  open: () => Promise<{ sRGBHex: string }>;
}
type EyeDropperConstructor = new () => EyeDropperApi;

const getEyeDropper = (): EyeDropperConstructor | undefined =>
  typeof window === "undefined"
    ? undefined
    : (window as unknown as { EyeDropper?: EyeDropperConstructor }).EyeDropper;

export interface ColorPickerProps {
  /** Current color, as a hex string (`#rrggbb` or `#rgb`). */
  value: string;

  /** Function called with the new color, always in the lowercase `#rrggbb` form. */
  onChange: (value: string) => void;

  /** *(optional)*
   * Whether the picker is disabled.
   * @default false
   */
  disabled?: boolean;

  /** *(optional)*
   * Preset colors shown below the controls, as hex strings.
   */
  swatches?: string[];

  /** *(optional)*
   * Id applied to the trigger button, so that an external `<label htmlFor>` can name it.
   */
  id?: string;

  /** *(optional)*
   * Additional class name applied to the trigger button.
   */
  className?: string;

  /** *(optional)*
   * The side of the trigger the panel opens on.
   * @default "bottom"
   */
  side?: "top" | "left" | "right" | "bottom";

  /** *(optional)*
   * The alignment of the panel against the trigger.
   * @default "start"
   */
  align?: "start" | "center" | "end";

  /** *(optional)*
   * Accessible label for the trigger button, as visually hidden text. An external
   * `<label htmlFor={id}>` or `aria-labelledby` takes precedence over it. The current color is
   * always exposed as the button's description.
   * @default "Choose color"
   */
  triggerLabel?: string;

  /** *(optional)*
   * Id of an element that labels the trigger button.
   */
  "aria-labelledby"?: string;

  /** *(optional)*
   * Accessible label for the saturation and brightness area.
   * @default "Saturation and brightness"
   */
  saturationLabel?: string;

  /** *(optional)*
   * Accessible label for the hue slider.
   * @default "Hue"
   */
  hueLabel?: string;

  /** *(optional)*
   * Label of the hex field inside the panel.
   * @default "Hex"
   */
  hexLabel?: string;

  /** *(optional)*
   * Accessible label for the eye dropper button, shown only where the browser supports it.
   * @default "Pick a color from the screen"
   */
  eyeDropperLabel?: string;

  /** *(optional)*
   * Accessible label for the group of preset colors.
   * @default "Preset colors"
   */
  swatchesLabel?: string;
}

const KEY_STEP = 1;
const KEY_STEP_LARGE = 10;
const FULL_HEX = /^#?[0-9a-f]{6}$/i;

/** Position of a pointer inside an element, as fractions (0-1) of its width and height. */
const relativePosition = (
  event: React.PointerEvent<HTMLElement>,
): { x: number; y: number } => {
  const rect = event.currentTarget.getBoundingClientRect();
  const fraction = (offset: number, size: number) =>
    size === 0 ? 0 : Math.min(1, Math.max(0, offset / size));

  return {
    x: fraction(event.clientX - rect.left, rect.width),
    y: fraction(event.clientY - rect.top, rect.height),
  };
};

/**
 * A themed color picker: a swatch button that opens a panel with a saturation/brightness area,
 * a hue slider, a hex field, optional preset colors and, where the browser supports it, an eye
 * dropper. Unlike `<input type="color">`, the panel follows the library theme in every browser.
 *
 * @param value - Current color, as a hex string.
 * @param onChange - Function called with the new color in the `#rrggbb` form.
 * @param disabled - *(optional)* Whether the picker is disabled.
 * @param swatches - *(optional)* Preset colors shown below the controls.
 * @param id - *(optional)* Id applied to the trigger button.
 * @param className - *(optional)* Additional class name applied to the trigger button.
 * @param side - *(optional)* The side of the trigger the panel opens on.
 * @param align - *(optional)* The alignment of the panel against the trigger.
 * @param triggerLabel - *(optional)* Accessible label for the trigger button.
 * @param saturationLabel - *(optional)* Accessible label for the saturation and brightness area.
 * @param hueLabel - *(optional)* Accessible label for the hue slider.
 * @param hexLabel - *(optional)* Label of the hex field inside the panel.
 * @param eyeDropperLabel - *(optional)* Accessible label for the eye dropper button.
 * @param swatchesLabel - *(optional)* Accessible label for the group of preset colors.
 */
export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  disabled = false,
  swatches,
  id,
  className,
  side = "bottom",
  align = "start",
  triggerLabel = "Choose color",
  "aria-labelledby": ariaLabelledBy,
  saturationLabel = "Saturation and brightness",
  hueLabel = "Hue",
  hexLabel = "Hex",
  eyeDropperLabel = "Pick a color from the screen",
  swatchesLabel = "Preset colors",
}) => {
  const classes = colorPicker();
  const currentHex = normalizeHex(value) ?? "#000000";

  // HSV is kept in state, not derived from `value`: hue and saturation are lost in hex for greys
  // and black, and the thumbs would jump while dragging through them.
  const [hsv, setHsv] = React.useState<Hsv>(() => hexToHsv(currentHex));
  const [hexDraft, setHexDraft] = React.useState(currentHex);
  const [prevHex, setPrevHex] = React.useState(currentHex);
  const [open, setOpen] = React.useState(false);

  const generatedId = React.useId();
  const triggerId = id ?? generatedId;
  const valueId = `${triggerId}-value`;

  // An eye dropper result arrives after an await: it must see the current `disabled`, not the
  // one captured when the button was clicked.
  const disabledRef = React.useRef(disabled);
  React.useEffect(() => {
    disabledRef.current = disabled;
  }, [disabled]);

  // Update state during render when the value changes from outside
  if (currentHex !== prevHex) {
    setPrevHex(currentHex);
    setHexDraft(currentHex);
    if (hsvToHex(hsv) !== currentHex) {
      setHsv(hexToHsv(currentHex));
    }
  }

  // Disabling the picker closes a panel that is already open
  if (disabled && open) {
    setOpen(false);
  }

  const applyHsv = (next: Hsv) => {
    if (disabledRef.current) return;
    const clamped = clampHsv(next);
    const nextHex = hsvToHex(clamped);
    setHsv(clamped);
    setPrevHex(nextHex);
    setHexDraft(nextHex);
    if (nextHex !== currentHex) {
      onChange(nextHex);
    }
  };

  const applyHex = (hex: string) => {
    const normalized = normalizeHex(hex);
    // The same color again (e.g. leaving the hex field untouched) must not rebuild HSV from hex:
    // on greys and black that would reset the hue and saturation the thumbs are showing.
    if (!normalized || normalized === currentHex) return;
    applyHsv(hexToHsv(normalized));
  };

  // Pointer capture keeps the drag going when the pointer leaves the control; a move without
  // capture is just a hover and is ignored.
  const trackPointer =
    (update: (position: { x: number; y: number }) => Hsv) =>
    (event: React.PointerEvent<HTMLElement>) => {
      if (event.type === "pointerdown") {
        event.currentTarget.setPointerCapture(event.pointerId);
      } else if (!event.currentTarget.hasPointerCapture(event.pointerId)) {
        return;
      }
      applyHsv(update(relativePosition(event)));
    };

  const handleSaturationPointer = trackPointer(({ x, y }) => ({
    ...hsv,
    s: x * 100,
    v: (1 - y) * 100,
  }));

  const handleHuePointer = trackPointer(({ x }) => ({ ...hsv, h: x * 360 }));

  const handleSaturationKeyDown = (event: React.KeyboardEvent) => {
    const step = event.shiftKey ? KEY_STEP_LARGE : KEY_STEP;
    const deltas: Record<string, Partial<Hsv>> = {
      ArrowLeft: { s: hsv.s - step },
      ArrowRight: { s: hsv.s + step },
      ArrowUp: { v: hsv.v + step },
      ArrowDown: { v: hsv.v - step },
    };
    const delta = deltas[event.key];
    if (!delta) return;
    event.preventDefault();
    applyHsv({ ...hsv, ...delta });
  };

  const handleHueKeyDown = (event: React.KeyboardEvent) => {
    const step = event.shiftKey ? KEY_STEP_LARGE : KEY_STEP;
    const hues: Record<string, number> = {
      ArrowLeft: hsv.h - step,
      ArrowDown: hsv.h - step,
      ArrowRight: hsv.h + step,
      ArrowUp: hsv.h + step,
      Home: 0,
      End: 360,
    };
    const hue = hues[event.key];
    if (hue === undefined) return;
    event.preventDefault();
    applyHsv({ ...hsv, h: hue });
  };

  const EyeDropper = getEyeDropper();
  const pickFromScreen = async (dropper: EyeDropperConstructor) => {
    try {
      const result = await new dropper().open();
      applyHex(result.sRGBHex);
    } catch {
      // The user dismissed the eye dropper with Esc: nothing to apply.
    }
  };

  const saturationPercent = Math.round(hsv.s);
  const brightnessPercent = Math.round(hsv.v);
  const hueDegrees = Math.round(hsv.h);
  const pureHue = hsvToHex({ h: hsv.h, s: 100, v: 100 });

  return (
    <PopoverPrimitive.Root
      open={open}
      onOpenChange={(next) => setOpen(next && !disabled)}
    >
      <PopoverPrimitive.Trigger asChild disabled={disabled}>
        {/* The default label is hidden text, not aria-label: a `<label htmlFor>` or
            `aria-labelledby` from outside then takes precedence in the accessible name. */}
        <button
          type="button"
          id={triggerId}
          className={[classes.trigger, className].filter(Boolean).join(" ")}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={valueId}
          disabled={disabled}
        >
          <span
            className={classes.triggerSwatch}
            style={{ backgroundColor: currentHex }}
            aria-hidden="true"
          />
          <span className={classes.visuallyHidden}>{triggerLabel}</span>
        </button>
      </PopoverPrimitive.Trigger>
      <span id={valueId} className={classes.visuallyHidden}>
        {currentHex}
      </span>
      <PopoverPrimitive.Content
        aria-labelledby={triggerId}
        className={classes.content}
        side={side}
        align={align}
        sideOffset={6}
      >
        <div
          role="slider"
          tabIndex={0}
          aria-label={saturationLabel}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={saturationPercent}
          aria-valuetext={`${saturationPercent}%, ${brightnessPercent}%`}
          className={classes.saturation}
          style={{ backgroundColor: pureHue }}
          onPointerDown={handleSaturationPointer}
          onPointerMove={handleSaturationPointer}
          onKeyDown={handleSaturationKeyDown}
        >
          <span
            className={classes.saturationThumb}
            style={{
              left: `${hsv.s}%`,
              top: `${100 - hsv.v}%`,
              backgroundColor: currentHex,
            }}
            aria-hidden="true"
          />
        </div>

        <div className={classes.controls}>
          <span
            className={classes.preview}
            style={{ backgroundColor: currentHex }}
            aria-hidden="true"
          />
          <div
            role="slider"
            tabIndex={0}
            aria-label={hueLabel}
            aria-orientation="horizontal"
            aria-valuemin={0}
            aria-valuemax={360}
            aria-valuenow={hueDegrees}
            aria-valuetext={`${hueDegrees}°`}
            className={classes.hue}
            onPointerDown={handleHuePointer}
            onPointerMove={handleHuePointer}
            onKeyDown={handleHueKeyDown}
          >
            <span
              className={classes.hueThumb}
              style={{
                left: `${(hsv.h / 360) * 100}%`,
                backgroundColor: pureHue,
              }}
              aria-hidden="true"
            />
          </div>
          {EyeDropper && (
            <button
              type="button"
              className={classes.eyeDropper}
              aria-label={eyeDropperLabel}
              onClick={() => pickFromScreen(EyeDropper)}
            >
              <Crosshair1Icon aria-hidden="true" />
            </button>
          )}
        </div>

        <div className={classes.hexField}>
          <Input
            label={hexLabel}
            value={hexDraft}
            maxLength={7}
            spellCheck={false}
            autoComplete="off"
            aria-invalid={normalizeHex(hexDraft) === null}
            onChange={(event) => {
              const typed = event.target.value;
              setHexDraft(typed);
              // While typing only a complete `#rrggbb` is applied: `#71a` is a valid short hex and
              // would recolor everything halfway through `#71ad00`.
              if (FULL_HEX.test(typed.trim())) {
                applyHex(typed);
              }
            }}
            onBlur={() => {
              const normalized = normalizeHex(hexDraft);
              if (normalized) {
                applyHex(normalized);
              }
              setHexDraft(normalized ?? currentHex);
            }}
          />
        </div>

        {swatches && swatches.length > 0 && (
          <fieldset aria-label={swatchesLabel} className={classes.swatches}>
            {swatches.map((swatch) => {
              const swatchHex = normalizeHex(swatch);
              if (!swatchHex) return null;
              return (
                <button
                  key={swatchHex}
                  type="button"
                  className={classes.swatch}
                  style={{ backgroundColor: swatchHex }}
                  aria-label={swatchHex}
                  aria-pressed={swatchHex === currentHex}
                  onClick={() => applyHex(swatchHex)}
                />
              );
            })}
          </fieldset>
        )}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Root>
  );
};

ColorPicker.displayName = "ColorPicker";
