import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { startReactDsfr } from "@codegouvfr/react-dsfr/spa";
import "@codegouvfr/react-dsfr/main.css";
import "./styles/territest.css";
import { App } from "./App";

// Démarre le runtime DSFR (gère le thème, le JS des composants : menu, accordéons…).
startReactDsfr({ defaultColorScheme: "system" });

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
