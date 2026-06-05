import { Accordion } from "@codegouvfr/react-dsfr/Accordion";

const QUESTIONS = [
  {
    q: "Le séjour d'essai m'engage-t-il à m'installer ?",
    r: "Non. Le séjour d'essai est précisément conçu pour décider en connaissance de cause, sans aucune obligation d'installation à l'issue de l'immersion.",
  },
  {
    q: "Combien de temps dure une immersion ?",
    r: "La durée recommandée est de 2 à 3 semaines. C'est l'intervalle qui permet de découvrir réellement le quotidien d'un territoire : logement, services, vie locale et opportunités.",
  },
  {
    q: "Que deviennent mes données ?",
    r: "Seule votre adresse électronique est collectée, uniquement avec votre consentement explicite, afin de vous recontacter. Aucune donnée sensible n'est demandée. Vous pouvez à tout moment demander l'accès ou la suppression de vos données via le pied de page.",
  },
  {
    q: "Je représente un territoire : comment se déclarer ?",
    r: "Choisissez la porte « Mon territoire veut accueillir » puis laissez votre adresse. Nous reviendrons vers vous pour qualifier votre territoire et organiser l'accueil de candidats.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="fr-py-8w" aria-labelledby="tt-faq-titre">
      <div className="fr-container">
        <div className="fr-grid-row fr-grid-row--center">
          <div className="fr-col-12 fr-col-md-9 fr-col-lg-8">
            <h2 id="tt-faq-titre">Questions fréquentes</h2>
            <div className="fr-accordions-group fr-mt-2w">
              {QUESTIONS.map((item, i) => (
                <Accordion key={i} label={item.q}>
                  {item.r}
                </Accordion>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
