## Context

Le browser est actuellement un serveur Node.js (`server.js`) qui lit les données du marketplace à chaque requête et génère le HTML à la volée. La recherche repose sur HTMX qui appelle `GET /search` pour obtenir un fragment HTML partiel.

L'objectif est de pouvoir générer un site entièrement statique déployable sur GitHub Pages ou GitLab Pages via `npx claude-marketplace-browser <path>`, sans modifier la logique de rendu existante.

## Goals / Non-Goals

**Goals:**
- Script de build qui génère `dist/` complet depuis un marketplace path
- Recherche/filtrage client-side sans serveur ni dépendances externes
- Entrée CLI via `npx` (`bin` dans `package.json`)
- `server.js` continue de fonctionner pour le mode dev local
- README mis à jour avec exemples de déploiement

**Non-Goals:**
- Support `--base-url` (le site est toujours servi à la racine)
- Pagination ou chargement différé des plugins
- Build incrémental (rebuild complet à chaque fois)
- Publication npm automatisée

## Decisions

### D1 — Réutiliser `lib/render/*.js` sans modification

Le build script appelle les mêmes fonctions que `server.js` (`renderListPage`, `renderDetailPage`, etc.) et écrit le résultat dans des fichiers. Aucune duplication de logique de rendu.

*Alternative rejetée* : Nouveau moteur de templates côté build — crée une divergence entre mode dev et mode static, maintenance double.

### D2 — Show/hide avec `data-*` attributes plutôt que re-render JS

Les cards sont pré-rendues au build avec des attributs `data-name`, `data-description`, `data-category`, `data-type-*`. Le JS client manipule uniquement `classList.toggle('hidden')`.

*Alternative rejetée* : Charger `plugins.json` et re-render les cards en JS — duplique la logique de template entre Node.js et browser, couplage fort.

*Avantage* : Progressive enhancement gratuit (sans JS → tous les plugins visibles), zéro fetch, rendu instantané.

### D3 — Architecture SOLID pour `search.js`

Quatre responsabilités séparées, ~70 lignes vanilla ES2020, aucune dépendance :

```
FilterState     ← value object immutable {q, category, type}
CardMatcher     ← pure function (dataset, state) → boolean
DOMUpdater      ← manipulation classList uniquement
SearchController ← wire inputs → state → DOM, debounce 150ms
```

Strings normalisées une fois au chargement de la page (pas à chaque frappe).

*Alternative rejetée* : Tout en un seul event listener inline — non testable, non extensible.

### D4 — Suppression complète de HTMX

HTMX n'a plus de raison d'être en mode static. Le fichier `vendor/htmx.min.js` et la route de serve associée sont supprimés. Le layout charge `search.js` à la place.

En mode dev (`server.js`), la recherche sera également portée en client-side — comportement identique dans les deux modes.

### D5 — Structure `dist/` avec `agents/{name}/index.html`

```
dist/
  index.html
  agents/
    {name}/
      index.html
  styles.css
  search.js
```

Les liens `href="/agents/{name}"` fonctionnent car le site est toujours servi à la racine. Les pages détail sont des fichiers statiques avec navigation identique au mode serveur.

## Risks / Trade-offs

| Risque | Mitigation |
|---|---|
| `index.html` volumineux si beaucoup de plugins | Acceptable pour des marketplaces typiques (~100 plugins max). Pas de lazy loading prévu. |
| Noms de plugins avec caractères spéciaux dans les paths | Utiliser `encodeURIComponent` dans le build pour les chemins de dossiers, identique à ce que fait `server.js` |
| Divergence mode dev / mode static si `server.js` n'est pas mis à jour | En supprimant HTMX dans les templates, les deux modes utilisent `search.js` — pas de divergence |

## Migration Plan

1. Créer `public/search.js`
2. Modifier `lib/render/page-list.js` — ajouter `data-*` sur les cards, supprimer `hx-*`
3. Modifier `lib/render/layout.js` — remplacer HTMX par `search.js`
4. Créer `scripts/build.js`
5. Mettre à jour `package.json` (bin + suppression vendor script si nécessaire)
6. Supprimer `vendor/htmx.min.js`
7. Mettre à jour `README.md`

Rollback : `server.js` n'est pas modifié, le mode dev reste fonctionnel à tout moment.
