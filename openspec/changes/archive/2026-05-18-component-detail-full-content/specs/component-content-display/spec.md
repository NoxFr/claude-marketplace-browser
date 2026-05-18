## ADDED Requirements

### Requirement: Affichage du contenu des composants sur la page de détail
La page de détail d'un plugin SHALL afficher le contenu de chaque composant déclaré (skills, agents, commands, hooks, mcpServers, lspServers) en lisant les fichiers sources correspondants depuis le répertoire du plugin.

#### Scenario: Plugin avec un skill déclaré dont le fichier existe
- **WHEN** l'utilisateur accède à la page de détail d'un plugin ayant `"skills": ["java-backend"]`
- **THEN** la page affiche le contenu du fichier `.claude/skills/java-backend.md` du plugin dans une section intitulée "java-backend"

#### Scenario: Composant déclaré mais fichier absent
- **WHEN** un skill est listé dans `marketplace.json` mais le fichier `.claude/skills/<name>.md` est introuvable dans le répertoire du plugin
- **THEN** ce composant n'est pas affiché (skip silencieux, pas d'erreur)

#### Scenario: Plusieurs composants de types différents
- **WHEN** un plugin déclare des skills ET des agents
- **THEN** chaque type est regroupé dans une section distincte avec son label (Skills, Agents, etc.)

### Requirement: Rendu du contenu des composants
Les fichiers `.md` des composants SHALL être rendus en HTML via marked. Les autres formats SHALL être affichés en texte brut dans un bloc `<pre>`.

#### Scenario: Fichier markdown d'un skill
- **WHEN** le contenu d'un skill est affiché
- **THEN** le markdown est rendu en HTML (titres, listes, code blocks, etc.)

### Requirement: Sections dépliables pour les composants
Chaque composant SHALL être affiché dans un élément `<details>/<summary>` HTML natif, ouvert par défaut au chargement de la page.

#### Scenario: Composant affiché par défaut ouvert
- **WHEN** la page de détail charge avec des composants
- **THEN** chaque section composant est ouverte (expanded) par défaut, le contenu est visible immédiatement

#### Scenario: Repliage d'un composant
- **WHEN** l'utilisateur clique sur le nom d'un composant ouvert
- **THEN** le contenu se replie sans rechargement de page
