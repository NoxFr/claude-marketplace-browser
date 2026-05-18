## MODIFIED Requirements

### Requirement: Hero section avec badge de type, version et bouton install
La page détail SHALL afficher en haut : le badge de type primaire, la version en `font-code-sm`, le titre en `font-headline-lg text-primary`, la description, et un bouton "Install Plugin" fonctionnel. Au clic, ce bouton copie la commande `claude plugin install <plugin-name>@<marketplace-slug>` dans le presse-papier et affiche un feedback visuel. Le bouton SHALL porter un attribut `data-command` contenant la commande pré-calculée côté serveur.

#### Scenario: Badge de type affiché dans le hero
- **WHEN** un plugin avec des composants est affiché
- **THEN** le premier type de composant est affiché comme badge dans le hero (ex: "MCP SERVER", "SKILL")

#### Scenario: Bouton Install Plugin fonctionnel
- **WHEN** l'utilisateur clique sur le bouton "Install Plugin"
- **THEN** la commande `claude plugin install <plugin-name>@<marketplace-slug>` est copiée dans le presse-papier et un feedback visuel confirme l'action pendant 1500ms
