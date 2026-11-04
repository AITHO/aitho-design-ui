// LANGUAGES
export const LANGUAGES = ["en", "it"] as const;

// SHAPES
export const SHAPES = ["rectangular", "circular"] as const;

// BEHAVIOURS
export const BEHAVIOURS = ["permanent", "toggle", "hover", "drawer"] as const;

// COLORS
const BASE_COLORS = [
  "red",
  "green",
  "blue",
  "purple",
  "yellow",
  "gray",
  "white",
  "brand",
] as const;
export const COLORS_WITH_TRANSPARENT = [...BASE_COLORS, "transparent"] as const;
export const COLORS_WITH_BLACK = [...BASE_COLORS, "black"] as const;

// CHILDREN
export const argTypeChildren = () => ({
  control: "object" as const,
  description: "The content of the component.",
  table: {
    type: { summary: "React.ReactNode" },
  },
});

// DISABLED
export const argTypeDisabled = () => ({
  control: "boolean" as const,
  description: "If the component is disabled.",
  table: {
    defaultValue: { summary: "false" },
    type: { summary: "boolean" },
  },
});

// REQUIRED
export const argTypeRequired = (options?: readonly string[]) => ({
  control: options ? { type: "select" as const } : { type: "boolean" as const },
  options: options ? [true, false, ...options] : undefined,
  description: "If the component is required.",
  table: {
    defaultValue: { summary: "false" },
    type: { summary: options ? "boolean | string" : "boolean" },
  },
});

// REQUIRED VARIANTS
export const REQUIRED_PRIMARY = ["primary"] as const;
export const REQUIRED_BOLD = [...REQUIRED_PRIMARY, "bold"] as const;
export const REQUIRED_TEXT = [...REQUIRED_BOLD, "text"] as const;
export const REQUIRED_TEXT_BOLD = [...REQUIRED_TEXT, "textBold"] as const;

// SIZES
export const BASE_SIZES = ["sm", "md", "lg"] as const;
export const SIZES_WITH_XL = [...BASE_SIZES, "xl"] as const;
export const SIZES_WITH_XS = ["xs", ...SIZES_WITH_XL] as const;
export const SIZES_WITH_XXS = ["xxs", ...SIZES_WITH_XS] as const;

type SizesType =
  | typeof BASE_SIZES
  | typeof SIZES_WITH_XL
  | typeof SIZES_WITH_XS
  | typeof SIZES_WITH_XXS;

export const argTypeSize = (sizes: SizesType, defaultValue: string) => ({
  control: "select" as const,
  options: sizes,
  description: "The size of the component.",
  table: {
    defaultValue: { summary: defaultValue },
    type: { summary: sizes.join(" | ") },
  },
});

// SIDES
export const SIDES = ["top", "left", "right", "bottom"] as const;

export const argTypeSide = () => ({
  control: "select" as const,
  options: SIDES,
  description:
    "The preferred side of the trigger to render against when open. May change when collisions occur.",
  table: {
    defaultValue: { summary: "top" },
    type: { summary: SIDES.join(" | ") },
  },
});

// ALIGNS
export const ALIGNS = ["start", "center", "end"] as const;

export const argTypeAlign = (defaultValue: string) => ({
  control: "select" as const,
  options: ALIGNS,
  description:
    "The preferred alignment against the trigger. May change when collisions occur.",
  table: {
    defaultValue: { summary: defaultValue },
    type: { summary: ALIGNS.join(" | ") },
  },
});

// ORIENTATIONS
export const ORIENTATIONS = ["horizontal", "vertical"] as const;

export const argTypeOrientation = () => ({
  control: "select" as const,
  options: ORIENTATIONS,
  description: "The orientation of the component.",
  table: {
    defaultValue: { summary: "horizontal" },
    type: { summary: ORIENTATIONS.join(" | ") },
  },
});

// TYPES
export const BADGE_TYPES = ["standard", "dot"] as const;
export const SPINNER_TYPES = [
  "linearFlashingDots",
  "spinningSlashes",
  "circularFlashingDots",
  "rotatingSquares",
  "rotatingDots",
] as const;
export const INPUT_TYPES = [
  "text",
  "email",
  "password",
  "number",
  "tel",
  "url",
  "date",
  "time",
  "datetime-local",
  "range",
  "search",
] as const;

export const TYPES = ["outline", "filled", "ghost"] as const;
export const TYPES_FOR_TEXT_AREA = [...TYPES, "glass", "inputForm"] as const;

type TypesType = typeof TYPES | typeof TYPES_FOR_TEXT_AREA;

export const argTypeType = (types: TypesType) => ({
  control: "select" as const,
  options: types,
  description: "Visual style type of the component.",
  table: {
    defaultValue: { summary: "outline" },
    type: { summary: types.join(" | ") },
  },
});

// POSITIONS
const POSITIONS_VERTICAL = ["top", "bottom"] as const;
export const POSITIONS_HORIZONTAL = ["left", "right"] as const;
export const POSITIONS_START_AND_END = ["start", "end"] as const;
export const POSITIONS_TYPES = ["fixed", "static"] as const;

export const BASE_POSITIONS = [
  "top-right",
  "top-left",
  "bottom-right",
  "bottom-left",
] as const;
export const POSITIONS_WITH_VERTICAL = [
  ...BASE_POSITIONS,
  ...POSITIONS_VERTICAL,
] as const;
export const ALL_POSITIONS = [
  ...POSITIONS_WITH_VERTICAL,
  ...POSITIONS_HORIZONTAL,
] as const;

