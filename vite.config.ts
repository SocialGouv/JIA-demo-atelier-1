import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    // Le CSS du DSFR contient un hack média hérité d'Internet Explorer
    // (`@media (min-width: 0\0)`) que LightningCSS rejette par défaut.
    // errorRecovery l'ignore proprement au lieu de faire échouer le build.
    lightningcss: {
      errorRecovery: true,
    },
  },
});
