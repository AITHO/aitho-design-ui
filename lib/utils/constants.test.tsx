import { describe, it, expect } from "vitest";
import {
  ALIGNS,
  SIDES,
  BASE_SIZES,
  SIZES_WITH_XL,
  SIZES_WITH_XS,
  SIZES_WITH_XXS,
  VARIANTS_SECONDARY_WITH_NEUTRAL,
  VARIANTS_SECONDARY_FOR_TOAST,
  VARIANTS_WITH_NEUTRAL,
  VARIANTS_WITH_ERROR,
  VARIANTS_WITH_OUTLINE_ERROR,
  BASE_VARIANTS,
  VARIANTS_GHOST,
  VARIANT_PRIMARY,
  VARIANTS_SECONDARY,
  VARIANTS_TERTIARY,
  VARIANTS_TEXT,
  argTypeAlign,
  argTypeSide,
  argTypeSize,
  argTypeVariant,
  argTypeOrientation,
  ORIENTATIONS,
  TYPES,
  TYPES_FOR_TEXT_AREA,
  argTypeType,
  BASE_POSITIONS,
  POSITIONS_WITH_VERTICAL,
  argTypePosition,
  argTypeChildren,
  BORDER_RADIUS,
  BORDER_RADIUS_NONE_AND_ROUNDED,
  BORDER_RADIUS_SIZES,
  BORDER_RADIUS_NONE_AND_SIZES,
  argTypeBorderRadius,
  BORDER_COLORS,
  BORDER_COLORS_WITH_ERROR,
  argTypeBorderColors,
  argTypeDisabled,
  argTypeRequired,
  REQUIRED_PRIMARY,
  REQUIRED_BOLD,
  REQUIRED_TEXT,
  REQUIRED_TEXT_BOLD,
  VARIANTS_WITH_WHITE,
} from "./constants";

