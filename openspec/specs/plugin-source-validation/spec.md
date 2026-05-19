## Requirements

### Requirement: Validation des champs obligatoires name et source
Lors de la lecture de `marketplace.json`, chaque entrée plugin SHALL déclarer les champs `name` et `source`. Une entrée manquant l'un de ces champs SHALL être ignorée avec un avertissement en console.

#### Scenario: Entrée sans name
- **WHEN** une entrée plugin dans `marketplace.json` n'a pas de champ `name`
- **THEN** l'entrée est ignorée et un warning `[marketplace] Plugin entry missing required field 'name'` est émis

#### Scenario: Entrée sans source
- **WHEN** une entrée plugin dans `marketplace.json` n'a pas de champ `source`
- **THEN** l'entrée est ignorée et un warning `[marketplace] Plugin entry missing required field 'source': <name>` est émis

#### Scenario: Entrée valide avec name et source
- **WHEN** une entrée plugin déclare `name` et `source`
- **THEN** l'entrée est acceptée et incluse dans la liste des plugins
