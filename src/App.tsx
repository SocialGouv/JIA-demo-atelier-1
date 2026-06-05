import { useEffect, useState } from "react";
import { Header } from "@codegouvfr/react-dsfr/Header";
import { Footer } from "@codegouvfr/react-dsfr/Footer";
import { SkipLinks } from "@codegouvfr/react-dsfr/SkipLinks";
import { Hero } from "./components/Hero";
import { Etapes } from "./components/Etapes";
import { Simulateur } from "./components/Simulateur";
import { Portes } from "./components/Portes";
import { CaptureEmail, type CaptureContext } from "./components/CaptureEmail";
import { Faq } from "./components/Faq";
import { track } from "./lib/funnel";

const HOME_LINK = {
  href: "/",
  title: "Accueil — TerriTest, séjour d'essai territorial",
};

export function App() {
  // Contexte de la manifestation d'intérêt, alimenté par le simulateur et les portes.
  const [contexte, setContexte] = useState<CaptureContext>({
    typePorte: "candidat",
    resultat: "",
  });

  // page_view à l'arrivée (F5 / spec §8).
  useEffect(() => {
    track("page_view", { source: document.referrer || "direct" });
  }, []);

  return (
    <>
      <SkipLinks
        links={[
          { anchor: "#contenu", label: "Contenu" },
          { anchor: "#simulateur", label: "Simulateur d'éligibilité" },
          { anchor: "#footer", label: "Pied de page" },
        ]}
      />

      <Header
        brandTop={
          <>
            République
            <br />
            Française
          </>
        }
        serviceTitle="TerriTest"
        serviceTagline="Séjour d'essai territorial"
        homeLinkProps={HOME_LINK}
        quickAccessItems={[
          {
            iconId: "fr-icon-calculator-line",
            text: "Tester mon éligibilité",
            linkProps: { href: "#simulateur" },
          },
        ]}
        navigation={[
          { text: "Comment ça marche", linkProps: { href: "#etapes" } },
          { text: "Tester mon éligibilité", linkProps: { href: "#simulateur" } },
          { text: "Participer", linkProps: { href: "#portes" } },
          { text: "Questions fréquentes", linkProps: { href: "#faq" } },
        ]}
      />

      <main id="contenu">
        <Hero />
        <Etapes />
        <Simulateur
          onResult={(resultat) => setContexte({ typePorte: "candidat", resultat })}
        />
        <Portes onPorte={(typePorte) => setContexte((c) => ({ ...c, typePorte }))} />
        <CaptureEmail contexte={contexte} />
        <Faq />
      </main>

      <Footer
        id="footer"
        brandTop={
          <>
            République
            <br />
            Française
          </>
        }
        homeLinkProps={HOME_LINK}
        accessibility="non compliant"
        contentDescription="TerriTest est un dispositif d'expérimentation. Ce site est une démonstration : les règles d'éligibilité présentées sont des hypothèses d'illustration."
        bottomItems={[
          { text: "Plan du site", linkProps: { href: "#" } },
          { text: "Mentions légales", linkProps: { href: "#" } },
          { text: "Données personnelles", linkProps: { href: "#" } },
          { text: "Gestion des cookies", linkProps: { href: "#" } },
          { text: "Contact", linkProps: { href: "#" } },
        ]}
      />
    </>
  );
}
