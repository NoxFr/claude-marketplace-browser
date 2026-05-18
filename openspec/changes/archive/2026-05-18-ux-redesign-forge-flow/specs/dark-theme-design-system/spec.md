## ADDED Requirements

### Requirement: Design system tokens intégrés via Tailwind config
Le layout HTML SHALL embarquer la configuration Tailwind (couleurs, typographie, spacing, border-radius) correspondant au design system "Forge & Flow" via un tag `<script id="tailwind-config">` inline dans chaque page.

#### Scenario: Couleurs disponibles comme classes Tailwind
- **WHEN** une page est rendue par le serveur
- **THEN** les classes `bg-surface`, `text-on-surface`, `border-outline-variant`, `text-vibrant-blue`, `bg-slate-800`, `text-mcp-label`, `text-skill-label` sont utilisables dans les templates

#### Scenario: Typographie disponible comme classes Tailwind
- **WHEN** une page est rendue par le serveur
- **THEN** les classes `font-headline-lg`, `font-headline-md`, `font-body-base`, `font-body-sm`, `font-label-caps`, `font-code-sm` correspondent aux familles Hanken Grotesk, Inter et JetBrains Mono

### Requirement: Polices Google Fonts chargées dans le layout
Le layout SHALL inclure un `<link>` vers Google Fonts chargeant Inter, Hanken Grotesk, JetBrains Mono et Material Symbols Outlined.

#### Scenario: Polices disponibles au rendu
- **WHEN** un navigateur charge une page du marketplace avec accès internet
- **THEN** les textes affichent les polices correctes (Hanken Grotesk pour les titres, Inter pour le corps, JetBrains Mono pour les labels et le code)

### Requirement: Thème dark mode appliqué au document
La balise `<html>` SHALL avoir la classe `dark` et le `<body>` SHALL avoir `bg-surface` (`#0b1326`) comme background par défaut.

#### Scenario: Background dark appliqué
- **WHEN** n'importe quelle page est chargée
- **THEN** le fond de page est `#0b1326` et le texte par défaut est `#dae2fd`
