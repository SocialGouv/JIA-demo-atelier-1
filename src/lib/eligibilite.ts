/* TerriTest — moteur de règles d'éligibilité (F2 / spec §5.3).
 *
 * Dispositif fictif : ces règles sont des hypothèses d'illustration, à calibrer
 * avec le métier. Le moteur est volontairement transparent et déterministe :
 *   - statut « autre » OU durée hors 2-3 semaines  → à vérifier
 *   - sinon, territoire non « ouvert »             → liste d'attente
 *   - sinon                                        → éligible
 */

export type Statut = "teletravail" | "recherche" | "independant" | "autre";
export type Territoire = "ouvert" | "bientot" | "horsliste" | "indecis";
export type Duree = "court" | "2-3" | "long";
export type Projet = "" | "solo" | "couple" | "famille";

export type CodeEligibilite = "eligible" | "liste_attente" | "a_verifier";

/** Sévérité au sens de l'alerte DSFR (`fr-alert--*`). */
export type Severite = "success" | "info" | "warning";

export interface Verdict {
  code: CodeEligibilite;
  severite: Severite;
  titre: string;
  texte: string;
}

export function evaluer(
  statut: Statut,
  territoire: Territoire,
  duree: Duree,
): Verdict {
  if (statut === "autre" || duree !== "2-3") {
    return {
      code: "a_verifier",
      severite: "warning",
      titre: "À vérifier avec un conseiller",
      texte:
        "Votre situation sort des critères automatiques. Un conseiller peut étudier votre demande au cas par cas — laissez-nous votre adresse pour être recontacté·e.",
    };
  }
  if (territoire !== "ouvert") {
    return {
      code: "liste_attente",
      severite: "info",
      titre: "Éligible — placé·e en liste d'attente",
      texte:
        "Votre profil correspond, mais le territoire visé n'est pas encore ouvert aux séjours d'essai. Inscrivez-vous pour être prévenu·e dès son ouverture.",
    };
  }
  return {
    code: "eligible",
    severite: "success",
    titre: "Vous êtes éligible au séjour d'essai",
    texte:
      "Votre profil et le territoire visé correspondent aux conditions actuelles. Laissez votre adresse pour démarrer la mise en relation.",
  };
}

/** Complément de message personnalisé selon le projet (Q4 facultative). */
export function complementProjet(projet: Projet): string {
  if (projet === "famille") {
    return " Nous vous présenterons en priorité les territoires dotés d'écoles et de services de santé.";
  }
  if (projet === "couple") {
    return " Nous tiendrons compte d'un projet à deux dans les territoires proposés.";
  }
  return "";
}
