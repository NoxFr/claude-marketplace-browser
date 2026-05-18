## Requirements

### Requirement: Recherche textuelle via HTMX
La page liste SHALL inclure un champ de recherche qui envoie une requête `GET /search?q=<terme>` au serveur via `hx-get` et remplace la grille de cartes avec le fragment HTML retourné.

#### Scenario: Saisie d'un terme de recherche
- **WHEN** l'utilisateur saisit un terme (délai 200ms debounce)
- **THEN** HTMX envoie `GET /search?q=<terme>` et la grille est mise à jour avec les agents correspondants (nom ou description contient le terme, insensible à la casse)

#### Scenario: Effacement du champ
- **WHEN** l'utilisateur efface le champ de recherche
- **THEN** la requête `GET /search?q=` est envoyée et la liste complète est affichée

#### Scenario: Aucun résultat
- **WHEN** aucun agent ne correspond au terme
- **THEN** le fragment retourné contient un message "Aucun résultat pour cette recherche"

### Requirement: Filtrage par catégorie via HTMX
La page liste SHALL inclure un sélecteur de catégorie qui combine avec la recherche dans la requête `GET /search?q=&category=`.

#### Scenario: Sélection d'une catégorie
- **WHEN** l'utilisateur sélectionne une catégorie dans le select
- **THEN** HTMX envoie `GET /search?q=<terme_actuel>&category=<catégorie>` et la grille est filtrée

#### Scenario: Retour à "Toutes les catégories"
- **WHEN** l'utilisateur sélectionne l'option par défaut
- **THEN** le filtre catégorie est retiré de la requête et la liste complète (filtrée par search si actif) s'affiche

### Requirement: Endpoint serveur GET /search
Le serveur SHALL exposer `GET /search?q=&category=` retournant un fragment HTML (uniquement la grille de cartes, pas le layout complet) avec les agents filtrés.

#### Scenario: Requête avec les deux filtres
- **WHEN** `GET /search?q=gpt&category=assistant` est reçu
- **THEN** le serveur retourne le fragment HTML des cartes dont le nom/description contient "gpt" ET dont la catégorie est "assistant"
