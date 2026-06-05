import { useEffect, useRef, useState } from "react";
import { track } from "../lib/funnel";

export interface CaptureContext {
  typePorte: "candidat" | "territoire";
  resultat: string;
}

interface CaptureEmailProps {
  contexte: CaptureContext;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CaptureEmail({ contexte }: CaptureEmailProps) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [consentErr, setConsentErr] = useState<string | null>(null);
  const [envoye, setEnvoye] = useState(false);

  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (envoye && successRef.current) {
      successRef.current.focus();
    }
  }, [envoye]);

  const contexteLabel =
    contexte.typePorte === "territoire"
      ? "Vous représentez un territoire qui souhaite accueillir."
      : "Vous souhaitez tester un territoire.";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let ok = true;

    if (!EMAIL_RE.test(email.trim())) {
      setEmailErr("Veuillez saisir une adresse électronique valide (ex. : prenom.nom@exemple.fr).");
      ok = false;
    } else {
      setEmailErr(null);
    }

    if (!consent) {
      setConsentErr("Votre consentement est nécessaire pour vous recontacter.");
      ok = false;
    } else {
      setConsentErr(null);
    }

    if (!ok) return;

    track("lead_submit", {
      type_porte: contexte.typePorte,
      resultat: contexte.resultat,
    });

    // Démo : aucune donnée n'est réellement envoyée (cf. spec §6, minimisation).
    // En production : POST { email, consentement, qualif, type_porte } vers /api/interet.
    setEnvoye(true);
  }

  return (
    <section id="interet" className="tt-capture fr-py-8w" aria-labelledby="tt-capture-titre">
      <div className="fr-container">
        <div className="fr-grid-row fr-grid-row--center">
          <div className="fr-col-12 fr-col-md-8 fr-col-lg-7">
            <h2 id="tt-capture-titre">Être recontacté·e</h2>
            <p className="tt-section-intro">
              Laissez votre adresse électronique : nous reviendrons vers vous pour la suite de votre
              démarche. Une seule donnée vous est demandée, et uniquement avec votre accord.
            </p>

            {!envoye && (
              <p className="fr-badge fr-badge--info fr-badge--no-icon fr-mb-2w">{contexteLabel}</p>
            )}

            <div aria-live="polite">
              {envoye && (
                <div ref={successRef} tabIndex={-1} className="fr-alert fr-alert--success">
                  <h3 className="fr-alert__title">Votre manifestation d'intérêt est enregistrée</h3>
                  <p>
                    Merci. Nous vous recontacterons à l'adresse <strong>{email.trim()}</strong>. Vous
                    pouvez à tout moment demander la suppression de vos données.
                  </p>
                </div>
              )}
            </div>

            {!envoye && (
              <form className="fr-mt-2w" onSubmit={handleSubmit} noValidate>
                <div className={`fr-input-group${emailErr ? " fr-input-group--error" : ""}`}>
                  <label className="fr-label" htmlFor="tt-email">
                    Adresse électronique
                    <span className="fr-hint-text">Format attendu : prenom.nom@exemple.fr</span>
                  </label>
                  <input
                    className="fr-input"
                    type="email"
                    id="tt-email"
                    name="email"
                    autoComplete="email"
                    aria-describedby="tt-email-error"
                    aria-invalid={emailErr ? true : undefined}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {emailErr && (
                    <p id="tt-email-error" className="fr-error-text">
                      {emailErr}
                    </p>
                  )}
                </div>

                <div
                  className={`fr-checkbox-group fr-mt-2w${consentErr ? " fr-checkbox-group--error" : ""}`}
                >
                  <input
                    type="checkbox"
                    id="tt-consent"
                    name="consentement"
                    aria-describedby="tt-consent-error"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                  />
                  <label className="fr-label" htmlFor="tt-consent">
                    J'accepte d'être recontacté·e par l'équipe TerriTest au sujet du séjour d'essai
                    territorial.
                    <span className="fr-hint-text">
                      Vous pourrez retirer votre consentement et demander la suppression de vos
                      données à tout moment.
                    </span>
                  </label>
                  {consentErr && (
                    <p id="tt-consent-error" className="fr-error-text">
                      {consentErr}
                    </p>
                  )}
                </div>

                <div className="fr-btns-group fr-mt-3w">
                  <button type="submit" className="fr-btn fr-icon-mail-line fr-btn--icon-left">
                    Être recontacté·e
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
