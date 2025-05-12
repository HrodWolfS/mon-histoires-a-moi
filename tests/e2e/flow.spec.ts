import type { Page } from "@playwright/test";
import { devices, expect, test } from "@playwright/test";
import { interceptOpenAI } from "./mocks/openai";

const desktop = {
  viewport: { width: 1280, height: 800 },
  name: "desktop-chrome",
};
const mobile = { ...devices["iPhone 12"], name: "mobile-safari" };

const waitForAnimation = async (page: Page) => page.waitForTimeout(250); // petite marge pour framer‑motion

const isWizardCleared = async (page: Page) =>
  page.evaluate(() => localStorage.getItem("use-wizard-store") === null);

const isCharacterCleared = async (page: Page) =>
  page.evaluate(() => localStorage.getItem("use-character-store") === null);

[desktop, mobile].forEach((device) => {
  test.use(device);

  test(`Flow complet – ${device.name}`, async ({ page }) => {
    // Augmenter les timeouts
    test.setTimeout(60000);
    page.setDefaultTimeout(30000);

    // Configurer localStorage avec une clé API fictive avant de charger la page
    await page.addInitScript(() => {
      window.localStorage.setItem("openai-api-key", "sk-fake12345678");
    });

    // --- intercept OpenAI ---
    await interceptOpenAI(page);

    // 0. Accueil
    await page.goto("/");
    await page.getByRole("button", { name: /créer une histoire/i }).click();
    await expect(page).toHaveURL(/\/create\/step-1/);

    // 1. SlideGender
    await page.getByTestId("gender-girl").click();

    // 2. SlideName
    await page.getByTestId("input-name").fill("Alice");
    await page.keyboard.press("Enter");
    await waitForAnimation(page);

    // 3. SlideAge
    await expect(page.getByTestId("age-5")).toBeVisible();
    await page.getByTestId("age-5").click();
    await page.getByTestId("btn-next").click();
    await waitForAnimation(page);

    // slide Emotion – sélection + confettis
    await page.getByTestId("emotion-happy").click();
    await page.getByTestId("btn-next").click(); // passe en success screen
    await waitForAnimation(page);

    // cliquer sur "Choisis ton thème"
    await page.getByTestId("btn-go-theme").click();
    await expect(page).toHaveURL(/\/create\/step-2/, { timeout: 10000 });

    // 5. SlideMission
    await page.getByTestId("mission-treasure").click();
    await page
      .getByTestId("input-mission-details")
      .fill("dans un bateau pirate");
    await page.getByTestId("btn-next").click();
    await waitForAnimation(page);

    // 6. SlideLocation
    await page.getByTestId("location-forest").click();
    await page
      .getByTestId("input-location-details")
      .fill("remplie de licornes");
    await page.getByTestId("btn-next").click();
    await waitForAnimation(page);

    // 7. SlideMorale
    await page.getByTestId("morale-courage").click();
    await page.getByTestId("btn-next").click();
    await waitForAnimation(page);

    // Arrivée sur summary
    await expect(page).toHaveURL(/\/create\/summary/);

    // Vérif. des infos sur la page Résumé
    await expect(
      page.getByRole("heading", { name: /résumé de ton histoire/i })
    ).toBeVisible();
    await expect(page.getByText(/Alice/i)).toBeVisible();
    await expect(page.getByText(/5 ans/i)).toBeVisible();
    await expect(page.getByText(/Trouver un trésor/i)).toBeVisible();
    await expect(page.getByText(/forêt magique/i)).toBeVisible();

    // Cliquer sur Générer mon histoire
    await page.getByTestId("btn-generate-story").click();

    // a) on attend la page de chargement ou accès direct au reader
    await page.waitForURL(/\/(?:create\/story-loading|story-reader)/, {
      timeout: 15000,
    });

    // si on est d’abord sur loading, attendre ensuite le reader
    if (page.url().includes("/create/story-loading")) {
      await page.waitForURL(/\/story-reader/, { timeout: 30000 });
    }

    // Vérifier qu'on est bien sur la page de lecture
    await expect(page.getByText("Le début de l'aventure")).toBeVisible();

    // Pagination flèches + audio
    await page.getByTestId("btn-audio").click();
    for (let i = 0; i < 4; i++) await page.getByTestId("arrow-next").click();
    for (let i = 0; i < 4; i++) await page.getByTestId("arrow-prev").click();
    for (let i = 0; i < 4; i++) await page.getByTestId("arrow-next").click();

    // 9. Nouvelle histoire + reset stores (assuré sur la dernière page)
    const newStoryBtn = page.getByTestId("btn-new-story");
    await expect(newStoryBtn).toBeVisible();
    await newStoryBtn.click({ force: true });

    // 10. Feedback modal appears – click "Non merci" to dismiss
    const noThanksBtn = page.getByTestId("btn-no-thanks");
    await expect(noThanksBtn).toBeVisible();
    await noThanksBtn.click();
    await waitForAnimation(page);

    await expect(page).toHaveURL("/", { timeout: 10000 });

    // Stores doivent être vidés
    await expect.poll(() => isWizardCleared(page)).toBeTruthy();
    await expect.poll(() => isCharacterCleared(page)).toBeTruthy();
  });
});
