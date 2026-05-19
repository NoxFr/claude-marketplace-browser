## ADDED Requirements

### Requirement: Champ author optionnel dans le schéma plugin
Le schéma de plugin dans `marketplace.json` SHALL accepter un champ optionnel `author` de type string représentant le nom de l'auteur du plugin.

#### Scenario: Plugin avec champ author
- **WHEN** un plugin déclare `"author": "Prénom Nom"`
- **THEN** la valeur est disponible pour l'affichage dans les templates de liste et de détail

#### Scenario: Plugin sans champ author
- **WHEN** un plugin ne déclare pas de champ `author`
- **THEN** aucune information d'auteur n'est affichée (pas de placeholder ni de fallback)
