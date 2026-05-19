## MODIFIED Requirements

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
