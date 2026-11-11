import { defineSlotRecipe } from "@pandacss/dev";

const SIZES = ["sm", "md", "lg", "xl"] as const;
const COLORS = [
  "red",
  "green",
  "blue",
  "purple",
  "yellow",
  "gray",
  "white",
  "black",
  "transparent",
  // "brand" is not a fixed hue like the others (Panda's base color scale): it tracks the
  // theme's own color-primary (soft tint behind, full color for the initials), for callers that
  // want the avatar to read as part of the active brand instead of one of the fixed hues.
  "brand",
] as const;
const TEXT_COLORS = [...COLORS, "black"] as const;

export type SizeVariant = (typeof SIZES)[number];
export type ColorVariant = (typeof COLORS)[number];
export type TextColorVariant = (typeof TEXT_COLORS)[number];

const SIZE_MAPS = {
  sm: { root: { h: "28px", w: "28px" }, text: { fontSize: "11px" } },
  md: { root: { h: "36px", w: "36px" }, text: { fontSize: "13px" } },
  lg: { root: { h: "48px", w: "48px" }, text: { fontSize: "16px" } },
  xl: { root: { h: "64px", w: "64px" }, text: { fontSize: "20px" } },
} as const;

const BG_COLOR_MAPS = {
  red: { bg: "red.100" },
  green: { bg: "green.100" },
  blue: { bg: "blue.100" },
  purple: { bg: "purple.100" },
  yellow: { bg: "yellow.100" },
  gray: { bg: "gray.100" },
  white: { bg: "white" },
  transparent: { bg: "transparent" },
  black: { bg: "black" },
  brand: { bg: "color-primary-soft" },
} as const;

const TEXT_COLOR_MAPS = {
  red: { color: "red.700" },
  green: { color: "green.700" },
  blue: { color: "blue.700" },
  purple: { color: "purple.700" },
  yellow: { color: "yellow.700" },
  gray: { color: "gray.700" },
  white: { color: "white" },
  black: { color: "black" },
  transparent: { color: "transparent" },
  brand: { color: "color-primary" },
} as const;

export const avatarRecipe = defineSlotRecipe({
  className: "avatar",
  slots: ["root", "image", "fallback"],
  base: {
    root: {
      position: "relative",
      display: "flex",
      flexShrink: 0,
      overflow: "hidden",
      borderRadius: "50%",
      userSelect: "none",
    },
    image: {
      aspectRatio: "square",
      height: "full",
      width: "full",
    },
    fallback: {
      display: "flex",
      height: "full",
      width: "full",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      fontWeight: "bold",
      lineHeight: "1",
    },
  },
  variants: {
    size: Object.fromEntries(
      SIZES.map((size) => [
        size,
        {
          root: SIZE_MAPS[size].root,
          fallback: SIZE_MAPS[size].text,
        },
      ]),
    ),
    backgroundColor: Object.fromEntries(
      COLORS.map((color) => [color, { fallback: BG_COLOR_MAPS[color] }]),
    ),
    textColor: Object.fromEntries(
      TEXT_COLORS.map((color) => [color, { fallback: TEXT_COLOR_MAPS[color] }]),
    ),
  },
  defaultVariants: {
    size: "md",
    backgroundColor: "gray",
    textColor: "gray",
  },
});
