## 1. Validation des champs obligatoires

- [x] 1.1 Dans `lib/data.js`, modifier `readAgents()` pour rejeter (warning + skip) toute entrée plugin sans `source`
- [x] 1.2 Conserver le warning existant pour les entrées sans `name`

## 2. Fusion du manifeste local

- [x] 2.1 Dans `lib/data.js`, créer une fonction `loadLocalManifest(marketplacePath, source)` qui lit `.claude-plugin/plugin.json` dans le dossier `source` relatif et retourne l'objet JSON ou `null` si absent
- [x] 2.2 Dans `readAgents()`, après validation, appeler `loadLocalManifest` pour chaque plugin avec `source` relatif et fusionner les champs (manifeste local gagne) avec un warning si des champs de composants sont écrasés
- [x] 2.3 Vérifier que `readAgentDetail()` utilise bien le plugin déjà fusionné (via `readAgents()`) sans traitement supplémentaire

## 3. Découverte automatique des dossiers standards

- [x] 3.1 Dans `lib/data.js`, créer une fonction `detectLocalComponents(pluginDir)` qui vérifie la présence des dossiers `skills/`, `agents/`, `commands/`, `hooks/`, `mcp/`, `lsp/` et retourne un objet avec les champs correspondants
- [x] 3.2 Dans `readAgents()`, après la fusion du manifeste, appliquer la détection automatique uniquement pour les champs non encore déclarés (ni par `plugin.json` ni par `marketplace.json`)

## 4. Mise à jour de l'exemple

- [x] 4.1 Dans `example/.claude-plugin/marketplace.json`, ajouter le champ `source` sur chaque entrée plugin existante (utiliser des chemins relatifs fictifs cohérents ou `.` pour les plugins sans dossier dédié)

## 5. Vérification

- [x] 5.1 Lancer `node scripts/build.js example/` et vérifier que le build se termine sans erreur et génère `dist/`
- [x] 5.2 Vérifier en console que les warnings s'affichent correctement pour une entrée test sans `source`
- [x] 5.3 Tester avec un plugin local ayant un dossier `skills/` sans déclaration explicite et vérifier que le label `Skills` apparaît dans le rendu
