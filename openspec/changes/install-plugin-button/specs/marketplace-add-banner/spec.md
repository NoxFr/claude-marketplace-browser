## ADDED Requirements

### Requirement: Bannière "Add this marketplace" sur la page liste
La page liste SHALL afficher une bannière indiquant la commande `claude plugin marketplace add <source>` pour permettre à un utilisateur d'ajouter ce marketplace à son Claude Code. La bannière SHALL être affichée sous le titre, avant la barre de recherche.

#### Scenario: Source configurée via MARKETPLACE_URL
- **WHEN** la variable d'environnement `MARKETPLACE_URL` ou l'option `--marketplace-url` est définie avec une URL git
- **THEN** la bannière affiche `claude plugin marketplace add <url>` avec l'URL réelle

#### Scenario: Source non configurée
- **WHEN** aucune URL de source n'est configurée
- **THEN** la bannière affiche `claude plugin marketplace add <path-or-url>` avec un placeholder indiquant que la source doit être renseignée

### Requirement: Copie de la commande add marketplace dans le presse-papier
Au clic sur le bouton de copie de la bannière, le système SHALL copier la commande `claude plugin marketplace add <source>` via `navigator.clipboard.writeText()` avec fallback `document.execCommand('copy')`.

#### Scenario: Copie de la commande add marketplace
- **WHEN** l'utilisateur clique sur le bouton de copie dans la bannière
- **THEN** la commande complète est copiée dans le presse-papier et un feedback visuel confirme l'action pendant 1500ms
