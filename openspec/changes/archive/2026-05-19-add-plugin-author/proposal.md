## Why

Les fiches plugin n'affichent pas d'informations sur l'auteur du plugin, rendant difficile l'attribution et la confiance dans les plugins publiés. Ajouter l'auteur permet aux utilisateurs de savoir qui a créé un plugin et d'évaluer sa crédibilité.

## What Changes

- Ajout du champ `author` dans le schéma de plugin dans `marketplace.json`
- Affichage de l'auteur sur la page de détail d'un plugin
- Affichage optionnel de l'auteur sur les cartes de la liste (sous la description)

## Capabilities

### New Capabilities

- `plugin-author-display`: Affichage du champ auteur d'un plugin sur les pages de liste et de détail

### Modified Capabilities

- `marketplace-detail-ui`: La page de détail doit afficher le champ `author` parmi les métadonnées
- `marketplace-list-ui`: Les cartes de la liste affichent optionnellement l'auteur sous la description

## Impact

- `example/.claude-plugin/marketplace.json` : ajout du champ `author` sur les plugins d'exemple
- Templates HTML de la page de détail et des cartes de liste
- Le champ est optionnel (rétrocompatibilité avec les manifests existants sans `author`)
