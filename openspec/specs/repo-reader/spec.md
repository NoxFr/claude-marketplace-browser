## Requirements

### Requirement: Lecture de marketplace.json
Le serveur SHALL lire `<MARKETPLACE_PATH>/.claude-plugin/marketplace.json` à chaque requête HTTP pour retourner l'état courant du marketplace, sans cache ni rebuild.

`MARKETPLACE_PATH` est résolu dans cet ordre :
1. Argument CLI `--marketplace <path>`
2. Variable d'environnement `MARKETPLACE_PATH`
3. Fallback sur `./example` (répertoire embarqué dans le projet)

#### Scenario: Plugin ajouté dans marketplace.json entre deux requêtes
- **WHEN** un nouveau plugin est ajouté dans `marketplace.json` et l'utilisateur recharge la page liste
- **THEN** le nouveau plugin apparaît dans la liste sans redémarrer le serveur

#### Scenario: Plugin modifié dans marketplace.json entre deux requêtes
- **WHEN** les métadonnées d'un plugin sont modifiées dans `marketplace.json` et l'utilisateur recharge la page de détail
- **THEN** les nouvelles métadonnées sont affichées

#### Scenario: marketplace.json absent
- **WHEN** le fichier `<MARKETPLACE_PATH>/.claude-plugin/marketplace.json` n'existe pas au démarrage du serveur
- **THEN** le serveur démarre quand même et affiche un message d'avertissement; la page liste affiche "Aucun plugin disponible"

### Requirement: Parsing des métadonnées plugin
Le serveur SHALL parser `marketplace.json` (JSON natif) et extraire pour chaque plugin : `name`, `description`, `category`, `version`, `skills`, `commands`, `agents`, `hooks`, `mcpServers`, `lspServers`.

#### Scenario: Champ name manquant
- **WHEN** une entrée plugin de `marketplace.json` ne contient pas le champ `name`
- **THEN** le plugin est ignoré et un warning est loggué dans la console serveur

#### Scenario: JSON invalide
- **WHEN** `marketplace.json` contient une erreur de syntaxe JSON
- **THEN** la liste est vide avec un message d'erreur dans la console

### Requirement: Détection des types de composants
Le serveur SHALL détecter les types de composants d'un plugin exclusivement à partir des champs déclarés dans `marketplace.json`. Si aucun champ de composant n'est présent, le type `Plugin` est assigné par défaut.

#### Scenario: Plugin avec composants déclarés
- **WHEN** une entrée plugin déclare `skills` et `mcpServers`
- **THEN** la carte affiche les labels `Skill` et `MCP`

#### Scenario: Plugin sans composant déclaré
- **WHEN** une entrée plugin ne déclare aucun champ de composant
- **THEN** la carte affiche le label neutre `Plugin`
