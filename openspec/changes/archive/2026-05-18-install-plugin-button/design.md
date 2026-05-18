## Context

La page de détail affiche un bouton "Install Plugin" sans comportement (`lib/render/page-detail.js`). La page liste ne montre pas comment ajouter le marketplace à Claude Code. La vraie CLI Claude Code utilise :
- `claude plugin install <plugin-name>@<marketplace-name>` — installer un plugin
- `claude plugin marketplace add <source>` — ajouter un marketplace (GitHub, URL git, chemin local)

Le `marketplace-name` vient du champ `name` dans `marketplace.json`. La `source` (URL git) doit être configurable car elle n'est pas dans `marketplace.json`.

## Goals / Non-Goals

**Goals:**
- Bouton "Install Plugin" → copie `claude plugin install <plugin>@<marketplace>` dans le presse-papier
- Page liste → bannière affichant `claude plugin marketplace add <source>` avec copie presse-papier
- Source git configurable via `--marketplace-url` (CLI) ou `MARKETPLACE_URL` (env var)

**Non-Goals:**
- Exécution directe de la commande
- Déduction automatique de l'URL git depuis le dépôt courant
- Support de plusieurs sources simultanées

## Decisions

**Commande install plugin** : format fixe `claude plugin install <plugin-name>@<marketplace-name>`
- `<plugin-name>` = champ `name` du plugin dans `marketplace.json`
- `<marketplace-name>` = champ `name` racine de `marketplace.json` (ex: `"Claude Marketplace Example"`)
- Le nom du marketplace est slugifié pour la commande (lowercase, tirets)

**Commande add marketplace** : `claude plugin marketplace add <source>`
- `<source>` est configurée via option `--marketplace-url <url>` ou variable d'env `MARKETPLACE_URL`
- Si non configurée, la bannière affiche `claude plugin marketplace add <path-or-url>` avec un placeholder explicite

**Clipboard API** : `navigator.clipboard.writeText()` async, fallback `document.execCommand('copy')` pour les contextes file:// (GitLab Pages statique).

**Feedback** : changement temporaire 1500ms de l'icône (`check`) et du texte (`Copied!`), puis retour à l'état initial. Même comportement pour les deux boutons.

**Transmission serveur → client** : attribut `data-command` sur chaque bouton, valeur calculée côté serveur au moment du rendu. Script JS inline partagé en bas de page.

**Slugification du nom de marketplace** : `name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')`

## Risks / Trade-offs

- Sans `MARKETPLACE_URL` configurée, la commande add marketplace affiche un placeholder — acceptable, mieux que rien
- Le slugified marketplace name peut différer du vrai identifiant Claude Code si l'utilisateur l'a nommé autrement lors de l'ajout
