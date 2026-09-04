import { camelCase } from "case-anything";

export const presetTemplate = (components: { name: string }[]): string => `
import { definePreset } from '@pandacss/dev';
${components
  .map(
    (component) =>
      `import { ${camelCase(
        component.name,
      )}Recipe } from './components/${component.name}/${component.name}.recipe';`,
  )
  .join("\n")}

export const preset = definePreset({
  name: 'aitho',
  theme: {
    slotRecipes: {
      ${components
        .map((c) => `${camelCase(c.name)}: ${camelCase(c.name)}Recipe`)
        .join(",\n      ")}
    },
  },
  staticCss: {
    recipes: {
      ${components.map((c) => `${camelCase(c.name)}: ['*']`).join(",\n      ")}
    },
  },
});
`;
