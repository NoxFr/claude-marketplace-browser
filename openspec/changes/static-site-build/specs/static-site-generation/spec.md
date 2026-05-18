## ADDED Requirements

### Requirement: Génération du site statique via CLI
Le script SHALL accepter un chemin de marketplace en argument et générer un dossier `dist/` contenant le site statique complet.

#### Scenario: Build avec marketplace valide
- **WHEN** `node scripts/build.js <path>` est exécuté avec un marketplace valide
- **THEN** un dossier `dist/` est créé avec `index.html`, `styles.css`, `search.js` et un dossier `agents/` contenant une sous-page par plugin

#### Scenario: Utilisation via npx
- **WHEN** `npx claude-marketplace-browser <path>` est exécuté depuis n'importe quel répertoire
- **THEN** le build génère `dist/` dans le répertoire courant, identique à l'exécution directe du script

#### Scenario: Marketplace sans plugins
- **WHEN** `marketplace.json` ne contient aucun plugin valide
- **THEN** `dist/index.html` est généré avec le message "Aucun plugin disponible dans ce marketplace" et aucun dossier `agents/` n'est créé

### Requirement: Structure du dossier dist/
Le dossier `dist/` généré SHALL contenir une page d'index, une page de détail par plugin, et les assets statiques.

#### Scenario: Structure complète générée
- **WHEN** le build se termine avec succès
- **THEN** `dist/` contient `index.html`, `styles.css`, `search.js`, et `agents/{nom-plugin}/index.html` pour chaque plugin

#### Scenario: Pages de détail accessibles sans serveur
- **WHEN** `dist/agents/{nom}/index.html` est ouvert dans un navigateur (via un serveur HTTP statique)
- **THEN** la page de détail du plugin s'affiche avec son README et ses composants

### Requirement: Attributs data-* sur les cartes pour le filtrage
Chaque carte de plugin dans `dist/index.html` SHALL porter des attributs `data-*` encodant les métadonnées nécessaires au filtrage client-side.

#### Scenario: Attributs présents sur chaque carte
- **WHEN** `dist/index.html` est généré
- **THEN** chaque `<div class="card">` (ou élément équivalent) contient `data-name`, `data-description`, `data-category`, et un `data-type-*` par type de composant déclaré (ex: `data-type-skills`, `data-type-mcp-servers`)

#### Scenario: Valeurs normalisées en minuscules
- **WHEN** le build génère les attributs `data-name` et `data-description`
- **THEN** les valeurs sont en minuscules pour permettre une comparaison case-insensitive sans transformation à l'exécution
