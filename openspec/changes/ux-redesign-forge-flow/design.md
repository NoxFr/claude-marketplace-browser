## Context

Le marketplace browser est un serveur Node.js vanilla qui génère du HTML server-side via des fonctions de rendu dans `lib/render/`. Le CSS est actuellement dans `public/styles.css` (extrait récemment). Les wireframes "Forge & Flow" définissent un design system complet basé sur Tailwind CSS avec des tokens précis (couleurs, typographie, spacing). L'objectif est de faire passer l'UI de "CSS custom light" à "Tailwind dark IDE".

## Goals / Non-Goals

**Goals:**
- Appliquer fidèlement le design system "Forge & Flow" (couleurs, typo, spacing) depuis les wireframes
- Remplacer le CSS custom par Tailwind CSS (config inline via CDN)
- Faire évoluer chaque composant render (`layout`, `card`, `badge`, `page-list`, `page-detail`) vers le nouveau markup
- Conserver le comportement htmx existant (hx-boost, search AJAX)
- Mettre à jour le build statique pour que les pages générées soient fonctionnelles offline (polices, icônes)

**Non-Goals:**
- Installer Tailwind en tant que dépendance npm / pipeline de build (CDN suffit)
- Ajouter la sidebar navigation fonctionnelle (les liens Agents, MCP Servers, Documentation ne sont pas routés)
- Ajouter le bouton FAB "+" ou la section "Developer Spotlight" du wireframe liste (hors scope MVP)
- Changer le comportement serveur ou les routes

## Decisions

### Tailwind via CDN + config inline
Le projet n'a pas de pipeline de build frontend. Tailwind CDN avec `<script id="tailwind-config">` suffit pour embarquer les tokens du design system sans ajouter de dépendances npm.  
Alternative rejetée : compiler Tailwind en standalone — overhead de setup pour un projet sans bundler.

### Conserver `public/styles.css` pour les overrides ciblés
Tailwind ne couvre pas tout (ex: `details > summary::-webkit-details-marker`, animations `ping` status). Un fichier CSS résiduel minimal reste utile.  
Ce fichier sera réduit à ~10 lignes d'overrides non-couverts par Tailwind.

### Markup des composants : réécriture complète du HTML
Le passage de `.card { border-radius: 12px }` aux classes Tailwind `rounded-lg bg-slate-800 border border-slate-700` impose une réécriture du HTML dans chaque render function. Pas de migration progressive possible.

### Material Symbols : via CDN Google Fonts
Les icônes sont référencées par nom dans le HTML (`<span class="material-symbols-outlined">terminal</span>`). Pas de SVG inline, pas de sprite — cohérent avec l'approche CDN.  
Fallback offline : le build statique peut inclure un warning si les polices CDN sont absentes.

### La sidebar n'est pas fonctionnelle (décoration)
Les wireframes montrent une sidebar desktop avec Explore / Agents / MCP Servers / Documentation. Ces liens n'ont pas de routes correspondantes. La sidebar sera rendue en HTML mais les liens non-Explore pointeront vers `#` (placeholder). Pas de regression, le comportement actuel n'a pas non plus ces routes.

## Risks / Trade-offs

- **Tailwind CDN en prod** → lent au premier chargement (parse + JIT complet) ; acceptable pour un outil dev local
- **Polices Google Fonts** → ne fonctionnent pas offline ; le build statique GitLab Pages nécessite une connexion ou un preload ; risque faible car contexte dev
- **Réécriture complète du markup** → risque de régression sur le comportement htmx (hx-target, hx-include) ; mitigation : tester manuellement `/search` AJAX après chaque page modifiée
- **`slate-750` n'existe pas dans Tailwind** → les wireframes utilisent `hover:bg-slate-750` qui n'est pas un token standard ; on utilisera `hover:bg-slate-700/80` comme approximation

## Migration Plan

1. Mettre à jour `lib/render/layout.js` : nouvelle structure HTML (Tailwind config, fonts, header fixe, sidebar, footer)
2. Mettre à jour `lib/render/badge.js` : nouveau style des badges (border + bg teinté)
3. Mettre à jour `lib/render/card.js` : markup card avec icône Material Symbols
4. Mettre à jour `lib/render/page-list.js` : hero section + control bar + grille
5. Mettre à jour `lib/render/page-detail.js` : layout centré + metadata grid + accordéons
6. Réduire `public/styles.css` aux overrides Tailwind uniquement
7. Rebuild statique et vérification visuelle des 9 pages
8. Rollback : `git revert` — toutes les modifications sont dans `lib/render/` et `public/styles.css`

## Open Questions

- L'icône par type de plugin dans la card (ex: `database` pour MCP, `bolt` pour Skill) : doit-elle être générique ou mappée par type ? → Pour l'instant : mapping par type de badge (premier badge = icône).
- La config Tailwind est dupliquée dans chaque page HTML générée : acceptable ou faut-il externaliser en fichier JS ? → Acceptable pour l'instant (généré côté serveur, même source).
