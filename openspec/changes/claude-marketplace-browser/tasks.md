## 1. Initialisation du projet

- [x] 1.1 Créer `package.json` avec scripts (`start`, `dev`) et dépendances : `js-yaml`, `marked`
- [x] 1.2 Créer `.gitignore` (node_modules) et `README.md` (instructions `npm install && node server.js`)
- [x] 1.3 Créer `browser.config.js` exposant `MARKETPLACE_PATH` lisible depuis `server.js`, résolu via arg CLI `--marketplace`, puis env `MARKETPLACE_PATH`, puis fallback `./example`
- [x] 1.4 Créer `example/.claude-plugin/marketplace.json` avec des plugins couvrant tous les types de composants (skill, command, agent, hook, mcpServers, lspServers, et un plugin sans type)

## 2. Serveur Node.js (specs: repo-reader, marketplace-browser)

- [x] 2.1 Créer `server.js` avec le module `http` natif Node — router basique sur `req.url`
- [x] 2.2 Implémenter `readAgents()` : lecture de `marketplace.json` depuis `<MARKETPLACE_PATH>/.claude-plugin/marketplace.json`, parse JSON, ignore les entrées invalides avec warning console. `MARKETPLACE_PATH` est défini via `--marketplace <path>` (arg CLI) ou la variable d'env `MARKETPLACE_PATH`, avec fallback sur `./example`
- [x] 2.3 Implémenter `readAgentDetail(nom)` : lit les données + SKILL.md/README.md (via `marked`), gère l'absence du fichier
- [x] 2.4 Exposer `GET /` → réponse HTML page complète (layout + liste toutes cartes)
- [x] 2.5 Exposer `GET /agents/:nom` → réponse HTML page de détail
- [x] 2.6 Exposer `GET /search?q=&category=` → fragment HTML grille filtrée (pas de layout)
- [x] 2.7 Servir `vendor/htmx.min.js` sur `GET /vendor/htmx.min.js` comme fallback CDN
- [x] 2.8 Gérer les cas d'erreur : `marketplace.json` absent (warning + liste vide), plugin 404 (page d'erreur HTML)

## 3. Templates HTML (fonction de rendu inline dans server.js)

- [x] 3.1 Créer la fonction `layout(title, body)` → HTML complet avec `<head>` HTMX + CSS inline + footer "Made with love by Mathieu Durand ❤️"
- [x] 3.1b Créer la fonction `renderComponentLabels(plugin)` → badges HTML pour chaque type détecté (`skills`, `commands`, `agents`, `hooks`, `mcpServers`, `lspServers`), label `Plugin` si aucun champ présent
- [x] 3.2 Créer la fonction `renderAgentCard(agent)` → HTML d'une carte agent (nom, description, catégorie, version, labels de composants via `renderComponentLabels`, lien détail)
- [x] 3.3 Créer la fonction `renderGrid(agents)` → grille de cartes (fragment réutilisé par `/` et `/search`)
- [x] 3.4 Créer la fonction `renderListPage(agents, categories)` → layout + search bar + select catégorie + grille
- [x] 3.5 Créer la fonction `renderDetailPage(agent, readmeHtml)` → layout + métadonnées + section README + lien retour

## 4. CSS et HTMX (intégrés dans les templates)

- [x] 4.1 Écrire le CSS inline dans `layout()` : ~100 lignes, grille responsive, cartes, typographie
- [x] 4.2 Câbler HTMX sur le champ recherche : `hx-get="/search"` `hx-trigger="input delay:200ms"` `hx-target="#grid"` `hx-include="#category-select"`
- [x] 4.3 Câbler HTMX sur le select catégorie : `hx-get="/search"` `hx-trigger="change"` `hx-target="#grid"` `hx-include="#search-input"`
- [x] 4.4 Ajouter `hx-boost="true"` sur `<body>` pour navigation sans rechargement complet

## 5. Script vendor HTMX (optionnel offline)

- [x] 5.1 Créer `scripts/vendor.js` : télécharge `htmx.min.js` depuis unpkg et le sauvegarde dans `vendor/`

## 6. Validation manuelle

- [x] 6.1 Lancer le serveur sur un repo avec agents variés, vérifier que la liste se met à jour sans redémarrage après ajout d'un agent
- [x] 6.2 Tester recherche live + filtre catégorie combinés
- [x] 6.3 Tester la page de détail avec et sans README/SKILL.md
- [x] 6.4 Vérifier les cas d'erreur : YAML invalide, dossier agents absent, agent 404
