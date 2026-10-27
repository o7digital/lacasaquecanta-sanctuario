# El Santuario — maquette premium

Code exact de la maquette éditoriale présentée le 26 octobre 2026 pour La Casa Que Canta.

## Ouvrir la maquette

Depuis ce dossier, lancer :

```bash
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Puis ouvrir http://localhost:4173 dans le navigateur. Un serveur local est nécessaire : les liens de cette version autonome partent de la racine du site.

## Contenu

- `dist/` : maquette HTML/CSS/JavaScript prête à servir, avec une page d'accueil et six pages d'articles.
- `dist/assets/editorial/` : les quatre images originales en WebP, les polices locales et le favicon.
- `dist/style.css` : mise en page responsive et typographie.
- `dist/app.js` : filtres, affichage des articles supplémentaires, menu mobile et favoris locaux.
- `build.py` : contenus et générateur des sept pages HTML. Python 3 suffit, sans dépendance supplémentaire.
- `image-provenance.json` : origine et prompts des visuels de concept.
- `licenses/` : licences des polices Cormorant Garamond et DM Sans.
- `INSTRUCTIONS-CODEX.md` : consignes pour intégrer la maquette dans le site Astro existant.

Pour régénérer les pages après modification des textes ou des modèles :

```bash
python3 build.py
```

Cette commande réécrit les pages HTML de `dist/` ; elle conserve les CSS, le JavaScript et les ressources.

## Fonctionnement et limites

Cette livraison reproduit la maquette en HTML/CSS/JavaScript. Ce n'est pas encore un projet Astro. Codex peut l'intégrer dans le projet Astro existant en suivant les instructions jointes.

Les textes, dates et images constituent du contenu de démonstration ; les photographies générées ne représentent pas les installations réelles de l'hôtel. Aucune photo du site actuel n'est incluse.

La maquette fonctionne sans API ni CMS. Les favoris sont mémorisés uniquement dans le navigateur. Les liens « Découvrir la maison » ouvrent le site de l'hôtel. Le compte ChatGPT n'est pas nécessaire pour exécuter ce code sur un autre hébergement.

Les pages contiennent une directive `noindex,nofollow` pour la prévisualisation. Préparer les URL canoniques, les contenus validés et le plan de site avant de rendre la section finale indexable.

Les fichiers de la maquette et leurs ressources sont fournis ; aucun identifiant d'hébergement, secret, historique Git ou accès au compte d'origine n'est livré.
