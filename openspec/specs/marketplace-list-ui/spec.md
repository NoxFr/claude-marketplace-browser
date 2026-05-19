## ADDED Requirements

### Requirement: Header fixe avec logo et navigation
La page liste SHALL afficher un header fixe en haut de page avec le logo "Registry" (icône terminal + texte) et une navigation horizontale sur desktop.

#### Scenario: Header visible au scroll
- **WHEN** l'utilisateur scrolle la page liste
- **THEN** le header reste fixe en haut avec `bg-surface` et une bordure basse `border-outline-variant`

### Requirement: Sidebar de navigation desktop
La page liste SHALL afficher une sidebar fixe à gauche sur desktop (≥1024px) avec les entrées : Explore (actif), Agents, MCP Servers, Documentation.

#### Scenario: Sidebar visible sur grand écran
- **WHEN** la page est affichée sur un écran ≥1024px
- **THEN** une sidebar de 256px est visible à gauche avec l'entrée "Explore" mise en avant (`bg-secondary-container`)

#### Scenario: Sidebar masquée sur mobile
- **WHEN** la page est affichée sur un écran <1024px
- **THEN** la sidebar est masquée (`hidden lg:flex`)

### Requirement: Hero section avec titre et barre de recherche modernisée
La section principale SHALL afficher un titre "Plugin Marketplace", une description, et une barre de recherche dans un conteneur `bg-slate-900` avec input et select stylisés JetBrains Mono.

#### Scenario: Barre de recherche fonctionnelle htmx
- **WHEN** l'utilisateur tape dans le champ de recherche
- **THEN** la grille se met à jour via htmx (`hx-get="/search"`) avec un délai de 200ms

#### Scenario: Focus sur l'input de recherche
- **WHEN** l'utilisateur clique sur le champ de recherche
- **THEN** la bordure passe à `border-vibrant-blue` avec un ring `focus:ring-2 focus:ring-vibrant-blue/20`

### Requirement: Cards de plugins remaniées (dark + icône)
Chaque card SHALL afficher : une icône Material Symbols dans un container `bg-slate-900`, la version en `font-code-sm`, le titre en `font-headline-md`, la description sur 2 lignes max (`line-clamp-2`), l'auteur en `text-slate-400 text-sm` si disponible, et les badges en bas.

#### Scenario: Hover sur une card
- **WHEN** l'utilisateur survole une card
- **THEN** la bordure passe à `border-vibrant-blue` et le titre passe en `text-vibrant-blue`

#### Scenario: Affichage des badges de type
- **WHEN** un plugin a des composants déclarés (skills, mcpServers, etc.)
- **THEN** chaque type affiché avec border colorée et background teinté (`border-mcp-label bg-mcp-label/10 text-mcp-label` pour MCP, etc.)

#### Scenario: Affichage de l'auteur sur la card
- **WHEN** un plugin déclare un champ `author`
- **THEN** la card affiche le nom de l'auteur sous la description en `text-slate-400 text-sm`

#### Scenario: Absence de l'auteur sur la card
- **WHEN** un plugin ne déclare pas de champ `author`
- **THEN** aucune ligne d'auteur n'est affichée sur la card

### Requirement: Grille responsive 1/2/3 colonnes
La grille SHALL être responsive : 1 colonne mobile, 2 colonnes tablette (md), 3 colonnes desktop (xl).

#### Scenario: Adaptation de la grille selon la taille d'écran
- **WHEN** la page est affichée à différentes largeurs
- **THEN** la grille s'adapte (`grid-cols-1 md:grid-cols-2 xl:grid-cols-3`)
