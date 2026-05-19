## Requirements

### Requirement: Affichage des métadonnées complètes
La route `GET /plugins/<nom>` SHALL retourner une page HTML affichant toutes les métadonnées du plugin issues de `marketplace.json` : nom, description, catégorie, version, et labels de composants.

#### Scenario: Accès à la page de détail
- **WHEN** l'utilisateur ouvre `/plugins/<nom>`
- **THEN** toutes les métadonnées du plugin issues de `marketplace.json` sont affichées, avec les labels de composants (Skill, Agent, MCP…) et la version

#### Scenario: Plugin introuvable
- **WHEN** l'utilisateur accède à `/plugins/<nom>` pour un plugin absent de `marketplace.json`
- **THEN** le serveur retourne une page d'erreur HTML avec un lien de retour vers la liste

### Requirement: Affichage du README / SKILL.md
La page de détail SHALL afficher le contenu de `SKILL.md` ou `README.md` du plugin lorsqu'ils sont présents dans la source locale, rendus en HTML.

#### Scenario: README ou SKILL.md présent
- **WHEN** le plugin possède un `SKILL.md` ou `README.md` accessible localement
- **THEN** son contenu est rendu en HTML dans une section "Description & Exemples"

#### Scenario: Aucun fichier de description
- **WHEN** le plugin ne possède ni `SKILL.md` ni `README.md`
- **THEN** la section description longue n'est pas affichée

