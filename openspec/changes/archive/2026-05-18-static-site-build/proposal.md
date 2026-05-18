## Why

Le marketplace browser nécessite un serveur Node.js pour fonctionner, ce qui rend le déploiement sur GitHub Pages ou GitLab Pages impossible. L'objectif est de permettre à n'importe quel marketplace Claude de publier son browser en tant que site statique via un simple `npx`, sans infrastructure serveur.

## What Changes

- **Nouveau** : script de build (`scripts/build.js`) qui génère un dossier `dist/` statique complet depuis un `MARKETPLACE_PATH`
- **Nouveau** : module de recherche client-side (`public/search.js`) remplaçant HTMX + endpoint `/search`
- **Nouveau** : entrée `bin` dans `package.json` pour usage via `npx claude-marketplace-browser <path>`
- **Suppression** : dépendance HTMX (`vendor/htmx.min.js`) et route `/vendor/htmx.min.js`
- **Modification** : templates HTML — suppression des attributs `hx-*`, ajout d'attributs `data-*` sur les cartes pour le filtrage client-side
- **Mise à jour** : README avec documentation du mode statique et exemples de déploiement GitHub/GitLab Pages
- `server.js` reste inchangé et fonctionnel pour le mode dev local

## Capabilities

### New Capabilities
- `static-site-generation` : build script qui génère un site HTML statique complet (index.html, pages détail, CSS) depuis les données du marketplace

### Modified Capabilities
- `agent-search-filter` : la recherche passe de HTMX + endpoint serveur à un filtrage purement client-side via `data-*` attributes et JS vanilla

## Impact

- `scripts/build.js` — nouveau fichier, utilise `lib/data.js` et `lib/render/*.js` existants
- `public/search.js` — nouveau fichier, remplace la logique HTMX
- `lib/render/page-list.js` — ajout des `data-*` attributes sur les cartes, suppression des `hx-*`
- `lib/render/layout.js` — remplacement du chargement HTMX par `search.js`
- `package.json` — ajout `bin`, suppression dépendance potentielle HTMX
- `vendor/` — suppression de `htmx.min.js`
- `README.md` — mise à jour documentation