describe("ArgTypes", () => {
  it("should return the correct structure for CHILDREN", () => {
    const result = argTypeChildren();
    expect(result).toEqual({
      control: "object",
      description: "The content of the component.",
      table: {
        type: { summary: "React.ReactNode" },
      },
    });
  });

  it("should return the correct structure for DISABLED", () => {
    const result = argTypeDisabled();
    expect(result).toEqual({
      control: "boolean",
      description: "If the component is disabled.",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    });
  });

  it("should return boolean when no option are provided for required", () => {
    const result = argTypeRequired();
    expect(result).toEqual({
      control: { type: "boolean" },
      options: undefined,
      description: "If the component is required.",
      table: {
        defaultValue: { summary: "false" },
        type: { summary: "boolean" },
      },
    });
  });

  it.each([
    ["REQUIRED_PRIMARY", REQUIRED_PRIMARY],
    ["REQUIRED_BOLD", REQUIRED_BOLD],
    ["REQUIRED_TEXT", REQUIRED_TEXT],
    ["REQUIRED_TEXT_BOLD", REQUIRED_TEXT_BOLD],
  ])(
    "should return select control with correct options for REQUIRED",
    (_, options) => {
      const result = argTypeRequired(options);
      expect(result).toEqual({
        control: { type: "select" },
        options: [true, false, ...options],
        description: "If the component is required.",
        table: {
          defaultValue: { summary: "false" },
          type: { summary: "boolean | string" },
        },
      });
    },
  );

  it.each([[BASE_SIZES], [SIZES_WITH_XL], [SIZES_WITH_XS], [SIZES_WITH_XXS]])(
    "should return the correct structure for SIZES",
    (sizes) => {
      const result = argTypeSize(sizes, "md");
      expect(result).toEqual({
        control: "select",
        options: sizes,
        description: "The size of the component.",
        table: {
          defaultValue: { summary: "md" },
          type: { summary: sizes.join(" | ") },
        },
      });
    },
  );

  it("should return the correct structure for SIDES", () => {
    const result = argTypeSide();
    expect(result).toEqual({
      control: "select",
      options: SIDES,
      description:
        "The preferred side of the trigger to render against when open. May change when collisions occur.",
      table: {
        defaultValue: { summary: "top" },
        type: { summary: SIDES.join(" | ") },
      },
    });
  });

  it("should return the correct structure for ALIGNS", () => {
    const result = argTypeAlign("center");
    expect(result).toEqual({
      control: "select",
      options: ALIGNS,
      description:
        "The preferred alignment against the trigger. May change when collisions occur.",
      table: {
        defaultValue: { summary: "center" },
        type: { summary: ALIGNS.join(" | ") },
      },
    });
  });

  it("should return the correct structure for ORIENTATIONS", () => {
    const result = argTypeOrientation();
    expect(result).toEqual({
      control: "select",
      options: ORIENTATIONS,
      description: "The orientation of the component.",
      table: {
        defaultValue: { summary: "horizontal" },
        type: { summary: ORIENTATIONS.join(" | ") },
      },
    });
  });

  it.each([[TYPES], [TYPES_FOR_TEXT_AREA]])(
    "should return the correct structure for TYPES",
    (types) => {
      const result = argTypeType(types);
      expect(result).toEqual({
        control: "select",
        options: types,
        description: "Visual style type of the component.",
        table: {
          defaultValue: { summary: "outline" },
          type: { summary: types.join(" | ") },
        },
      });
    },
  );

  it.each([[BASE_POSITIONS], [POSITIONS_WITH_VERTICAL]])(
    "should return the correct structure for POSITIONS",
    (positions) => {
      const result = argTypePosition(positions, "top-right");
      expect(result).toEqual({
        control: "select",
        options: positions,
        description: "The position of the component.",
        table: {
          defaultValue: { summary: "top-right" },
          type: { summary: positions.join(" | ") },
        },
      });
    },
  );

  it.each([
    [BORDER_RADIUS],
    [BORDER_RADIUS_NONE_AND_ROUNDED],
    [BORDER_RADIUS_SIZES],
    [BORDER_RADIUS_NONE_AND_SIZES],
  ])("should return the correct structure for SIZES", (borderRadius) => {
    const result = argTypeBorderRadius(borderRadius, "md");
    expect(result).toEqual({
      control: "select",
      options: borderRadius,
      description: "The border radius style of the component.",
      table: {
        defaultValue: { summary: "md" },
        type: { summary: borderRadius.join(" | ") },
      },
    });
  });

  it.each([[BORDER_COLORS], [BORDER_COLORS_WITH_ERROR]])(
    "should return the correct structure for BORDER COLORS",
    (borderColors) => {
      const result = argTypeBorderColors(borderColors);
      expect(result).toEqual({
        control: "select",
        options: borderColors,
        description: "The border color of the component.",
        table: {
          defaultValue: { summary: "base" },
          type: { summary: borderColors.join(" | ") },
        },
      });
    },
  );

  it.each([
    [VARIANT_PRIMARY],
    [VARIANTS_SECONDARY],
    [VARIANTS_TERTIARY],
    [VARIANTS_GHOST],
    [VARIANTS_TEXT],
    [BASE_VARIANTS],
    [VARIANTS_SECONDARY_WITH_NEUTRAL],
    [VARIANTS_SECONDARY_FOR_TOAST],
    [VARIANTS_WITH_NEUTRAL],
    [VARIANTS_WITH_ERROR],
    [VARIANTS_WITH_OUTLINE_ERROR],
    [VARIANTS_WITH_WHITE],
  ])("should return the correct structure for VARIANTS", (variants) => {
    const result = argTypeVariant(variants, "primary");
    expect(result).toEqual({
      control: "select",
      options: variants,
      description: "The visual style variant.",
      table: {
        defaultValue: { summary: "primary" },
        type: { summary: variants.join(" | ") },
      },
    });
  });
});
