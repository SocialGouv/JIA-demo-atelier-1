/* TerriTest — logique landing : simulateur d'éligibilité, capture, instrumentation funnel.
   Dispositif fictif (atelier). Règles d'illustration cf. spec §5.3. */
(function () {
  "use strict";

  /* ---------- Instrumentation funnel (F5 / §8) ----------
     Stub qui imite les événements Matomo. En production : remplacer par _paq.push(...). */
  var funnel = {
    track: function (event, props) {
      // eslint-disable-next-line no-console
      console.log("[funnel]", event, props || {});
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    funnel.track("page_view", { source: document.referrer || "direct" });

    /* ============================================================
       SIMULATEUR D'ÉLIGIBILITÉ
       ============================================================ */
    var form = document.getElementById("tt-simulateur");
    var startTracked = false;

    if (form) {
      // simulateur_start au 1er contact avec une question
      form.addEventListener("change", function () {
        if (!startTracked) {
          startTracked = true;
          funnel.track("simulateur_start");
        }
      }, { once: false });

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var statut = valueOf(form, "statut");
        var territoire = valueOf(form, "territoire");
        var duree = valueOf(form, "duree");
        var projet = valueOf(form, "projet");

        // Validation : les 3 questions obligatoires doivent être renseignées
        var manquant = [];
        if (!statut) manquant.push("votre situation");
        if (!territoire) manquant.push("le territoire visé");
        if (!duree) manquant.push("la durée souhaitée");

        var errorZone = document.getElementById("tt-sim-error");
        if (manquant.length) {
          errorZone.innerHTML =
            '<div class="fr-alert fr-alert--error fr-alert--sm" role="alert">' +
            "<p>Merci de renseigner " + manquant.join(", ") + " pour afficher votre résultat.</p>" +
            "</div>";
          errorZone.querySelector(".fr-alert").focus && errorZone.querySelector(".fr-alert").focus();
          return;
        }
        errorZone.innerHTML = "";

        var verdict = evaluer(statut, territoire, duree);
        afficherResultat(verdict, projet);
        funnel.track("simulateur_result", { type: verdict.code });
      });
    }

    /* Moteur de règles transparent (spec §5.3) :
       - statut « autre » OU durée hors 2-3 sem  -> à vérifier
       - sinon territoire non « ouvert »          -> liste d'attente
       - sinon                                    -> éligible            */
    function evaluer(statut, territoire, duree) {
      if (statut === "autre" || duree !== "2-3") {
        return {
          code: "a_verifier",
          type: "warning",
          titre: "À vérifier avec un conseiller",
          texte: "Votre situation sort des critères automatiques. Un conseiller peut étudier votre demande au cas par cas — laissez-nous votre adresse pour être recontacté·e."
        };
      }
      if (territoire !== "ouvert") {
        return {
          code: "liste_attente",
          type: "info",
          titre: "Éligible — placé·e en liste d’attente",
          texte: "Votre profil correspond, mais le territoire visé n’est pas encore ouvert aux séjours d’essai. Inscrivez-vous pour être prévenu·e dès son ouverture."
        };
      }
      return {
        code: "eligible",
        type: "success",
        titre: "Vous êtes éligible au séjour d’essai",
        texte: "Votre profil et le territoire visé correspondent aux conditions actuelles. Laissez votre adresse pour démarrer la mise en relation."
      };
    }

    function afficherResultat(verdict, projet) {
      var zone = document.getElementById("tt-result");
      var projetTxt = "";
      if (projet === "famille") {
        projetTxt = " Nous vous présenterons en priorité les territoires dotés d’écoles et de services de santé.";
      } else if (projet === "couple") {
        projetTxt = " Nous tiendrons compte d’un projet à deux dans les territoires proposés.";
      }

      zone.innerHTML =
        '<div class="fr-alert fr-alert--' + verdict.type + '">' +
        "<h3 class=\"fr-alert__title\">" + verdict.titre + "</h3>" +
        "<p>" + verdict.texte + projetTxt + "</p>" +
        "</div>" +
        '<div class="fr-btns-group fr-btns-group--inline-md fr-mt-3w">' +
        '<a class="fr-btn fr-btn--icon-left fr-icon-mail-line" href="#interet">Être recontacté·e</a>' +
        "</div>";
      zone.hidden = false;
      var placeholder = document.getElementById("tt-result-placeholder");
      if (placeholder) placeholder.hidden = true;

      // Pré-renseigne le contexte de la manifestation d'intérêt
      setHidden("tt-resultat", verdict.code);
      setHidden("tt-type-porte", "candidat");

      // Restitution lecteur d'écran + déplacement de focus accessible
      zone.setAttribute("tabindex", "-1");
      zone.focus();
    }

    /* ============================================================
       PORTES (F3)
       ============================================================ */
    Array.prototype.forEach.call(document.querySelectorAll("[data-porte]"), function (el) {
      el.addEventListener("click", function () {
        var type = el.getAttribute("data-porte");
        funnel.track("porte_click", { type: type });
        setHidden("tt-type-porte", type);
        var titre = document.getElementById("tt-capture-contexte");
        if (titre) {
          titre.textContent = type === "territoire"
            ? "Vous représentez un territoire qui souhaite accueillir."
            : "Vous souhaitez tester un territoire.";
          titre.classList.remove("fr-hidden");
        }
      });
    });

    /* ============================================================
       CAPTURE EMAIL + CONSENTEMENT (F4)
       ============================================================ */
    var capture = document.getElementById("tt-capture-form");
    if (capture) {
      capture.addEventListener("submit", function (e) {
        e.preventDefault();
        var emailInput = document.getElementById("tt-email");
        var consent = document.getElementById("tt-consent");
        var emailGroup = document.getElementById("tt-email-group");
        var consentGroup = document.getElementById("tt-consent-group");
        var emailErr = document.getElementById("tt-email-error");
        var consentErr = document.getElementById("tt-consent-error");
        var ok = true;

        var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRe.test(emailInput.value.trim())) {
          emailGroup.classList.add("fr-input-group--error");
          emailErr.textContent = "Veuillez saisir une adresse électronique valide (ex. : prenom.nom@exemple.fr).";
          emailErr.hidden = false;
          emailInput.setAttribute("aria-invalid", "true");
          ok = false;
        } else {
          emailGroup.classList.remove("fr-input-group--error");
          emailErr.hidden = true;
          emailInput.removeAttribute("aria-invalid");
        }

        if (!consent.checked) {
          consentGroup.classList.add("fr-checkbox-group--error");
          consentErr.textContent = "Votre consentement est nécessaire pour vous recontacter.";
          consentErr.hidden = false;
          ok = false;
        } else {
          consentGroup.classList.remove("fr-checkbox-group--error");
          consentErr.hidden = true;
        }

        if (!ok) {
          (emailInput.getAttribute("aria-invalid") ? emailInput : consent).focus();
          return;
        }

        var typePorte = document.getElementById("tt-type-porte").value || "candidat";
        var resultat = document.getElementById("tt-resultat").value || "";
        funnel.track("lead_submit", { type_porte: typePorte, resultat: resultat });

        // Démo : aucune donnée n'est réellement envoyée (cf. §6 minimisation).
        var zone = document.getElementById("tt-capture-success");
        zone.innerHTML =
          '<div class="fr-alert fr-alert--success">' +
          "<h3 class=\"fr-alert__title\">Votre manifestation d’intérêt est enregistrée</h3>" +
          "<p>Merci. Nous vous recontacterons à l’adresse <strong>" + escapeHtml(emailInput.value.trim()) +
          "</strong>. Vous pouvez à tout moment demander la suppression de vos données.</p>" +
          "</div>";
        zone.hidden = false;
        capture.hidden = true;
        zone.setAttribute("tabindex", "-1");
        zone.focus();
      });
    }

    /* ---------- helpers ---------- */
    function valueOf(scope, name) {
      var el = scope.querySelector("[name='" + name + "']:checked, select[name='" + name + "']");
      return el ? el.value : "";
    }
    function setHidden(id, val) {
      var el = document.getElementById(id);
      if (el) el.value = val;
    }
    function escapeHtml(s) {
      return s.replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
      });
    }
  });
})();
