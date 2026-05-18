## Context

Le marketplace privé Claude est un dépôt git contenant des agents sous `agents/<nom>/agent.yaml` + `README.md`. L'app (`browser/`) vit dans ce repo. Elle doit refléter l'état courant du repo à chaque requête, sans rebuild. L'utilisateur lance `node server.js` et accède à `http://localhost:3000`.

## Goals / Non-Goals

**Goals:**
- Lecture temps réel du filesystem (chaque requête HTTP relit les fichiers)
- Démarrage en une commande : `node server.js`
- Interface HTMX pure : le serveur génère et sert des fragments HTML
- Compatible déploiement dans le repo (dossier `browser/`) ou comme submodule

**Non-Goals:**
- Build step, bundler, transpileur
- Framework JS frontend (React, Vue…)
- Base de données ou cache persistant
- Authentification (accès contrôlé par git/réseau)
- Déploiement cloud / multi-tenant

## Decisions

### Architecture : serveur Node.js HTTP natif + HTMX

Un seul fichier `server.js` (CommonJS, Node.js HTTP natif) avec `js-yaml` comme unique dépendance. Le serveur lit le filesystem à chaque requête — suffisant pour un usage interne sur un repo local.
- Alternative considérée : Express — surcharge inutile, Node HTTP natif couvre les 4 routes nécessaires.
- Alternative considérée : Deno/Bun — moins universel, Node est partout.

### Rendu : HTML généré server-side, fragments HTMX

Le serveur retourne :
- `GET /` → page complète avec liste de toutes les cartes (HTML)
- `GET /agents/:nom` → page de détail (HTML)
- `GET /search?q=&category=` → fragment HTML des cartes filtrées (pour HTMX hx-get)

HTMX sur le frontend : `hx-get="/search"` + `hx-trigger="input delay:200ms"` pour la recherche live. Navigation entre pages via liens `<a>` normaux + `hx-boost`.

### Convention marketplace.json
```
<marketplace-root>/
  .claude-plugin/
    marketplace.json    # name, owner, plugins[]
```

Chaque plugin entry peut déclarer ses composants via les champs : `skills`, `commands`, `agents`, `hooks`, `mcpServers`, `lspServers`. Ces champs servent à détecter les types affichés comme étiquettes sur les cartes.

Un répertoire `example/.claude-plugin/marketplace.json` est embarqué dans le projet comme données de démonstration, couvrant tous les types de composants.

### Chemin marketplace : configurable via variable d'env ou argument CLI
`MARKETPLACE_PATH` (défaut : `./example` relatif au dossier du serveur). Peut être surchargé via `--marketplace /path/to/repo` en argument CLI. Permet de pointer vers n'importe quel repo marketplace local sans modifier le code.

### Détection des types de composants
Les types sont lus exclusivement depuis `marketplace.json`. Pour chaque plugin entry :
- `skills` présent → label `Skill`
- `commands` présent → label `Command`
- `agents` présent → label `Agent`
- `hooks` présent → label `Hook`
- `mcpServers` présent → label `MCP`
- `lspServers` présent → label `LSP`
- aucun champ → label neutre `Plugin`

### Markdown → HTML : lib `marked`
`marked` est la lib Node standard, légère, sans dépendance. Utilisée uniquement pour le README dans la page de détail.

### CSS : une feuille CSS inline minimale dans le layout
Pas de framework CSS. ~100 lignes de CSS custom pour rendre l'interface lisible.

### Footer
Footer fixe dans `layout()` : "Made with love by Mathieu Durand ❤️"

## Risks / Trade-offs

- [Performance] Lecture filesystem à chaque requête → acceptable pour un usage interne (< 100 agents, requêtes rares)
- [HTMX CDN] Dépendance réseau pour HTMX → Mitigation : option de fallback local (`vendor/htmx.min.js` si CDN injoignable)
- [Markdown XSS] Rendu HTML depuis README non maîtrisés → Mitigation : `marked` avec sanitization activée
