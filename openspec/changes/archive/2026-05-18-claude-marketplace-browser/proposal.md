## Why

Les équipes internes stockent leurs agents Claude dans un dépôt git (fichiers YAML/Markdown) mais n'ont pas d'interface pour les découvrir en temps réel. Cette app est déployée directement au sein du repo, lit le filesystem à la volée, et reflète immédiatement tout ajout ou modification d'agent sans aucune étape de build.

## What Changes

- Serveur Node.js minimal embarqué dans le repo (dossier `browser/`) qui lit `../agents/` en temps réel
- Interface HTMX servi par ce serveur : liste, recherche/filtrage, détail
- L'app vit dans le repo cible (pas de submodule externe nécessaire, mais compatible)
- Un seul `node server.js` suffit pour lancer l'interface

## Capabilities

### New Capabilities

- `repo-reader`: Lecture temps réel des fichiers agents depuis le filesystem du repo parent
- `marketplace-browser`: Navigation et exploration de la liste des agents
- `agent-search-filter`: Recherche textuelle et filtrage par catégorie via requêtes HTMX
- `agent-detail-view`: Vue détaillée d'un agent avec ses métadonnées et README

### Modified Capabilities

## Impact

- Nouveau dossier `browser/` dans le repo marketplace (ou ajouté comme submodule)
- Dépendance runtime : Node.js uniquement, une seule lib (`js-yaml`)
- Aucune étape de build, aucun bundler, aucun transpileur
- Le repo continue de fonctionner normalement ; `browser/` est optionnel et isolé
