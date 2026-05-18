## 1. Configuration de la source marketplace

- [x] 1.1 Ajouter `MARKETPLACE_URL` dans `browser.config.js` : lire depuis `--marketplace-url` (arg CLI) ou `process.env.MARKETPLACE_URL`, valeur `null` si absent
- [x] 1.2 Exposer le `name` du marketplace (champ racine de `marketplace.json`) dans une fonction `readMarketplaceMeta()` dans `lib/data.js`

## 2. Commande install plugin (page détail)

- [x] 2.1 Ajouter dans `lib/render/page-detail.js` une fonction `slugify(name)` : lowercase + remplacement des caractères non-alphanumériques par des tirets
- [x] 2.2 Ajouter une fonction `getInstallCommand(pluginName, marketplaceName)` qui retourne `claude plugin install <plugin-name>@<marketplace-slug>`
- [x] 2.3 Passer `marketplaceName` à `renderDetailPage` et injecter la commande dans l'attribut `data-command` du bouton "Install Plugin"

## 3. Bannière "Add this marketplace" (page liste)

- [x] 3.1 Dans `lib/render/page-list.js`, ajouter le rendu d'une bannière avec la commande `claude plugin marketplace add <source>` (ou placeholder si source non configurée)
- [x] 3.2 La bannière SHALL afficher la commande dans un bloc `<code>` stylisé et un bouton de copie avec attribut `data-command`

## 4. Script JS clipboard partagé

- [x] 4.1 Ajouter dans `lib/render/layout.js` un script JS inline partagé qui écoute les clics sur `[data-command]` : copie via `navigator.clipboard.writeText()` avec fallback `execCommand`
- [x] 4.2 Implémenter le feedback visuel : icône `check` + texte `Copied!` pendant 1500ms sur le bouton cliqué, puis restauration de l'état initial

## 5. Vérification

- [x] 5.1 Tester le bouton Install Plugin sur la page détail de chaque type de plugin (skill, agent, hook, MCP, LSP) et vérifier la commande copiée
- [x] 5.2 Tester la bannière avec `MARKETPLACE_URL` définie et sans configuration
- [x] 5.3 Vérifier le fallback clipboard en contexte file:// (build statique)
