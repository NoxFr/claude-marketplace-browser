## 1. Détection et résolution dans lib/data.js

- [x] 1.1 Créer la fonction `extractReferencedMdPaths(content)` qui retourne tous les chemins `.md` détectés via le pattern `` /`([^`]+\.md)`/g `` dans le contenu brut
- [x] 1.2 Créer la fonction `resolveReferencedFiles(paths, sourceDir)` qui tente de charger chaque chemin relatif à `sourceDir`, retourne `[{ name, content }]` pour les fichiers trouvés (skip silencieux si absent)
- [x] 1.3 Dans `readSkillFiles`, après lecture du contenu de chaque skill, appeler `extractReferencedMdPaths` + `resolveReferencedFiles` et ajouter `referencedFiles` à l'entrée retournée
- [x] 1.4 Dans `readComponentFiles`, appliquer la même logique après lecture de chaque composant

## 2. Rendu des ressources référencées dans lib/render/page-detail.js

- [x] 2.1 Créer la fonction `renderReferencedFiles(referencedFiles)` qui génère le HTML d'une section "Ressources référencées" avec des `<details>` fermés par défaut pour chaque fichier
- [x] 2.2 Dans `renderComponentAccordions`, appeler `renderReferencedFiles(file.referencedFiles)` et insérer le résultat après le `<div class="prose-detail">` du contenu principal de chaque composant

## 3. Style des accordéons de ressources référencées

- [x] 3.1 Styler la section "Ressources référencées" avec un visuel distinct des composants principaux : fond `bg-slate-800/30`, border `border-slate-600`, icône `description` (Material Symbols), label en `font-label-caps text-slate-400`
- [x] 3.2 Vérifier que le chevron de repli/dépli fonctionne (classe `chevron-icon` comme les composants existants)

## 4. Validation manuelle

- [x] 4.1 Pointer le browser sur le plugin `common-app-aitools` contenant `java-backend` et vérifier que les 5 fichiers `references/*.md` apparaissent dans la section "Ressources référencées" de la page détail
- [x] 4.2 Vérifier qu'un skill sans références s'affiche sans régression
- [x] 4.3 Vérifier que les accordéons sont fermés par défaut et s'ouvrent au clic
