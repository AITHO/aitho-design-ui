export const mainTemplate = (components: { name: string }[]): string => `
import './main.css';

export { ThemeProvider, type ThemeProviderProps } from "./providers/theme/ThemeProvider";
export { useTheme } from "./providers/theme/useTheme"
export { type ThemeContextType } from "./providers/theme/ThemeContext"

export { ToastProvider, type ToastProviderProps } from "./providers/toast/ToastProvider";
export { type ToastContextType } from "./providers/toast/ToastContext";
export { useToast } from "./providers/toast/useToast";

${components
  .map(
    (component) =>
      `export { ${component.name}, type ${component.name}Props } from './components/${component.name}/${component.name}';`,
  )
  .join("\n")}
`;
