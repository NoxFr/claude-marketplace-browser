## Context

Le serveur `server.js` est un serveur HTTP Node.js sans framework. La page de détail d'un plugin est rendue par `renderDetailPage(agent, readmeHtml)`. Elle affiche les métadonnées et le README/SKILL.md du plugin, mais pas le contenu des composants individuels (skills, agents, hooks, etc.).

Les plugins référencent leurs composants dans `marketplace.json` via des tableaux de noms (ex: `"skills": ["java-backend"]`). Le contenu de ces composants est dans des fichiers du répertoire plugin, suivant les conventions Claude Code :
- Skills : `.claude/skills/<name>.md`
- Agents : `.claude/agents/<name>.md`
- Commands : `.claude/commands/<name>.md`
- Hooks : `.claude/hooks/<name>.md`
- MCP Servers : convention de nom variable (fichier de config JSON ou markdown)
- LSP Servers : convention de nom variable

## Goals / Non-Goals

**Goals:**
- Afficher le contenu textuel de chaque composant déclaré sur la page de détail
- Utiliser des sections accordéon (HTML natif `<details>/<summary>`) pour garder la page lisible
- Rendre les fichiers `.md` avec marked (déjà utilisé), afficher le reste en `<pre>`

**Non-Goals:**
- Modifier l'architecture du serveur ou introduire un framework
- Gérer des chemins de composants au-delà des conventions Claude Code standard
- Afficher des composants dont le fichier est absent (skip silencieux)

## Decisions

### Convention de chemins des fichiers composants

Chemin prioritaire : `MARKETPLACE_PATH/<pluginName>/.claude/<type>/<name>.md`

Fallback pour chaque type si le fichier .md n'existe pas : pas d'affichage (skip silencieux).

**Rationale** : La convention Claude Code place tous les assets dans `.claude/`. Appliquer cette convention directement est simple et cohérent avec l'écosystème.

### Rendu avec `<details>/<summary>` HTML natif

Pas de JS nécessaire, compat universelle navigateurs, zero dépendance.

**Alternative rejetée** : Accordion JS → complexité inutile pour un usage interne.

### Rendu markdown pour les .md, `<pre>` pour le reste

Marked est déjà présent dans le projet. Les skills/agents sont en markdown, c'est le format natif.

## Risks / Trade-offs

- [Convention de chemin incorrecte] → Si le marketplace cible utilise une structure différente, aucun composant ne s'affichera. Mitigation : afficher un message "fichier non trouvé" optionnel en développement.
- [Fichiers volumineux] → Un skill très long chargera tout en mémoire. Mitigation : acceptable pour un outil interne/dev.
