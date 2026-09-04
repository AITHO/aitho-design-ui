export const recipeTemplate = (name: string, camelName: string): string => `
import { defineSlotRecipe } from "@pandacss/dev";

    const SIZES = ["sm", "md", "lg"] as const;
   const VARIANTS = ["primary", "secondary"] as const;

    export type SizeVariant = (typeof SIZES)[number];
   export type VariantType = (typeof VARIANTS)[number];

    const SIZE_MAPS = {
     sm: { padding: "2", fontSize: "sm" },
     md: { padding: "3", fontSize: "base" },
     lg: { padding: "4", fontSize: "lg" },
   } as const;

    const VARIANT_MAPS = {
     primary: {
       bg: "blue.500",
       color: "white",
     },
     secondary: {
       bg: "gray.100",
       color: "gray.900",
     },
   } as const;

    export const ${camelName}Recipe = defineSlotRecipe({
     className: "${name.trim().toLowerCase()}",
     slots: ["root"],
     base: {
       root: {
         display: "flex",
         alignItems: "center",
         justifyContent: "center",
         borderRadius: "md",
         transition: "colors",
       },
     },
     variants: {
       size: Object.fromEntries(
         SIZES.map((size) => [
           size,
           {
             root: SIZE_MAPS[size],
           },
         ]),
       ),
       variant: Object.fromEntries(
         VARIANTS.map((variant) => [
           variant,
           {
             root: VARIANT_MAPS[variant],
           },
         ]),
       ),
     },
     defaultVariants: {
       size: "md",
       variant: "primary",
     },
   });
`;
