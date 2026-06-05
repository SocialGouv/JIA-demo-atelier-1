import { track } from "../lib/funnel";

const CDN = "https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.12.1/dist/artwork/pictograms";

interface PortesProps {
  /** Remonte la porte choisie pour adapter le contexte de la capture d'intérêt. */
  onPorte: (type: "candidat" | "territoire") => void;
}

export function Portes({ onPorte }: PortesProps) {
  function handleClick(type: "candidat" | "territoire") {
    track("porte_click", { type });
    onPorte(type);
  }

  return (
    <section id="portes" className="fr-py-8w" aria-labelledby="tt-portes-titre">
      <div className="fr-container">
        <h2 id="tt-portes-titre">Comment participer&nbsp;?</h2>
        <p className="fr-text--lead tt-section-intro">
          Le dispositif réunit deux profils. Choisissez le vôtre.
        </p>

        <div className="fr-grid-row fr-grid-row--gutters fr-mt-2w">
          <div className="fr-col-12 fr-col-md-6">
            <div className="tt-porte fr-p-4w fr-enlarge-link">
              <img
                className="tt-tile__pictogram"
                src={`${CDN}/digital/avatar.svg`}
                alt=""
                aria-hidden="true"
              />
              <h3 className="fr-h5 fr-mt-3w">
                <a href="#interet" onClick={() => handleClick("candidat")}>
                  Je veux tester un territoire
                </a>
              </h3>
              <p className="fr-mb-0">
                Vous êtes un particulier prêt à vivre une immersion de 2 à 3 semaines pour vous
                projeter avant un éventuel changement de vie.
              </p>
            </div>
          </div>
          <div className="fr-col-12 fr-col-md-6">
            <div className="tt-porte fr-p-4w fr-enlarge-link">
              <img
                className="tt-tile__pictogram"
                src={`${CDN}/buildings/city-hall.svg`}
                alt=""
                aria-hidden="true"
              />
              <h3 className="fr-h5 fr-mt-3w">
                <a href="#interet" onClick={() => handleClick("territoire")}>
                  Mon territoire veut accueillir
                </a>
              </h3>
              <p className="fr-mb-0">
                Vous représentez une collectivité ou un territoire d'accueil et souhaitez proposer
                des séjours d'essai aux candidats.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
