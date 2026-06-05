const ILLUSTRATION =
  "https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.12.1/dist/artwork/pictograms/map/location-france.svg";

export function Hero() {
  return (
    <section className="tt-hero fr-py-8w" aria-labelledby="tt-hero-titre">
      <div className="fr-container">
        <div className="fr-grid-row fr-grid-row--gutters fr-grid-row--middle">
          <div className="fr-col-12 fr-col-md-7">
            <p className="fr-badge fr-badge--info fr-badge--no-icon fr-mb-2w">
              Dispositif en expérimentation
            </p>
            <h1 id="tt-hero-titre">Testez un territoire avant de vous y installer</h1>
            <p className="fr-text--lead">
              Le séjour d'essai territorial vous permet de vivre 2 à 3 semaines dans un territoire
              d'accueil, de découvrir le quotidien, les services et les opportunités — puis de
              décider, sans vous engager.
            </p>
            <ul className="fr-btns-group fr-btns-group--inline-md fr-mt-3w">
              <li>
                <a
                  className="fr-btn fr-btn--lg fr-icon-calculator-line fr-btn--icon-left"
                  href="#simulateur"
                >
                  Tester mon éligibilité
                </a>
              </li>
              <li>
                <a className="fr-btn fr-btn--lg fr-btn--secondary" href="#etapes">
                  Comment ça marche
                </a>
              </li>
            </ul>
          </div>
          <div className="fr-col-12 fr-col-md-5 fr-text--center">
            <img className="tt-hero__illustration" src={ILLUSTRATION} alt="" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
