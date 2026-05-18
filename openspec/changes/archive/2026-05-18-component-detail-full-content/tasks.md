## 1. Lecture des fichiers composants

- [x] 1.1 Ajouter la fonction `readComponentFiles(pluginDir, componentType, names)` dans `server.js` qui retourne un tableau `{ name, content }` pour chaque composant trouvé dans `.claude/<type>/<name>.md`
- [x] 1.2 Gérer le skip silencieux quand le fichier est absent (catch ENOENT)
- [x] 1.3 Intégrer l'appel dans `readAgentDetail` pour collecter les composants de tous les types déclarés (skills, agents, commands, hooks, mcpServers, lspServers)

## 2. Rendu HTML

- [x] 2.1 Ajouter le rendu des sections composants dans `renderDetailPage` : pour chaque type avec des composants, afficher un groupe avec label et les `<details>/<summary>` de chaque composant
- [x] 2.2 Rendre le contenu markdown via `marked` et texte brut via `<pre>` selon l'extension du fichier
- [x] 2.3 Ajouter le style CSS pour les accordéons composants (sections `<details>`, `<summary>`, code blocks)

## 3. Vérification

- [x] 3.1 Créer un exemple de fichier skill dans `example/java-backend/.claude/skills/java-backend.md` pour valider l'affichage
- [x] 3.2 Vérifier le rendu dans le navigateur : section repliée par défaut, dépliage au clic, rendu markdown correct
