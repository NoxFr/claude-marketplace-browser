## Why

Le bouton "Install Plugin" sur la page de détail est un placeholder sans comportement, et la page liste n'indique pas comment ajouter ce marketplace à Claude Code. Les utilisateurs ont besoin des vraies commandes CLI à copier-coller directement.

## What Changes

- Le bouton "Install Plugin" sur la page détail génère et copie la commande `claude plugin install <plugin-name>@<marketplace-name>` dans le presse-papier
- Un feedback visuel confirme la copie (changement d'icône/texte temporaire)
- La page liste affiche une bannière "Add this marketplace" avec la commande `claude plugin marketplace add <source>` (source = URL git du dépôt, déduite ou configurée)
- Le nom du marketplace (`marketplace-name`) vient du champ `name` de `marketplace.json`

## Capabilities

### New Capabilities

- `install-command-generator`: Génération de la commande `claude plugin install <plugin>@<marketplace>` et copie dans le presse-papier avec feedback utilisateur
- `marketplace-add-banner`: Affichage sur la page liste de la commande `claude plugin marketplace add <source>` pour ajouter ce marketplace à Claude Code

### Modified Capabilities

- `marketplace-detail-ui`: Le bouton Install Plugin passe de placeholder à bouton fonctionnel avec la vraie commande Claude Code CLI

## Impact

- `lib/render/page-detail.js` : commande d'install et JS inline clipboard
- `lib/render/page-list.js` : ajout de la bannière "Add this marketplace"
- `lib/data.js` : exposition du champ `name` du marketplace et de la source (URL git ou config)
- `browser.config.js` : option `--marketplace-url` ou variable d'env pour la source git
- Aucune dépendance externe
