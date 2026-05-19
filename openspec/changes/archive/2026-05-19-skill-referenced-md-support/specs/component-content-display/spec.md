## MODIFIED Requirements

### Requirement: Rendu du contenu des composants
Les fichiers `.md` des composants SHALL être rendus en HTML via marked. Les autres formats SHALL être affichés en texte brut dans un bloc `<pre>`. Lorsqu'un composant possède des `referencedFiles`, ceux-ci SHALL être affichés après le contenu principal dans des accordéons `<details>` fermés par défaut, regroupés sous un label "Ressources référencées".

#### Scenario: Fichier markdown d'un skill sans référence
- **WHEN** le contenu d'un skill est affiché et que `referencedFiles` est absent ou vide
- **THEN** le markdown est rendu en HTML (titres, listes, code blocks, etc.) sans section supplémentaire

#### Scenario: Skill avec des fichiers référencés résolus
- **WHEN** le contenu du skill `java-backend` est affiché et que `referencedFiles` contient 5 entrées
- **THEN** le contenu principal est affiché en premier, suivi d'une section "Ressources référencées" contenant 5 accordéons `<details>` fermés par défaut, chacun intitulé du nom du fichier (ex : "references/application-web.md")

#### Scenario: Ouverture d'une ressource référencée
- **WHEN** l'utilisateur clique sur le `<summary>` d'une ressource référencée
- **THEN** le contenu du fichier s'affiche, rendu en HTML via marked

#### Scenario: Style visuel distinct des ressources référencées
- **WHEN** les accordéons des ressources référencées sont affichés
- **THEN** ils sont visuellement différenciés des composants principaux (ex : fond légèrement différent, icône de fichier, label de section distinct) pour indiquer leur nature complémentaire
