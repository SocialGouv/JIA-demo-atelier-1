import { test, expect } from '@playwright/test'

// On clique les libellés (fr-label) : le DSFR masque les inputs natifs,
// qui interceptent mal les clics.

test('auto-diagnostic : le parcours principal affiche un niveau de risque', async ({ page }) => {
  await page.goto('/')

  await page.locator('#q-age').getByText('75 ans ou plus').click()
  await page.locator('#q-logement').getByText('Sous les toits ou mal isolé').click()
  await page.locator('#q-seul').getByText('Oui, je vis seul·e').click()
  await page.locator('#q-patho').getByText('Oui', { exact: true }).click()
  await page.locator('#q-expo').getByText('Régulièrement').click()
  await page.locator('#q-enfant').getByText('Non', { exact: true }).click()

  await page.getByRole('button', { name: 'Voir mon résultat' }).click()

  const result = page.locator('#diagnostic-result')
  await expect(result.getByRole('heading', { name: 'Risque élevé' })).toBeVisible()
  await expect(result.getByText('Vos recommandations prioritaires')).toBeVisible()
})

test('auto-diagnostic : un formulaire incomplet affiche une erreur', async ({ page }) => {
  await page.goto('/')

  await page.locator('#q-age').getByText('Moins de 65 ans').click()
  await page.getByRole('button', { name: 'Voir mon résultat' }).click()

  await expect(page.locator('#diagnostic-error')).toContainText('Merci de répondre aux 6 questions')
  await expect(page.locator('#diagnostic-result')).toBeEmpty()
})