type PositionsType =
  | typeof BASE_POSITIONS
  | typeof POSITIONS_WITH_VERTICAL
  | typeof ALL_POSITIONS;

export const argTypePosition = (
  positions: PositionsType,
  defaultValue: string,
) => ({
  control: "select" as const,
  options: positions,
  description: "The position of the component.",
  table: {
    defaultValue: { summary: defaultValue },
    type: { summary: positions.join(" | ") },
  },
});

// BORDER
export const BORDER_STYLE = ["solid", "dashed", "none"] as const;

const BORDER_RADIUS_ROUNDED = "rounded";
const BORDER_RADIUS_NONE = "none";

export const BORDER_RADIUS = ["flat", BORDER_RADIUS_ROUNDED, "pills"] as const;
export const BORDER_RADIUS_NONE_AND_ROUNDED = [
  BORDER_RADIUS_NONE,
  BORDER_RADIUS_ROUNDED,
] as const;
export const BORDER_RADIUS_SIZES = ["sm", "md", "lg"] as const;
export const BORDER_RADIUS_NONE_AND_SIZES = [
  BORDER_RADIUS_NONE,
  ...BORDER_RADIUS_SIZES,
] as const;

type BorderRadiusType =
  | typeof BORDER_RADIUS
  | typeof BORDER_RADIUS_NONE_AND_ROUNDED
  | typeof BORDER_RADIUS_SIZES
  | typeof BORDER_RADIUS_NONE_AND_SIZES;

export const argTypeBorderRadius = (
  borderRadius: BorderRadiusType,
  defaultValue: string,
) => ({
  control: "select" as const,
  options: borderRadius,
  description: "The border radius style of the component.",
  table: {
    defaultValue: { summary: defaultValue },
    type: { summary: borderRadius.join(" | ") },
  },
});

export const BORDER_COLORS = ["base", "primary"] as const;
export const BORDER_COLORS_WITH_ERROR = [...BORDER_COLORS, "error"] as const;

type BorderColorsType = typeof BORDER_COLORS | typeof BORDER_COLORS_WITH_ERROR;

export const argTypeBorderColors = (borderColors: BorderColorsType) => ({
  control: "select" as const,
  options: borderColors,
  description: "The border color of the component.",
  table: {
    defaultValue: { summary: "base" },
    type: { summary: borderColors.join(" | ") },
  },
});

// VARIANTS
export const VARIANT_PRIMARY = ["primary"] as const;
export const VARIANTS_SECONDARY = [...VARIANT_PRIMARY, "secondary"] as const;
export const VARIANTS_TERTIARY = [...VARIANTS_SECONDARY, "tertiary"] as const;
export const VARIANTS_GHOST = [...VARIANT_PRIMARY, "ghost"] as const;
export const VARIANTS_TEXT = [...VARIANT_PRIMARY, "text"] as const;

const VARIANTS_TRANSPARENT_AND_OUTLINE = [
  ...VARIANT_PRIMARY,
  "transparent",
  "outline",
] as const;
const VARIANT_ERROR = "error";
const VARIANT_OUTLINE_ERROR = "outlineError";
const VARIANT_WARNING = "warning";
const VARIANT_NEUTRAL = "neutral";

export const BASE_VARIANTS = [
  ...VARIANT_PRIMARY,
  VARIANT_ERROR,
  VARIANT_WARNING,
  "info",
  "success",
] as const;
export const VARIANTS_SECONDARY_WITH_NEUTRAL = [
  ...VARIANTS_SECONDARY,
  VARIANT_NEUTRAL,
] as const;
export const VARIANTS_SECONDARY_FOR_TOAST = [
  "base",
  ...VARIANTS_SECONDARY,
  VARIANT_WARNING,
  "alert",
] as const;
export const VARIANTS_WITH_NEUTRAL = [
  ...VARIANTS_TRANSPARENT_AND_OUTLINE,
  VARIANT_NEUTRAL,
] as const;
export const VARIANTS_WITH_ERROR = [
  ...VARIANTS_WITH_NEUTRAL,
  VARIANT_ERROR,
] as const;
export const VARIANTS_WITH_OUTLINE_ERROR = [
  ...VARIANTS_WITH_ERROR,
  VARIANT_OUTLINE_ERROR,
] as const;
export const VARIANTS_WITH_WHITE = [...VARIANTS_SECONDARY, "white"] as const;

type VariantsType =
  | typeof VARIANT_PRIMARY
  | typeof VARIANTS_SECONDARY
  | typeof VARIANTS_TERTIARY
  | typeof VARIANTS_GHOST
  | typeof VARIANTS_TEXT
  | typeof BASE_VARIANTS
  | typeof VARIANTS_SECONDARY_WITH_NEUTRAL
  | typeof VARIANTS_SECONDARY_FOR_TOAST
  | typeof VARIANTS_WITH_NEUTRAL
  | typeof VARIANTS_WITH_ERROR
  | typeof VARIANTS_WITH_OUTLINE_ERROR
  | typeof VARIANTS_WITH_WHITE;

export const argTypeVariant = (
  variants: VariantsType,
  defaultValue: string,
) => ({
  control: "select" as const,
  options: variants,
  description: "The visual style variant.",
  table: {
    defaultValue: { summary: defaultValue },
    type: { summary: variants.join(" | ") },
  },
});
