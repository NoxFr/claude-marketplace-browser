## Why

L'interface actuelle du marketplace utilise un thème clair générique avec des polices système et un CSS custom minimal. Les wireframes "Forge & Flow" définissent une identité visuelle dark-mode, orientée développeurs, avec un design system complet (typographie, couleurs, composants). Cette refonte aligne l'UI avec l'audience cible et améliore significativement la lisibilité et la cohérence visuelle.

## What Changes

- Remplacement du thème clair par un dark mode (background `slate-900 / #0b1326`)
- Intégration de Tailwind CSS (CDN) en remplacement du CSS custom inline
- Nouvelles polices : Hanken Grotesk (headlines), Inter (body), JetBrains Mono (labels/code) via Google Fonts
- Icônes Material Symbols Outlined pour le header, la navigation et les composants
- Refonte de la page liste : header fixe, sidebar desktop, hero section, cards remaniées (icône + titre + description + badges), barre de recherche modernisée
- Refonte de la page détail : layout centré max-800px, metadata grid, sections composants accordéon remaniées
- Badges de composants : style `border + bg teinté` (pink pour Skill, purple pour MCP, blue pour Agent…)
- Banner démo : glassmorphism avec `backdrop-blur`
- Footer remanié avec liens et identité visuelle
- Mise à jour du build statique pour propager les nouvelles dépendances (fonts, Tailwind, icons)

## Capabilities

### New Capabilities

- `dark-theme-design-system`: Palette de couleurs, typographie et tokens de spacing du design system "Forge & Flow"
- `marketplace-list-ui`: Page liste avec header fixe, sidebar, hero, grille de cards et barre de recherche
- `marketplace-detail-ui`: Page détail avec hero plugin, metadata grid, README et accordéons de composants

### Modified Capabilities

- `gitlab-pages-deployment`: Le build statique doit inclure les ressources externes (polices, Tailwind CDN) — ou prévoir un fallback si offline

## Impact

- `public/styles.css` : remplacé par des classes Tailwind (le fichier peut être réduit à quelques overrides ciblés)
- `lib/render/layout.js` : nouvelle structure HTML (header fixe, sidebar, script Tailwind)
- `lib/render/card.js` : markup card entièrement revu
- `lib/render/badge.js` : nouveau style des badges
- `lib/render/page-list.js` : hero section, control bar, grille
- `lib/render/page-detail.js` : layout centré, metadata grid, accordéons remaniés
- `scripts/build-static.js` : réécriture des liens Tailwind CDN / Google Fonts si besoin pour static
- Dépendances ajoutées : Tailwind CSS CDN, Google Fonts, Material Symbols (CDN)
