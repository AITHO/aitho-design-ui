import {
  ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { ThemeContext } from "./ThemeContext";
import { Theme } from "./themeEnum";
import { BrandTokens } from "./brandTokens";

export interface ThemeProviderProps {
  children: ReactNode;
  brand?: BrandTokens;
}

/**
 * ThemeProvider scrive i propri token su document.documentElement, l'unico <html> della pagina:
 * non ha uno scope DOM proprio. È quindi pensato per essere montato una sola volta per pagina —
 * due istanze contemporanee scriverebbero sulle stesse custom property e si sovrascriverebbero a
 * vicenda, e lo smontaggio dell'una cancellerebbe anche i token applicati dall'altra. Il contatore
 * qui sotto è il modo, a runtime, di rendere esplicito questo vincolo invece di lasciarlo solo
 * documentato.
 */
let activeInstanceCount = 0;

// In SSR non esistono né window né localStorage. Il primo render è quindi sempre `light`, sia
// sul server sia nel browser, così l'idratazione combacia; il tema salvato viene letto subito
// dopo il mount. useLayoutEffect lato server non fa nulla (e su React 18 emette un warning),
// quindi lì si ripiega su useEffect.
const isBrowser = typeof window !== "undefined";
const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect;

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  brand,
}: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(Theme.LIGHT);
  const [isStoredThemeRead, setIsStoredThemeRead] = useState(false);

  // Layout effect: in un'app solo client il tema salvato è applicato prima del primo paint.
  useIsomorphicLayoutEffect(() => {
    if (localStorage.getItem("theme") === Theme.DARK) {
      setTheme(Theme.DARK);
    }
    setIsStoredThemeRead(true);
  }, []);

  // Si salva solo dopo aver letto il valore esistente, altrimenti il `light` iniziale
  // sovrascriverebbe il tema scelto dall'utente.
  useIsomorphicLayoutEffect(() => {
    if (isStoredThemeRead) {
      localStorage.setItem("theme", theme);
    }
  }, [theme, isStoredThemeRead]);

  useEffect(() => {
    activeInstanceCount += 1;
    if (activeInstanceCount > 1) {
      console.warn(
        "ThemeProvider: more than one instance is mounted at the same time. ThemeProvider is " +
          "a singleton (one instance per page): it writes to document.documentElement, which " +
          "is shared, so multiple instances overwrite each other and unmounting one also " +
          "clears the tokens applied by the other.",
      );
    }
    return () => {
      activeInstanceCount -= 1;
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    document.documentElement.setAttribute("data-panda-theme", theme);

    const style = document.documentElement.style;
    const palette = brand?.[theme] ?? {};
    Object.entries(palette).forEach(([name, value]) => {
      if (value) {
        style.setProperty(`--${name}`, value);
      }
    });

    // Senza questo cleanup i token restano scritti su document.documentElement anche dopo lo
    // smontaggio: l'effetto veniva ri-eseguito (e ripuliva quelli precedenti) solo finché il
    // componente restava montato, mai all'unmount. Un return di cleanup copre entrambi i casi:
    // React lo richiama sia prima di ogni nuova esecuzione (cambio di theme/brand) sia
    // allo smontaggio.
    return () => {
      Object.keys(palette).forEach((name) => {
        style.removeProperty(`--${name}`);
      });
    };
  }, [theme, brand]);

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
