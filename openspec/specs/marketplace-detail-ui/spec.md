## Purpose

Page de détail d'un plugin du marketplace : affiche le hero avec badge, version, bouton "Install Plugin" fonctionnel, les métadonnées, le README et les composants en accordéons dépliables.

## Requirements

### Requirement: Layout centré max-800px pour la page détail
La page détail SHALL utiliser un layout centré avec `max-width: 800px` dans le contenu principal, avec `lg:pl-64` pour tenir compte de la sidebar.

#### Scenario: Contenu bien cadré sur grand écran
- **WHEN** la page détail est affichée sur un écran large
- **THEN** le contenu est centré et ne dépasse pas 800px de large

### Requirement: Hero section avec badge de type, version et bouton install
La page détail SHALL afficher en haut : le badge de type primaire, la version en `font-code-sm`, le titre en `font-headline-lg text-primary`, la description, et un bouton "Install Plugin" fonctionnel. Au clic, ce bouton copie la commande `claude plugin install <plugin-name>@<marketplace-slug>` dans le presse-papier et affiche un feedback visuel. Le bouton SHALL porter un attribut `data-command` contenant la commande pré-calculée côté serveur.

#### Scenario: Badge de type affiché dans le hero
- **WHEN** un plugin avec des composants est affiché
- **THEN** le premier type de composant est affiché comme badge dans le hero (ex: "MCP SERVER", "SKILL")

#### Scenario: Bouton Install Plugin fonctionnel
- **WHEN** l'utilisateur clique sur le bouton "Install Plugin"
- **THEN** la commande `claude plugin install <plugin-name>@<marketplace-slug>` est copiée dans le presse-papier et un feedback visuel confirme l'action pendant 1500ms

### Requirement: Metadata grid 4 colonnes
La page détail SHALL afficher une grille de métadonnées (`grid-cols-2 md:grid-cols-4`) avec les champs disponibles parmi : Category, Author, License, Updated — en affichant uniquement les champs disponibles dans les données du plugin. Le champ Author SHALL afficher la valeur du champ `author` du plugin lorsqu'il est présent.

#### Scenario: Affichage des métadonnées disponibles
- **WHEN** un plugin avec `category` est affiché
- **THEN** la metadata grid affiche au minimum la catégorie avec le style `font-label-caps text-slate-400` pour le label

#### Scenario: Affichage de l'auteur dans la metadata grid
- **WHEN** un plugin déclare un champ `author`
- **THEN** la metadata grid affiche une cellule "Author" avec la valeur du champ `author`

#### Scenario: Absence de l'auteur dans la metadata grid
- **WHEN** un plugin ne déclare pas de champ `author`
- **THEN** la cellule "Author" n'est pas affichée dans la metadata grid

### Requirement: README dans un conteneur dark stylisé
Le contenu README/SKILL.md SHALL être affiché dans un conteneur `bg-slate-900 border border-slate-700 rounded-xl` avec le markdown rendu.

#### Scenario: Code blocks dans le README
- **WHEN** le README contient des blocs de code
- **THEN** ils sont affichés avec `bg-black font-code-sm` et une bordure `border-slate-800`

### Requirement: Accordéons de composants remaniés
Les sections de composants SHALL utiliser `<details>` avec summary redesigné : icône Material Symbols colorée par type, nom du composant en bold, badge de type, et chevron animé (`chevron-icon transition-transform`).

#### Scenario: Ouverture d'un accordéon
- **WHEN** l'utilisateur clique sur le summary d'un composant
- **THEN** le chevron pivote à 180° et le contenu s'affiche dans un `bg-slate-900 border-t border-slate-700`

#### Scenario: Fermeture d'un accordéon
- **WHEN** l'utilisateur clique à nouveau sur le summary
- **THEN** le contenu se masque et le chevron revient à 0°

### Requirement: Lien retour stylisé
La page détail SHALL afficher un lien "Back to list" / "← Retour" en `text-slate-400 hover:text-vibrant-blue` avec une icône `arrow_back`.

#### Scenario: Navigation retour
- **WHEN** l'utilisateur clique sur le lien retour
- **THEN** il est redirigé vers la page liste (`/` ou `../index.html` en mode statique)
