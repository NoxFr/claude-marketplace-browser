## MODIFIED Requirements

### Requirement: Génération du site statique via CLI
Le script SHALL accepter un chemin de marketplace en argument et générer un dossier `dist/` contenant le site statique complet. Les plugins sans `name` ou `source` valides SHALL être ignorés lors de la génération.

#### Scenario: Build avec marketplace valide
- **WHEN** `node scripts/build.js <path>` est exécuté avec un marketplace valide
- **THEN** un dossier `dist/` est créé avec `index.html`, `styles.css`, `search.js` et un dossier `agents/` contenant une sous-page par plugin valide

#### Scenario: Utilisation via npx
- **WHEN** `npx claude-marketplace-browser <path>` est exécuté depuis n'importe quel répertoire
- **THEN** le build génère `dist/` dans le répertoire courant, identique à l'exécution directe du script

#### Scenario: Marketplace sans plugins valides
- **WHEN** `marketplace.json` ne contient aucun plugin avec `name` et `source` valides
- **THEN** `dist/index.html` est généré avec le message "Aucun plugin disponible dans ce marketplace" et aucun dossier `agents/` n'est créé

#### Scenario: Plugins locaux avec manifeste fusionné
- **WHEN** un plugin a un `source` relatif et un `plugin.json` local avec des champs de métadonnées
- **THEN** les pages générées (`dist/index.html` et `dist/agents/<name>/index.html`) reflètent les valeurs du manifeste local
