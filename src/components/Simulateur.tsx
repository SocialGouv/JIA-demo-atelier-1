import { useEffect, useRef, useState } from "react";
import {
  complementProjet,
  evaluer,
  type Duree,
  type Projet,
  type Statut,
  type Territoire,
  type Verdict,
} from "../lib/eligibilite";
import { track } from "../lib/funnel";

interface SimulateurProps {
  /** Remonte le code d'éligibilité pour pré-renseigner la capture d'intérêt. */
  onResult: (resultat: Verdict["code"]) => void;
}

const STATUTS: { value: Statut; label: string }[] = [
  { value: "teletravail", label: "En télétravail ou activité salariée" },
  { value: "recherche", label: "En recherche d'emploi" },
  { value: "independant", label: "Indépendant·e ou en création d'activité" },
  { value: "autre", label: "Autre situation" },
];

const TERRITOIRES: { value: Territoire; label: string }[] = [
  { value: "ouvert", label: "Un territoire de la liste partenaire (ouvert aux séjours)" },
  { value: "bientot", label: "Un territoire bientôt partenaire" },
  { value: "horsliste", label: "Un autre territoire, hors liste" },
  { value: "indecis", label: "Je ne sais pas encore" },
];

export function Simulateur({ onResult }: SimulateurProps) {
  const [statut, setStatut] = useState<Statut | "">("");
  const [territoire, setTerritoire] = useState<Territoire | "">("");
  const [duree, setDuree] = useState<Duree | "">("");
  const [projet, setProjet] = useState<Projet>("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [verdict, setVerdict] = useState<Verdict | null>(null);

  const startTracked = useRef(false);
  const resultRef = useRef<HTMLDivElement>(null);

  // simulateur_start : au premier contact avec une question (spec §8).
  function markStart() {
    if (!startTracked.current) {
      startTracked.current = true;
      track("simulateur_start");
    }
  }

  // Déplacement de focus vers le résultat (restitution lecteur d'écran).
  useEffect(() => {
    if (verdict && resultRef.current) {
      resultRef.current.focus();
    }
  }, [verdict]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const manquant: string[] = [];
    if (!statut) manquant.push("votre situation");
    if (!territoire) manquant.push("le territoire visé");
    if (!duree) manquant.push("la durée souhaitée");

    if (manquant.length) {
      setErreur(`Merci de renseigner ${manquant.join(", ")} pour afficher votre résultat.`);
      return;
    }
    setErreur(null);

    const v = evaluer(statut as Statut, territoire as Territoire, duree as Duree);
    setVerdict(v);
    track("simulateur_result", { type: v.code });
    onResult(v.code);
  }

  return (
    <section
      id="simulateur"
      className="fr-py-8w tt-simulateur"
      aria-labelledby="tt-sim-titre"
    >
      <div className="fr-container">
        <div className="fr-grid-row fr-grid-row--gutters">
          <div className="fr-col-12 fr-col-lg-7">
            <h2 id="tt-sim-titre">Suis-je éligible&nbsp;?</h2>
            <p className="fr-text--lead tt-section-intro">
              Répondez à 3 questions (la 4<sup>e</sup> est facultative) pour connaître
              immédiatement votre situation. Aucune donnée n'est transmise à cette étape.
            </p>

            <form className="fr-mt-2w" onChange={markStart} onSubmit={handleSubmit} noValidate>
              {/* Q1 — statut */}
              <fieldset className="fr-fieldset" aria-labelledby="tt-q1-legend">
                <legend className="fr-fieldset__legend fr-text--regular" id="tt-q1-legend">
                  <span className="fr-text--bold">1. Quelle est votre situation actuelle&nbsp;?</span>
                </legend>
                {STATUTS.map((o) => (
                  <div className="fr-fieldset__element" key={o.value}>
                    <div className="fr-radio-group">
                      <input
                        type="radio"
                        id={`q1-${o.value}`}
                        name="statut"
                        value={o.value}
                        checked={statut === o.value}
                        onChange={() => setStatut(o.value)}
                      />
                      <label className="fr-label" htmlFor={`q1-${o.value}`}>
                        {o.label}
                      </label>
                    </div>
                  </div>
                ))}
              </fieldset>

              {/* Q2 — territoire */}
              <fieldset className="fr-fieldset" aria-labelledby="tt-q2-legend">
                <legend className="fr-fieldset__legend fr-text--regular" id="tt-q2-legend">
                  <span className="fr-text--bold">2. Quel territoire vous intéresse&nbsp;?</span>
                </legend>
                {TERRITOIRES.map((o) => (
                  <div className="fr-fieldset__element" key={o.value}>
                    <div className="fr-radio-group">
                      <input
                        type="radio"
                        id={`q2-${o.value}`}
                        name="territoire"
                        value={o.value}
                        checked={territoire === o.value}
                        onChange={() => setTerritoire(o.value)}
                      />
                      <label className="fr-label" htmlFor={`q2-${o.value}`}>
                        {o.label}
                      </label>
                    </div>
                  </div>
                ))}
              </fieldset>

              {/* Q3 — durée */}
              <fieldset className="fr-fieldset" aria-labelledby="tt-q3-legend">
                <legend className="fr-fieldset__legend fr-text--regular" id="tt-q3-legend">
                  <span className="fr-text--bold">3. Quelle durée de séjour envisagez-vous&nbsp;?</span>
                </legend>
                <div className="fr-fieldset__element">
                  <div className="fr-radio-group">
                    <input
                      type="radio"
                      id="q3-court"
                      name="duree"
                      value="court"
                      checked={duree === "court"}
                      onChange={() => setDuree("court")}
                    />
                    <label className="fr-label" htmlFor="q3-court">
                      Moins de 2 semaines
                    </label>
                  </div>
                </div>
                <div className="fr-fieldset__element">
                  <div className="fr-radio-group">
                    <input
                      type="radio"
                      id="q3-23"
                      name="duree"
                      value="2-3"
                      checked={duree === "2-3"}
                      onChange={() => setDuree("2-3")}
                    />
                    <label className="fr-label" htmlFor="q3-23">
                      2 à 3 semaines{" "}
                      <span className="fr-hint-text" style={{ display: "inline" }}>
                        (recommandé)
                      </span>
                    </label>
                  </div>
                </div>
                <div className="fr-fieldset__element">
                  <div className="fr-radio-group">
                    <input
                      type="radio"
                      id="q3-long"
                      name="duree"
                      value="long"
                      checked={duree === "long"}
                      onChange={() => setDuree("long")}
                    />
                    <label className="fr-label" htmlFor="q3-long">
                      Plus de 3 semaines
                    </label>
                  </div>
                </div>
              </fieldset>

              {/* Q4 — projet (facultatif) */}
              <div className="fr-select-group fr-mt-2w">
                <label className="fr-label" htmlFor="q4-projet">
                  4. Votre projet{" "}
                  <span className="fr-hint-text">Facultatif — pour personnaliser votre réponse</span>
                </label>
                <select
                  className="fr-select"
                  id="q4-projet"
                  name="projet"
                  value={projet}
                  onChange={(e) => setProjet(e.target.value as Projet)}
                >
                  <option value="">Sélectionnez une option</option>
                  <option value="solo">Je teste seul·e</option>
                  <option value="couple">Nous testons à deux</option>
                  <option value="famille">Nous testons en famille (avec enfant·s)</option>
                </select>
              </div>

              <div className="fr-mt-2w" aria-live="assertive">
                {erreur && (
                  <div className="fr-alert fr-alert--error fr-alert--sm" role="alert">
                    <p>{erreur}</p>
                  </div>
                )}
              </div>

              <div className="fr-btns-group fr-mt-3w">
                <button
                  type="submit"
                  className="fr-btn fr-btn--lg fr-icon-arrow-right-line fr-btn--icon-right"
                >
                  Voir mon résultat
                </button>
              </div>
            </form>
          </div>

          {/* Colonne résultat */}
          <div className="fr-col-12 fr-col-lg-5">
            <div className="fr-mt-4w fr-mt-lg-0" aria-live="polite">
              {verdict ? (
                <div ref={resultRef} tabIndex={-1}>
                  <div className={`fr-alert fr-alert--${verdict.severite}`}>
                    <h3 className="fr-alert__title">{verdict.titre}</h3>
                    <p>
                      {verdict.texte}
                      {complementProjet(projet)}
                    </p>
                  </div>
                  <div className="fr-btns-group fr-btns-group--inline-md fr-mt-3w">
                    <a className="fr-btn fr-btn--icon-left fr-icon-mail-line" href="#interet">
                      Être recontacté·e
                    </a>
                  </div>
                </div>
              ) : (
                <div className="fr-callout">
                  <h3 className="fr-callout__title">Votre résultat s'affichera ici</h3>
                  <p className="fr-callout__text">
                    Le moteur est volontairement transparent : selon votre statut, le territoire
                    visé et la durée, vous serez orienté·e vers <strong>éligible</strong>,{" "}
                    <strong>liste d'attente</strong> ou{" "}
                    <strong>à vérifier par un conseiller</strong>. Dans tous les cas, vous pourrez
                    laisser vos coordonnées.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
