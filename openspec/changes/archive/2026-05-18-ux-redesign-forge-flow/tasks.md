## 1. Design system & layout

- [x] 1.1 Mettre à jour `lib/render/layout.js` : ajouter `<html class="dark">`, Tailwind CDN + config inline (tokens Forge & Flow), Google Fonts (Inter, Hanken Grotesk, JetBrains Mono, Material Symbols)
- [x] 1.2 Réécrire la structure HTML du `layout()` : header fixe (`fixed top-0 z-50 bg-surface border-b border-outline-variant`), sidebar desktop (`hidden lg:flex fixed left-0`), `<main class="pt-24 lg:pl-64">`, footer remanié
- [x] 1.3 Réduire `public/styles.css` aux seuls overrides non couverts par Tailwind (details marker, chevron animation, body min-height)

## 2. Composants badges et cards

- [x] 2.1 Réécrire `lib/render/badge.js` : nouveau style `px-2 py-0.5 border border-{color}/40 bg-{color}/10 text-{color} font-label-caps text-label-caps rounded` avec mapping couleur par type (mcp-label, skill-label, primary, status-warning…)
- [x] 2.2 Réécrire `lib/render/card.js` : structure article avec icône Material Symbols (mapping type → icône), version `font-code-sm`, titre `font-headline-md group-hover:text-vibrant-blue`, description `line-clamp-2`, badges en pied de card
- [x] 2.3 Définir le mapping type de composant → icône Material Symbols (`database` pour MCP, `bolt` pour Skill, `smart_toy` pour Agent, `anchor` pour Hook, `code` pour LSP, `extension` pour Plugin)

## 3. Page liste

- [x] 3.1 Réécrire `lib/render/page-list.js` : hero section avec titre `font-headline-lg` + description + indicateur de compte
- [x] 3.2 Réécrire la control bar de recherche : conteneur `bg-slate-900 border border-slate-700 rounded-lg`, input avec icône search à gauche (`font-code-sm`), select stylisé, conserver les attributs htmx
- [x] 3.3 Mettre à jour le rendu de la grille : `grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6`

## 4. Page détail

- [x] 4.1 Réécrire `lib/render/page-detail.js` : layout centré `max-w-[800px] mx-auto`, lien retour avec icône `arrow_back`
- [x] 4.2 Implémenter le hero du plugin : badge type primaire, version `font-code-sm`, titre `font-headline-lg text-primary`, description, bouton "Install Plugin" (placeholder)
- [x] 4.3 Implémenter la metadata grid : `grid grid-cols-2 md:grid-cols-4 gap-gutter bg-slate-800/50 border border-slate-700 rounded-xl`, afficher uniquement les champs disponibles (category, version)
- [x] 4.4 Réécrire le conteneur README : `bg-slate-900 border border-slate-700 rounded-xl p-gutter` avec overrides code blocks (`bg-black font-code-sm`)
- [x] 4.5 Réécrire les accordéons de composants : summary avec icône colorée + badge type + chevron animé (`.chevron-icon transition-transform`), contenu dans `bg-slate-900 border-t border-slate-700`

## 5. Build statique & vérification

- [x] 5.1 Vérifier que `scripts/build-static.js` réécrit correctement les liens Tailwind CDN et Google Fonts (pas de réécriture nécessaire, ces URLs sont externes)
- [x] 5.2 Lancer `node scripts/build-static.js` et vérifier que les 9 pages statiques sont générées sans erreur
- [x] 5.3 Ouvrir `public/index.html` dans un navigateur et vérifier visuellement la page liste (dark mode, cards, search bar)
- [x] 5.4 Ouvrir `public/agents/java-backend.html` et vérifier visuellement la page détail (hero, metadata, accordéons)
- [x] 5.5 Tester la recherche AJAX sur le serveur local (`node server.js`) : vérifier que htmx fonctionne toujours

## 6. English-only UI

- [x] 6.1 Translate all UI strings to English: page-list.js (hero, search placeholder, empty states, category select), page-detail.js (back link, metadata labels, section titles), layout.js (nav labels, footer), server.js (error pages)
- [x] 6.2 Add functional nav links: Agents → /?type=agents, MCP Servers → /?type=mcpServers, Docs/GitHub → GitHub repo; type filtering support in server + data layer; active nav state per route
- [x] 6.3 Rebuild static and verify
- [x] 6.4 Fix nav duplication: hide header nav on lg+ (sidebar takes over)
- [x] 6.5 Rename branding: "Registry" → "Claude Marketplace Browser"
- [x] 6.6 Align header logo with main content left edge (spacer div matching sidebar width)
