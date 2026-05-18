## 1. Recherche client-side

- [x] 1.1 Créer `public/search.js` avec les quatre classes `FilterState`, `CardMatcher`, `DOMUpdater`, `SearchController` (vanilla ES2020, ~70 lignes, debounce 150ms)
- [x] 1.2 Modifier `lib/render/page-list.js` — supprimer les attributs `hx-*`, ajouter `data-name`, `data-description`, `data-category`, `data-type-*` sur chaque carte (valeurs en minuscules)
- [x] 1.3 Modifier `lib/render/layout.js` — remplacer le chargement de `htmx.min.js` par `search.js`

## 2. Suppression de HTMX

- [x] 2.1 Supprimer la route `GET /vendor/htmx.min.js` dans `server.js`
- [x] 2.2 Supprimer le fichier `vendor/htmx.min.js`
- [x] 2.3 Nettoyer `scripts/vendor.js` si référence à HTMX

## 3. Script de build

- [x] 3.1 Créer `scripts/build.js` — accepte le marketplace path en argument (process.argv ou `--marketplace-path`)
- [x] 3.2 Générer `dist/index.html` en appelant `renderListPage()` avec tous les plugins
- [x] 3.3 Générer `dist/agents/{name}/index.html` pour chaque plugin via `renderDetailPage()`
- [x] 3.4 Copier `public/styles.css` et `public/search.js` dans `dist/`
- [x] 3.5 Ajouter le shebang et rendre le script exécutable

## 4. Entrée CLI

- [x] 4.1 Ajouter `"bin": { "claude-marketplace-browser": "scripts/build.js" }` dans `package.json`
- [x] 4.2 Ajouter le script npm `"build": "node scripts/build.js"` dans `package.json`

## 5. Publication npm via GitHub Actions

- [x] 5.1 Créer `.github/workflows/publish.yml` — déclenché sur push de tag `v*`, exécute `npm publish` avec le secret `NPM_TOKEN`
- [x] 5.2 S'assurer que `package.json` contient `"files"` pour n'inclure que `scripts/`, `lib/`, `public/`, `browser.config.js` (exclure `example/`, `openspec/`, `vendor/`)
- [x] 5.3 Documenter dans le README : création du tag pour déclencher la publication

## 6. Documentation

- [x] 6.1 Mettre à jour `README.md` — documenter le mode statique (`npx`, structure `dist/`), exemples de déploiement GitHub Pages et GitLab Pages, conserver la doc du mode serveur dev
