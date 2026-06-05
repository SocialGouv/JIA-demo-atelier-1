const CDN = "https://cdn.jsdelivr.net/npm/@gouvfr/dsfr@1.12.1/dist/artwork/pictograms";

const ETAPES = [
  {
    num: 1,
    picto: `${CDN}/document/contract.svg`,
    titre: "Candidater",
    texte:
      "Vérifiez votre éligibilité en moins d'une minute et indiquez le territoire qui vous intéresse.",
  },
  {
    num: 2,
    picto: `${CDN}/buildings/house.svg`,
    titre: "Vivre l'immersion",
    texte:
      "Séjournez 2 à 3 semaines sur place : logement, rencontres, services du quotidien, opportunités professionnelles.",
  },
  {
    num: 3,
    picto: `${CDN}/leisure/community.svg`,
    titre: "Décider sereinement",
    texte:
      "À l'issue du séjour, vous décidez en connaissance de cause. Aucune obligation de vous installer.",
  },
];

export function Etapes() {
  return (
    <section id="etapes" className="fr-py-8w" aria-labelledby="tt-etapes-titre">
      <div className="fr-container">
        <h2 id="tt-etapes-titre">Comment ça marche</h2>
        <p className="fr-text--lead tt-section-intro">
          Trois étapes simples, de la candidature à votre décision.
        </p>

        <ol
          className="fr-grid-row fr-grid-row--gutters fr-mt-4w"
          style={{ listStyle: "none", padding: 0, margin: 0 }}
        >
          {ETAPES.map((e) => (
            <li className="fr-col-12 fr-col-md-4" key={e.num}>
              <div className="fr-p-3w">
                <div className="fr-grid-row fr-grid-row--middle" style={{ gap: "1rem" }}>
                  <span className="tt-step__num" aria-hidden="true">
                    {e.num}
                  </span>
                  <img className="tt-step__pictogram" src={e.picto} alt="" aria-hidden="true" />
                </div>
                <h3 className="fr-h5 fr-mt-2w">{e.titre}</h3>
                <p>{e.texte}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
