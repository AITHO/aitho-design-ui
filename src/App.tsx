import "../lib/main.css";
import { useTheme } from "../lib/providers/theme/useTheme";
import { css } from "../styled-system/css";
import "./App.css";

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={css({
        height: "100%",
        backgroundColor: "background-primary",
      })}
    >
      <header
        className={css({
          padding: "1rem",
        })}
      >
        <button
          onClick={toggleTheme}
          className={css({
            borderRadius: "1rem",
            backgroundColor: "background-contrast",
            color: "text-on-primary",
            padding: "1rem",
          })}
        >
          {theme === "light" ? "Switch to Dark" : "Switch to Light"}
        </button>
      </header>
      <main>
        <div
          className={css({
            alignItems: "center",
            justifyItems: "center",
            gap: "1rem",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            color: "text-primary",
          })}
        >
          Inserisci qui il tuo componente
        </div>
      </main>
    </div>
  );
}

export default App;
