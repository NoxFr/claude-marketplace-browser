# install-command-generator Specification

## Purpose
TBD - created by archiving change install-plugin-button. Update Purpose after archive.
## Requirements
### Requirement: Génération de la commande d'installation d'un plugin
Le système SHALL générer la commande `claude plugin install <plugin-name>@<marketplace-slug>` où `<marketplace-slug>` est le champ `name` racine de `marketplace.json` slugifié (lowercase, caractères non-alphanumériques remplacés par des tirets).

#### Scenario: Commande générée pour un plugin avec marketplace nommé
- **WHEN** le plugin `"java-backend"` appartient à un marketplace nommé `"Claude Marketplace Example"`
- **THEN** la commande générée est `claude plugin install java-backend@claude-marketplace-example`

#### Scenario: Plugin sans composant déclaré
- **WHEN** le plugin ne déclare aucun composant mais a un nom
- **THEN** la commande générée est `claude plugin install <plugin-name>@<marketplace-slug>`

### Requirement: Copie de la commande install dans le presse-papier
Au clic sur le bouton "Install Plugin", le système SHALL copier la commande via `navigator.clipboard.writeText()` avec fallback `document.execCommand('copy')` si l'API n'est pas disponible.

#### Scenario: Copie réussie via Clipboard API
- **WHEN** l'utilisateur clique sur "Install Plugin" et `navigator.clipboard` est disponible
- **THEN** la commande est copiée dans le presse-papier sans erreur visible

#### Scenario: Copie via fallback execCommand
- **WHEN** `navigator.clipboard` n'est pas disponible (contexte non-HTTPS ou file://)
- **THEN** le système utilise `document.execCommand('copy')` comme fallback

### Requirement: Feedback visuel après copie réussie
Après copie, le bouton SHALL afficher l'icône `check` et le texte `Copied!` pendant 1500ms puis revenir à son état initial.

#### Scenario: Feedback temporaire sur le bouton Install Plugin
- **WHEN** la commande est copiée avec succès
- **THEN** l'icône devient `check` et le texte devient `Copied!` pendant 1500ms, puis l'icône revient à `download` et le texte à `Install Plugin`

