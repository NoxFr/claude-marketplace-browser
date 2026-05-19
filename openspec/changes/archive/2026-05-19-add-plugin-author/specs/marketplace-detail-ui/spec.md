## MODIFIED Requirements

### Requirement: Metadata grid 4 colonnes
La page détail SHALL afficher une grille de métadonnées (`grid-cols-2 md:grid-cols-4`) avec les champs disponibles parmi : Category, Author, License, Updated — en affichant uniquement les champs disponibles dans les données du plugin. Le champ Author SHALL afficher la valeur du champ `author` du plugin lorsqu'il est présent.

#### Scenario: Affichage des métadonnées disponibles
- **WHEN** un plugin avec `category` est affiché
- **THEN** la metadata grid affiche au minimum la catégorie avec le style `font-label-caps text-slate-400` pour le label

#### Scenario: Affichage de l'auteur dans la metadata grid
- **WHEN** un plugin déclare un champ `author`
- **THEN** la metadata grid affiche une cellule "Author" avec la valeur du champ `author`

#### Scenario: Absence de l'auteur dans la metadata grid
- **WHEN** un plugin ne déclare pas de champ `author`
- **THEN** la cellule "Author" n'est pas affichée dans la metadata grid
