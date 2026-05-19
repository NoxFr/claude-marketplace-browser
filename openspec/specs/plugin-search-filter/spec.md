## Requirements

### Requirement: Recherche textuelle client-side
La page liste SHALL inclure un champ de recherche qui filtre les cartes visibles en manipulant le DOM côté client, sans appel réseau.

#### Scenario: Saisie d'un terme de recherche
- **WHEN** l'utilisateur saisit un terme (délai 150ms debounce)
- **THEN** les cartes dont le `data-name` ou `data-description` ne contient pas le terme sont masquées via `classList.toggle('hidden')`, sans rechargement ni requête réseau

#### Scenario: Effacement du champ
- **WHEN** l'utilisateur efface le champ de recherche
- **THEN** toutes les cartes sont rendues visibles

#### Scenario: Aucun résultat
- **WHEN** aucune carte ne correspond au terme saisi
- **THEN** un message "Aucun résultat pour cette recherche" est affiché dans la grille

### Requirement: Filtrage par catégorie client-side
La page liste SHALL inclure un sélecteur de catégorie qui filtre les cartes visibles côté client, en combinaison avec la recherche textuelle.

#### Scenario: Sélection d'une catégorie
- **WHEN** l'utilisateur sélectionne une catégorie dans le select
- **THEN** seules les cartes dont le `data-category` correspond à la catégorie sélectionnée sont visibles (combiné avec le filtre texte actif)

#### Scenario: Retour à "Toutes les catégories"
- **WHEN** l'utilisateur sélectionne l'option par défaut
- **THEN** le filtre catégorie est retiré et la liste (filtrée par search si actif) est complète
