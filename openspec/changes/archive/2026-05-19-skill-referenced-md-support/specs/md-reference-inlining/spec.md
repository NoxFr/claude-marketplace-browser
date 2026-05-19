## ADDED Requirements

### Requirement: Détection des références Markdown dans le contenu des composants
Lors de la lecture du contenu d'un composant (skill, agent, etc.), `lib/data.js` SHALL détecter les occurrences de chemins relatifs `.md` entre backticks (pattern `` `chemin/vers/fichier.md` ``) et tenter de résoudre chaque chemin relativement au répertoire du fichier source du composant.

#### Scenario: Référence résolue avec succès
- **WHEN** le contenu d'un skill contient `` `references/application-web.md` `` et que ce fichier existe dans le répertoire du skill
- **THEN** le fichier est chargé et retourné dans le champ `referencedFiles` de l'entrée du composant, avec `name = "references/application-web.md"` et son contenu complet

#### Scenario: Référence vers un fichier absent
- **WHEN** le contenu d'un skill contient `` `references/inexistant.md` `` et qu'aucun fichier de ce nom n'existe
- **THEN** ce chemin est ignoré silencieusement — aucun fichier n'est ajouté à `referencedFiles` pour ce chemin

#### Scenario: Plusieurs références dans un même skill
- **WHEN** le skill `java-backend` référence 5 fichiers dans son contenu (application-web.md, application-rabbit.md, infrastructure-http.md, infrastructure-jpa-postgre.md, infrastructure-rabbit.md)
- **THEN** tous les fichiers existants sont chargés et retournés dans `referencedFiles` dans l'ordre de leur apparition dans le contenu

#### Scenario: Résolution non récursive
- **WHEN** un fichier référencé contient lui-même `` `autre-fichier.md` ``
- **THEN** cette référence imbriquée n'est pas résolue — seul le contenu brut du fichier référencé est retourné

### Requirement: Champ referencedFiles dans la structure de retour des composants
`readSkillFiles` et `readComponentFiles` SHALL retourner un champ optionnel `referencedFiles: Array<{name: string, content: string}>` sur chaque entrée de composant, contenant les fichiers référencés résolus avec succès.

#### Scenario: Skill sans référence
- **WHEN** le contenu d'un skill ne contient aucun code span `` `*.md` ``
- **THEN** l'entrée retournée n'a pas de champ `referencedFiles` (ou tableau vide) — aucune régression sur le comportement existant

#### Scenario: Skill avec références partiellement résolues
- **WHEN** un skill référence 3 fichiers dont 2 existent et 1 est absent
- **THEN** `referencedFiles` contient exactement les 2 fichiers trouvés
