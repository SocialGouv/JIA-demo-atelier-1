// Auto-diagnostic de vulnérabilité à la chaleur.
// Calcul 100 % côté client : aucune donnée n'est envoyée ni conservée.
// Barème heuristique de sensibilisation — ce n'est pas un avis médical.

const QUESTIONS = ['age', 'logement', 'seul', 'patho', 'expo', 'enfant']

const LEVELS = {
  eleve: {
    variant: 'error',
    title: 'Risque élevé',
    intro:
      "Vous cumulez plusieurs facteurs de vulnérabilité à la chaleur. En période de forte chaleur, appliquez ces gestes en priorité et n'hésitez pas à demander de l'aide.",
    recos: [
      "Buvez de l'eau régulièrement, sans attendre la soif. En cas de pathologie ou de traitement, demandez à votre médecin la conduite à tenir.",
      'Gardez au moins une pièce fraîche : volets fermés le jour, aération la nuit. Passez 2 à 3 heures par jour dans un lieu climatisé (mairie, médiathèque, commerce).',
      'Rafraîchissez votre corps plusieurs fois par jour : douche tiède, linge humide, brumisateur.',
      "Restez en lien : convenez d'un appel quotidien avec un proche et inscrivez-vous au registre canicule de votre mairie.",
      'En cas de malaise, vertiges, nausées ou crampes, appelez le 15 (Samu).',
    ],
  },
  modere: {
    variant: 'warning',
    title: 'Risque modéré',
    intro:
      'Votre situation présente des facteurs de risque. Adoptez les bons réflexes dès les premières chaleurs pour éviter que la situation ne se dégrade.',
    recos: [
      "Buvez régulièrement, sans attendre la soif, et limitez l'alcool et les boissons très sucrées.",
      'Maintenez votre logement au frais (volets le jour, aération la nuit) et repérez un lieu frais près de chez vous.',
      'Évitez les efforts physiques et les sorties aux heures les plus chaudes (12 h – 16 h).',
      "Surveillez les signes d'alerte (maux de tête, fatigue inhabituelle) et gardez le contact d'un proche à portée.",
    ],
  },
  faible: {
    variant: 'success',
    title: 'Risque faible',
    intro:
      'Votre risque personnel est faible, mais la chaleur peut toucher tout le monde. Gardez les bons réflexes et protégez les personnes plus fragiles autour de vous.',
    recos: [
      "Buvez de l'eau régulièrement et rafraîchissez-vous au cours de la journée.",
      'Fermez volets et fenêtres le jour, aérez la nuit.',
      'Prenez des nouvelles des personnes fragiles de votre entourage (proches âgés ou isolés).',
    ],
  },
}

function levelFromScore(score) {
  if (score >= 7) return LEVELS.eleve
  if (score >= 3) return LEVELS.modere
  return LEVELS.faible
}

function escapeHtml(value) {
  return value.replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]),
  )
}

function renderResult(level) {
  const items = level.recos.map((reco) => `<li>${escapeHtml(reco)}</li>`).join('')
  return `
    <div class="fr-alert fr-alert--${level.variant}">
      <h3 class="fr-alert__title" id="diagnostic-result-title" tabindex="-1">${escapeHtml(level.title)}</h3>
      <p>${escapeHtml(level.intro)}</p>
    </div>
    <div class="fr-mt-3w">
      <h4 class="fr-h6">Vos recommandations prioritaires</h4>
      <ul>${items}</ul>
      <p class="fr-mt-2w">
        <a class="fr-link" href="#gestes">Voir tous les gestes essentiels</a>
      </p>
    </div>
  `
}

export function initDiagnostic() {
  const form = document.getElementById('diagnostic-form')
  if (!form) return

  const result = document.getElementById('diagnostic-result')
  const errorBox = document.getElementById('diagnostic-error')

  form.addEventListener('submit', (event) => {
    event.preventDefault()

    let score = 0
    const missing = []
    for (const name of QUESTIONS) {
      const checked = form.querySelector(`input[name="${name}"]:checked`)
      const fieldset = document.getElementById(`q-${name}`)
      if (!checked) {
        missing.push(name)
        fieldset?.classList.add('fr-fieldset--error')
        continue
      }
      fieldset?.classList.remove('fr-fieldset--error')
      score += Number(checked.value)
    }

    if (missing.length > 0) {
      result.innerHTML = ''
      errorBox.innerHTML = `<p class="fr-message fr-message--error">Merci de répondre aux 6 questions pour obtenir votre résultat (${missing.length} sans réponse).</p>`
      return
    }

    errorBox.innerHTML = ''
    result.innerHTML = renderResult(levelFromScore(score))

    const title = document.getElementById('diagnostic-result-title')
    if (title) {
      title.focus()
      title.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  })

  form.addEventListener('reset', () => {
    errorBox.innerHTML = ''
    result.innerHTML = ''
    for (const name of QUESTIONS) {
      document.getElementById(`q-${name}`)?.classList.remove('fr-fieldset--error')
    }
  })
}
