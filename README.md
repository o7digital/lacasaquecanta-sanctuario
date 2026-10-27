# El Santuario · La Casa Que Canta

Intégration Astro de la maquette `El-Santuario-Premium-Codex.zip`, avec ses six articles, ses quatre images WebP et ses cinq fichiers de polices originaux.

```sh
npm ci
npm run dev
```

Ouvrir <http://localhost:4321/santuario/>. La racine redirige vers cette section puisque ce dépôt contient uniquement le journal fourni. Aucun code du site hôtelier existant n'a été importé ni modifié.

L'anglais est la langue par défaut sur `/santuario/`. La version espagnole reste disponible sous `/es/santuario/`. Le sélecteur reprend le bouton EN/ES avec chevron du site hôtelier, le même menu déroulant et la même convention de préfixe `/es`. Sa couleur s'adapte au fond ivoire du journal. Le changement de langue conserve l'article, les paramètres et l'ancre en cours ; les favoris sont partagés entre les traductions. Les slugs existants sont conservés pour préserver les liens déjà partagés.

## Organisation

- `src/pages/santuario/` : couverture et routes `/santuario/lecturas/[slug]/`.
- `src/components/santuario/` : composants correspondant à la maquette.
- `src/layouts/SantuarioLayout.astro` : document, métadonnées, styles et comportements de la section.
- `src/content/santuario/` : six articles validés par le schéma Astro (`src/content.config.ts`).
- `src/lib/santuario/i18n.ts` : textes d'interface bilingues et résolution des URL de langue.
- `public/santuario/` : images, polices, styles isolés et provenance des images.
- `reference/El-Santuario-Premium-Codex/` : contenu intégral du ZIP, conservé sans modification pour comparer le rendu.
- `licenses/santuario/` : licences des polices fournies.

Les styles utilisent les classes `santuario-page` sur `<html>` et `santuario` sur `<body>`. Les familles de polices et l'animation sont nommées pour la section. Les liens internes restent sous `/santuario/`. Aucun CMS externe n'est nécessaire.

Le logo de l'en-tête reprend les lettres et les lignes ondulées du logo officiel montré dans le pied de page du site hôtelier. L'original bleu (`/images/logo/logo.jpg`) et sa version transparente officielle (`/images/logo/logo-gris.png`) sont conservés sans modification dans `public/santuario/assets/brand/`, avec leur provenance. La version transparente sert de masque CSS pour adopter le vert du journal, en gardant ses proportions sur ordinateur et mobile. Les photographies éditoriales restent celles du ZIP.

Chaque article contient un slug, un titre, une catégorie, un résumé, une image avec ses textes alternatifs, une date, un corps, une citation et les indicateurs `draft` et `demo`. Un brouillon (`draft: true`) n'est pas généré. Les temps de lecture éditoriaux de la maquette sont conservés ; sans `readingTimeMinutes`, le temps se calcule automatiquement à 200 mots par minute. Les favoris restent dans le navigateur. Les écouteurs prennent en compte les événements de navigation Astro.

Les champs d'origine sont la version espagnole. L'objet `en` de chaque article contient sa traduction anglaise intégrale, y compris les textes alternatifs et la citation. Les modèles de page sont partagés entre les deux langues ; les métadonnées, les dates et les données structurées utilisent la langue courante, avec des liens `hreflang` EN/ES et une version par défaut anglaise.

## Vérifier et construire

```sh
npm run build
npx playwright install chromium
npm test
npm run preview
```

Les tests vérifient les quatorze pages en anglais et espagnol à 1440 et 390 pixels : traduction intégrale, liens internes, filtres, menus au clavier et sur mobile, sélection de langue depuis chaque article, favoris partagés, ressources et métadonnées. La version espagnole est aussi comparée à la maquette fournie en masquant l'en-tête qui accueille désormais le sélecteur de langue. Les captures sont enregistrées dans `artifacts/` (non versionné).

## Déploiement de la prévisualisation

Ce projet statique est configuré pour Vercel (`vercel.json`), avec `npm run build` et le dossier `dist/`. Déployer avec `vercel --prod` après liaison du projet. La variable `SITE_URL` permet de définir l'origine des URL canoniques et des données structurées.

Les textes, dates et images restent du contenu de démonstration. Les visuels de concept ne représentent pas les installations réelles de l'hôtel. La mention présente dans la maquette est conservée. La prévisualisation porte `noindex,nofollow` dans le HTML et dans les en-têtes HTTP ; `robots.txt` désactive l'exploration et les articles de démonstration sont exclus du sitemap. La mise en ligne de contenus éditoriaux réels nécessite leur validation et une modification explicite de ces réglages.

Pour intégrer ultérieurement cette section à un autre dépôt Astro, reprendre les fichiers `santuario`, le layout, le schéma de collection et les ressources. La redirection d'accueil et les directives globales de prévisualisation sont propres à ce dépôt autonome.
