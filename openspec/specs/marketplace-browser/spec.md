## Requirements

### Requirement: Affichage de la liste des plugins
La route `GET /` SHALL retourner une page HTML affichant toutes les cartes de plugins disponibles, lues depuis `marketplace.json`. Chaque carte affiche : nom, description courte, catégorie, version, et labels de composants.

#### Scenario: Page liste avec plugins
- **WHEN** l'utilisateur ouvre `http://localhost:3000/`
- **THEN** toutes les cartes de plugins sont visibles, chacune avec ses labels de composants (Skill, Agent, MCP…) et sa version

#### Scenario: Aucun plugin dans marketplace.json
- **WHEN** `marketplace.json` ne contient aucun plugin valide
- **THEN** la page affiche un message "Aucun plugin disponible dans ce marketplace"

### Requirement: Labels de composants sur les cartes
Chaque carte de plugin SHALL afficher les labels correspondant aux types de composants déclarés dans `marketplace.json`.

#### Scenario: Plugin avec composants déclarés
- **WHEN** un plugin déclare `skills` et `mcpServers` dans `marketplace.json`
- **THEN** sa carte affiche les labels `Skill` et `MCP`

#### Scenario: Plugin sans composant déclaré
- **WHEN** un plugin ne déclare aucun champ de composant
- **THEN** sa carte affiche le label neutre `Plugin`

### Requirement: Navigation vers le détail d'un plugin
Chaque carte de plugin SHALL contenir un lien vers la page de détail correspondante.

#### Scenario: Clic sur une carte plugin
- **WHEN** l'utilisateur clique sur la carte d'un plugin
- **THEN** le navigateur charge `/plugins/<nom>` via hx-boost ou navigation standard

