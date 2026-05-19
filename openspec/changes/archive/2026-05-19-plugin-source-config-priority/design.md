## Context

Le build lit `marketplace.json` via `lib/data.js` (`readAgents`, `readAgentDetail`). Actuellement :
- `name` est le seul champ validé (warning + skip si absent)
- `source` est optionnel ; quand présent, il sert de chemin vers le dossier du plugin pour lire ses fichiers (README, skills, etc.) mais les métadonnées viennent toujours exclusivement de `marketplace.json`
- Aucune lecture de `plugin.json` côté plugin n'est effectuée

Le schéma officiel du manifeste plugin Claude Code (`.claude-plugin/plugin.json`) définit `name` comme seul champ requis et expose des champs de métadonnées (`description`, `version`, `author`, `keywords`, etc.) ainsi que des champs de composants (`skills`, `agents`, `mcpServers`, `lspServers`, `hooks`, `commands`).

## Goals / Non-Goals

**Goals:**
- Rendre `name` et `source` obligatoires dans chaque entrée plugin de `marketplace.json`
- Quand `source` est un chemin relatif, lire `.claude-plugin/plugin.json` dans ce dossier et fusionner ses champs avec priorité sur `marketplace.json`
- Conserver le comportement actuel pour les `source` non-relatifs (URL, chemin absolu)

**Non-Goals:**
- Validation JSON Schema complète de `plugin.json` (hors scope)
- Résolution de dépendances inter-plugins
- Support des `source` distants (fetch HTTP) dans cette itération

## Decisions

### D1 — `source` obligatoire plutôt qu'optionnel

**Choix** : `source` devient requis.

**Rationale** : Sans `source`, il est impossible de savoir où réside le plugin, rendant la fusion de manifeste inapplicable. Rendre le champ obligatoire force une déclaration explicite et lève toute ambiguïté sur le répertoire de résolution des composants.

**Alternative** : conserver `source` optionnel et utiliser `name` comme chemin par défaut. Rejeté car cela crée une convention implicite fragile incompatible avec l'objectif de clarté.

### D2 — Fusion par écrasement simple (plugin.json gagne)

**Choix** : les champs présents dans `plugin.json` écrasent les champs correspondants de l'entrée `marketplace.json`. Les champs absents de `plugin.json` sont conservés depuis `marketplace.json`.

**Rationale** : le plugin est la source de vérité pour ses propres métadonnées. `marketplace.json` peut enrichir ou surcharger uniquement ce que le plugin ne déclare pas.

**Alternative** : fusion sélective par liste blanche de champs. Rejeté car trop rigide face à l'évolution du schéma.

### D3 — Détection chemin relatif par préfixe `.`

**Choix** : un `source` est considéré local si `value.startsWith('.')`.

**Rationale** : cohérent avec la fonction `isPath()` déjà présente dans `lib/data.js` et avec la convention Node.js / CommonJS.

## Risks / Trade-offs

- **Breaking change sur `source`** → les marketplaces existantes sans `source` émettent un warning et voient leurs entrées ignorées. Mitigation : documenter clairement dans le CHANGELOG et fournir un exemple mis à jour.
- **Conflit de champs de composants** (ex. `skills` dans marketplace.json ET dans plugin.json) → la priorité locale peut surprendre les mainteneurs de marketplace. Mitigation : logguer un avertissement explicite quand une fusion de composants a lieu.
- **`plugin.json` absent dans le dossier `source`** → non bloquant ; on revient silencieusement aux données de marketplace.json. Mitigation : log info pour faciliter le débogage.
