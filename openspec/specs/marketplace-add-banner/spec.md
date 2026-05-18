# marketplace-add-banner Specification

## Purpose
Afficher sur la page liste une bannière permettant à l'utilisateur d'ajouter ce marketplace à Claude Code et de mettre à jour ses plugins.

## Requirements
### Requirement: Bannière "Add this marketplace" sur la page liste
La page liste SHALL afficher une bannière avec deux lignes de commande :
1. `claude plugin marketplace add <source>` — pour ajouter le marketplace à Claude Code
2. `claude plugin marketplace update` — pour mettre à jour les plugins depuis ce marketplace

La bannière SHALL être affichée sous le titre, avant la barre de recherche.

#### Scenario: Source configurée via MARKETPLACE_URL
- **WHEN** la variable d'environnement `MARKETPLACE_URL` ou l'option `--marketplace-url` est définie avec une URL git
- **THEN** la bannière affiche `claude plugin marketplace add <url>` avec l'URL réelle

#### Scenario: Source non configurée
- **WHEN** aucune URL de source n'est configurée
- **THEN** la bannière affiche `claude plugin marketplace add <path-or-url>` avec un placeholder indiquant que la source doit être renseignée

### Requirement: Ligne "Update plugins" dans la bannière
La bannière SHALL afficher une seconde ligne avec la commande `claude plugin marketplace update` accompagnée d'un bouton de copie, indépendamment de la configuration de la source.

### Requirement: Copie de la commande add marketplace dans le presse-papier
Au clic sur le bouton de copie de chaque ligne, le système SHALL copier la commande correspondante via `navigator.clipboard.writeText()` avec fallback `document.execCommand('copy')`.

#### Scenario: Copie de la commande add marketplace
- **WHEN** l'utilisateur clique sur le bouton de copie de la ligne "add"
- **THEN** la commande `claude plugin marketplace add <source>` est copiée dans le presse-papier et un feedback visuel confirme l'action pendant 1500ms

#### Scenario: Copie de la commande update
- **WHEN** l'utilisateur clique sur le bouton de copie de la ligne "update"
- **THEN** la commande `claude plugin marketplace update` est copiée dans le presse-papier et un feedback visuel confirme l'action pendant 1500ms

