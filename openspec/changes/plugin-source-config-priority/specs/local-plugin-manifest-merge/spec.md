## ADDED Requirements

### Requirement: Fusion du manifeste local pour les sources relatives
Quand le champ `source` d'un plugin est un chemin relatif (commence par `.`), le système SHALL lire le fichier `.claude-plugin/plugin.json` dans ce dossier et fusionner ses champs dans la fiche plugin avec priorité sur les valeurs de `marketplace.json`.

#### Scenario: plugin.json local présent avec des métadonnées
- **WHEN** `source` est `./plugins/my-plugin` et que `./plugins/my-plugin/.claude-plugin/plugin.json` existe avec un champ `description`
- **THEN** la description utilisée pour le rendu est celle du `plugin.json` local, pas celle de `marketplace.json`

#### Scenario: plugin.json local présent avec des composants
- **WHEN** `source` est relatif et que `plugin.json` local déclare des champs de composants (`skills`, `agents`, `mcpServers`, etc.)
- **THEN** les composants du manifeste local écrasent ceux de `marketplace.json` et un avertissement `[marketplace] Local manifest overrides component fields for plugin <name>` est émis

#### Scenario: plugin.json absent dans le dossier source
- **WHEN** `source` est relatif mais qu'aucun `.claude-plugin/plugin.json` n'est trouvé dans ce dossier
- **THEN** la fiche plugin utilise exclusivement les données de `marketplace.json` sans erreur

#### Scenario: source non-relatif (URL ou chemin absolu)
- **WHEN** `source` est une URL (commence par `http`) ou un chemin absolu (commence par `/`)
- **THEN** aucune lecture de `plugin.json` local n'est effectuée et les données de `marketplace.json` sont utilisées telles quelles

### Requirement: Découverte automatique des composants par dossiers standards
Quand `source` est un chemin relatif, le système SHALL détecter la présence des dossiers standards (`skills/`, `agents/`, `commands/`, `hooks/`, `mcp/`, `lsp/`) dans le dossier plugin et SHALL les utiliser comme source de composants si ces dossiers ne sont pas déjà déclarés explicitement (ni dans `plugin.json` ni dans `marketplace.json`). Cette détection est complémentaire à la fusion du manifeste et reflète le comportement de Claude Code qui auto-découvre les composants dans les emplacements par défaut.

#### Scenario: Dossier skills/ présent sans déclaration explicite
- **WHEN** `source` est relatif, le dossier `./plugins/my-plugin/skills/` existe et aucune valeur `skills` n'est déclarée dans `plugin.json` ni `marketplace.json`
- **THEN** les skills sont lus depuis `skills/` et le plugin est rendu avec le label `Skills`

#### Scenario: Dossier agents/ présent mais agents déjà déclarés
- **WHEN** `source` est relatif, `agents/` existe ET des agents sont déclarés dans `plugin.json` ou `marketplace.json`
- **THEN** la déclaration explicite prévaut sur la découverte automatique ; le dossier auto-découvert est ignoré

#### Scenario: Aucun dossier standard présent et aucune déclaration
- **WHEN** `source` est relatif et aucun dossier standard n'est trouvé dans le dossier plugin
- **THEN** le plugin est rendu sans label de composant (label neutre `Plugin`)

#### Scenario: Dossiers standards détectés — dossiers vérifiés
- **WHEN** le système analyse un plugin avec `source` relatif
- **THEN** les dossiers vérifiés sont exactement : `skills/`, `agents/`, `commands/`, `hooks/`, `mcp/`, `lsp/`
