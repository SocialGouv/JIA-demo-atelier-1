// DSFR : styles + JS. Le JS du DSFR s'auto-initialise une fois chargé
// (menu mobile, modales…) — aucun code d'init manuel requis, on reste en vanilla.
import '@gouvfr/dsfr/dist/dsfr.min.css'
import '@gouvfr/dsfr/dist/utility/utility.min.css'
import '@gouvfr/dsfr/dist/dsfr.module.min.js'

// Surcharges légères propres à la landing.
import './style.css'

// Auto-diagnostic de vulnérabilité (logique 100 % client).
import { initDiagnostic } from './diagnostic.js'

// Les modules ES sont différés : le DOM est prêt à l'exécution.
initDiagnostic()
