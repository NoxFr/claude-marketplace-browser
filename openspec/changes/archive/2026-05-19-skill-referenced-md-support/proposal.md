## Why

Les fichiers SKILL.md peuvent référencer d'autres fichiers Markdown via la syntaxe `@NomFichier.md` (ex : `@RTK.md`). Actuellement, le navigateur affiche ces références comme du texte brut, sans charger ni afficher le contenu des fichiers référencés — l'utilisateur perd donc le contexte complet du skill.

## What Changes

- Détection des références `@NomFichier.md` dans le contenu des fichiers de composants (skills, agents…)
- Résolution des chemins référencés relatifs au répertoire du composant
- Remplacement des références dans le rendu par le contenu chargé du fichier cible, dans un bloc visuel distinct ("callout référencé")
- Gestion silencieuse des références vers des fichiers absents (pas d'erreur visible)

## Capabilities

### New Capabilities

- `md-reference-inlining`: Résolution et inlining des références `@file.md` dans le contenu des composants affichés dans la vue détail

### Modified Capabilities

- `component-content-display`: Le pipeline de rendu du contenu des composants intègre maintenant la résolution des références Markdown

## Impact

- `lib/data.js` : ajout de la logique de détection et résolution des références `@file.md` dans `readSkillFiles` et `readComponentFiles`
- `lib/render/page-detail.js` : ajout d'un rendu visuel distinct pour les blocs de contenu inlinés (callout avec titre = nom du fichier référencé)
- Aucun impact sur l'API, le format `marketplace.json`, ni la génération statique
