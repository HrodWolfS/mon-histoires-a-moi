import { Page } from "@playwright/test";

export const mockStory = {
  choices: [
    {
      message: {
        content: JSON.stringify([
          {
            title: "Le début de l'aventure",
            content:
              "Alice se réveilla un matin avec une idée extraordinaire. Elle voulait trouver le fameux trésor dont tout le monde parlait au village. Ses parents lui avaient souvent raconté la légende de ce trésor magique, caché quelque part dans la forêt enchantée.",
          },
          {
            title: "La carte mystérieuse",
            content:
              "Dans le grenier de sa maison, Alice découvrit une vieille carte poussiéreuse. Les lignes sur le papier jauni semblaient indiquer un chemin vers le cœur de la forêt. Son cœur battait fort tandis qu'elle préparait son petit sac à dos pour l'expédition.",
          },
          {
            title: "L'entrée dans la forêt",
            content:
              "Les grands arbres de la forêt magique formaient une voûte au-dessus de sa tête. Des rayons de soleil filtraient à travers les feuilles, créant des motifs dansants sur le sol. Alice suivait attentivement la carte, notant chaque repère: la pierre en forme d'étoile, le ruisseau chantant, l'arbre aux mille branches.",
          },
          {
            title: "La découverte",
            content:
              "Devant une souche d'arbre couverte de mousse brillante, Alice s'arrêta. Son instinct lui disait que c'était l'endroit. Avec courage, elle plongea sa main dans un creux de la souche et sentit quelque chose de froid et métallique. C'était le trésor! Ses pierres scintillaient de mille couleurs.",
          },
          {
            title: "Le retour triomphant",
            content:
              "En rentrant au village, Alice fut accueillie comme une héroïne. Elle avait prouvé que même les enfants peuvent accomplir de grandes choses avec du courage et de la détermination. Le trésor retrouvé révéla ses pouvoirs magiques: il pouvait guérir les plantes malades et faire pousser les plus belles fleurs du royaume.",
          },
        ]),
      },
    },
  ],
};

export function interceptOpenAI(page: Page) {
  // Intercepter toutes les requêtes réseau pour voir ce qui est appelé
  page.on("request", (request) => {
    console.log(">> REQUEST:", request.method(), request.url());
  });

  page.on("response", (response) => {
    console.log("<< RESPONSE:", response.status(), response.url());
  });

  // Intercepter l'appel exact qui échoue (vu dans les logs)
  page.route("https://api.openai.com/v1/chat/completions", (route) => {
    console.log("INTERCEPTÉ : Appel à /v1/chat/completions");
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(mockStory),
    });
  });

  // Intercepter les appels à l'API OpenAI pour la génération audio
  page.route("**/audio/speech", (route) => {
    console.log("INTERCEPTÉ: Audio Speech API");
    return route.fulfill({
      status: 200,
      body: "FAKEAUDIO",
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  });

  // Intercepter tous les appels qui pourraient concerner la génération d'histoire
  page.route("**/api/generate*", (route) => {
    console.log("INTERCEPTÉ: Histoire API - generate*");
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        story: mockStory.choices[0].message.content,
      }),
    });
  });

  // Intercepter les appels à l'API spécifique de génération d'histoire
  page.route("**/api/story/generate", (route) => {
    console.log("INTERCEPTÉ: Histoire API - story/generate");
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        story: JSON.parse(mockStory.choices[0].message.content),
      }),
    });
  });
}
