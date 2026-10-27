# El Santuario · La Casa Que Canta

Intégration Astro de la maquette `El-Santuario-Premium-Codex.zip`, avec ses six articles, ses quatre images WebP et ses cinq fichiers de polices originaux.

```sh
npm ci
npm run dev
```

Ouvrir <http://localhost:4321/santuario/>. La racine redirige vers cette section puisque ce dépôt contient uniquement le journal fourni. Aucun code du site hôtelier existant n'a été importé ni modifié.

## Organisation

- `src/pages/santuario/` : couverture et routes `/santuario/lecturas/[slug]/`.
- `src/components/santuario/` : composants correspondant à la maquette.
- `src/layouts/SantuarioLayout.astro` : document, métadonnées, styles et comportements de la section.
- `src/content/santuario/` : six articles validés par le schéma Astro (`src/content.config.ts`).
- `public/santuario/` : images, polices, styles isolés et provenance des images.
- `reference/El-Santuario-Premium-Codex/` : contenu intégral du ZIP, conservé sans modification pour comparer le rendu.
- `licenses/santuario/` : licences des polices fournies.

Les styles utilisent les classes `santuario-page` sur `<html>` et `santuario` sur `<body>`. Les familles de polices et l'animation sont nommées pour la section. Les liens internes restent sous `/santuario/`. Aucun CMS externe n'est nécessaire.

Chaque article contient un slug, un titre, une catégorie, un résumé, une image avec ses textes alternatifs, une date, un corps, une citation et les indicateurs `draft` et `demo`. Un brouillon (`draft: true`) n'est pas généré. Les temps de lecture éditoriaux de la maquette sont conservés ; sans `readingTimeMinutes`, le temps se calcule automatiquement à 200 mots par minute. Les favoris restent dans le navigateur. Les écouteurs prennent en compte les événements de navigation Astro.

## Vérifier et construire

```sh
npm run build
npx playwright install chromium
npm test
npm run preview
```

Les tests comparent les sept pages à la référence à 1440 et 390 pixels, vérifient les liens internes, les filtres, le menu clavier/mobile, les favoris, les ressources et les métadonnées. Les captures sont enregistrées dans `artifacts/` (non versionné).

## Déploiement de la prévisualisation

Ce projet statique est configuré pour Vercel (`vercel.json`), avec `npm run build` et le dossier `dist/`. Déployer avec `vercel --prod` après liaison du projet. La variable `SITE_URL` permet de définir l'origine des URL canoniques et des données structurées.

Les textes, dates et images restent du contenu de démonstration. Les visuels de concept ne représentent pas les installations réelles de l'hôtel. La mention présente dans la maquette est conservée. La prévisualisation porte `noindex,nofollow` dans le HTML et dans les en-têtes HTTP ; `robots.txt` désactive l'exploration et les articles de démonstration sont exclus du sitemap. La mise en ligne de contenus éditoriaux réels nécessite leur validation et une modification explicite de ces réglages.

Pour intégrer ultérieurement cette section à un autre dépôt Astro, reprendre les fichiers `santuario`, le layout, le schéma de collection et les ressources. La redirection d'accueil et les directives globales de prévisualisation sont propres à ce dépôt autonome.
