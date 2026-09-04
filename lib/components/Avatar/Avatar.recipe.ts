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
] as const;
const TEXT_COLORS = [...COLORS, "black"] as const;

export type SizeVariant = (typeof SIZES)[number];
export type ColorVariant = (typeof COLORS)[number];
export type TextColorVariant = (typeof TEXT_COLORS)[number];

const SIZE_MAPS = {
  sm: { root: { h: "8", w: "8" }, text: { fontSize: "xs" } },
  md: { root: { h: "10", w: "10" }, text: { fontSize: "sm" } },
  lg: { root: { h: "12", w: "12" }, text: { fontSize: "base" } },
  xl: { root: { h: "16", w: "16" }, text: { fontSize: "lg" } },
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
      borderRadius: "full",
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
      borderRadius: "full",
      fontWeight: "semibold",
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
