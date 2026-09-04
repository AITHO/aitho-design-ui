import { ReactNode, useEffect, useMemo, useState } from "react";
import { ThemeContext } from "./ThemeContext";
import { Theme } from "./themeEnum";

export interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
}: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(() => {
    return localStorage.getItem("theme") === Theme.DARK
      ? Theme.DARK
      : Theme.LIGHT;
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-panda-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT,
    );
  };

  const value = useMemo(() => {
    return { theme, toggleTheme };
  }, [theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
