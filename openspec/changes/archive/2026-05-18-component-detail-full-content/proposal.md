## Why

La page de détail d'un plugin affiche uniquement les métadonnées et le README, mais pas le contenu réel des composants (skills, agents, hooks, etc.). Les utilisateurs ne peuvent pas évaluer un skill sans voir son prompt complet, ce qui nuit à l'utilisabilité du marketplace.

## What Changes

- La page de détail affiche le contenu de chaque composant déclaré (skills, agents, commands, hooks, mcpServers, lspServers)
- Pour chaque composant, le fichier source correspondant est lu depuis le répertoire du plugin et affiché avec coloration syntaxique ou rendu markdown
- Les composants sont affichés dans des sections dépliables (accordion) pour garder la page lisible

## Capabilities

### New Capabilities
- `component-content-display`: Lecture et affichage du contenu des fichiers composants (`.claude/skills/<name>.md`, `.claude/agents/<name>.md`, etc.) dans la page de détail d'un plugin

### Modified Capabilities
- (aucune)

## Impact

- `server.js` : ajout de la logique de lecture des fichiers composants par type, et rendu HTML de leur contenu dans `renderDetailPage`
- Aucune dépendance externe supplémentaire (marked est déjà utilisé pour le rendu markdown)
