# Intégrer El Santuario dans le site Astro de La Casa Que Canta

Tu disposes du code de la maquette validée visuellement par Olivier. Reprends cette direction graphique fidèlement.

## Objectif

Créer une section éditoriale premium « El Santuario » dans le site existant de La Casa Que Canta : un journal d'histoires et de nouvelles sur la nature, les rituels, l'art, les saveurs et la vie de l'hôtel, autour du sentiment de paix des clients.

La section doit évoquer un beau magazine : ivoire, vert profond, accents terre, grandes compositions typographiques, photographie contemplative, filets fins et beaucoup d'espace.

## Sources de référence

- `dist/index.html` : couverture et index du journal.
- `dist/lecturas/*/index.html` : six pages d'articles.
- `dist/style.css` et `dist/fonts.css` : styles et polices.
- `dist/app.js` : comportements fonctionnels.
- `build.py` : textes structurés et modèles HTML de la maquette.
- `dist/assets/editorial/` : ressources complètes. Utiliser ces nouveaux visuels ; ne pas récupérer les photos du site actuel.

## Mise en œuvre

1. Inspecter le dépôt Astro existant, ses instructions, son routage et son système de contenu. Créer une branche de travail adaptée sans écraser les modifications locales.
2. Servir d'abord `dist/` avec la commande du README et examiner la maquette à 1440 px et 390 px. Elle est la référence de rendu.
3. Intégrer le journal sous `/santuario/` et les articles sous `/santuario/lecturas/[slug]/`, en respectant un éventuel préfixe de langue déjà utilisé dans le projet. Conserver l'accueil et les autres sections de l'hôtel.
4. Extraire des composants Astro lisibles pour le masthead, la couverture, les filtres, les cartes, le manifeste, le pied de page et le modèle d'article. Conserver la typographie, les proportions, les couleurs et les images. Éviter toute refonte générique ou substitution par des cartes standard.
5. Adapter tous les liens absolus de la maquette (`/`, `/#diario`, `/lecturas/...`, `/assets/...`, `/style.css`, `/fonts.css`, `/app.js`) à l'organisation réelle du projet. Éviter les liens qui renverraient involontairement vers la racine de l'hôtel.
6. Isoler les styles de la section avec un layout ou un conteneur dédié afin de préserver les autres pages. Conserver le responsive et la prise en compte de `prefers-reduced-motion`.
7. Réutiliser le CMS déjà présent s'il existe et convient. Sinon, organiser les articles avec le système de contenu existant ou des collections Astro. Ne pas ajouter de service payant ni de CMS externe pour cette seule intégration.
8. Prévoir pour chaque article : slug, titre, catégorie, résumé, image, texte alternatif, date, corps, temps de lecture calculé et statut brouillon/publication. Les catégories proposées sont Naturaleza, Rituales, Arte y oficio, Sabores, Vida en la casa.
9. Préserver les filtres, le bouton « Más historias », les pages de lecture, les liens associés et le menu mobile. Les favoris peuvent rester locaux au navigateur. Vérifier également les transitions Astro si le site en utilise, pour éviter la perte des écouteurs d'événements.
10. Conserver les exemples comme contenu de démonstration sur la prévisualisation. Les dates, histoires et images doivent être validées avant publication comme actualités réelles de l'hôtel. Les visuels générés sont des images de concept, pas des photographies de l'établissement.
11. Préparer les titres, descriptions, liens canoniques, données structurées d'articles et le sitemap selon le fonctionnement du site. Garder `noindex` sur la prévisualisation ; retirer cette directive uniquement pour les contenus validés destinés au site public.
12. Vérifier les liens, les filtres, l'ouverture des six articles, les images, les polices, le menu mobile, la navigation clavier, l'absence de débordement horizontal et la compilation du projet.
13. Fournir une prévisualisation du résultat et un bref compte rendu des fichiers modifiés, des vérifications et des points restant à raccorder.

## Si aucun dépôt du site n'est ouvert

Commencer par lancer la version autonome du ZIP. Demander ensuite où se trouve le projet Astro cible avant d'intégrer la section au site existant. Le ZIP est déjà directement utilisable sur un hébergement statique dont la racine de publication est `dist/`.

## Priorité visuelle

Le résultat doit rester fidèle à cette maquette. Les nouvelles images, le titre « El Santuario », la présentation de magazine et les pages de lecture sont au cœur du concept.
