## Why

Actuellement, `marketplace.json` accepte des entrées de plugin incomplètes (sans `name` ni `source`) et ignore toujours la configuration locale du plugin même quand celui-ci est disponible localement. Cela oblige les auteurs de marketplaces à dupliquer dans `marketplace.json` des métadonnées déjà déclarées dans le `plugin.json` du plugin, et peut conduire à des incohérences.

## What Changes

- **BREAKING** `name` et `source` deviennent des champs **obligatoires** pour chaque entrée plugin dans `marketplace.json` — les entrées sans ces champs sont rejetées avec un avertissement
- Quand `source` est un chemin relatif (commence par `.`), le build lit le fichier `.claude-plugin/plugin.json` dans ce dossier et fusionne ses champs dans la fiche plugin ; les champs du manifeste local écrasent ceux de `marketplace.json`
- Quand `source` est une URL ou un chemin absolu, le comportement actuel est conservé (pas de lecture locale)

## Capabilities

### New Capabilities

- `plugin-source-validation`: validation obligatoire des champs `name` et `source` à la lecture de `marketplace.json` — génère un warning et ignore les entrées invalides
- `local-plugin-manifest-merge`: pour les plugins dont `source` est un chemin relatif, lecture et fusion du `plugin.json` local (`.claude-plugin/plugin.json`) avec priorité sur `marketplace.json`

### Modified Capabilities

- `static-site-generation` : le pipeline de build doit appliquer la validation et la fusion de manifeste avant de générer les pages

## Impact

- `lib/data.js` : `readAgents()` et `readAgentDetail()` à modifier
- `example/.claude-plugin/marketplace.json` : mise à jour pour inclure `source` sur chaque entrée plugin
- Tests unitaires existants (si présents) sur `readAgents` à mettre à jour
