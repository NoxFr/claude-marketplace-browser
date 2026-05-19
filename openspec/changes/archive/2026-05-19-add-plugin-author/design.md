## Context

Le schéma `marketplace.json` définit les métadonnées des plugins. Actuellement, aucun champ `author` n'est défini sur les plugins individuels (seul `owner` existe au niveau du manifest). La page de détail dispose déjà d'une metadata grid prévoyant un emplacement "Author", mais ce champ n'est pas alimenté. Les cartes de liste n'affichent pas l'auteur.

## Goals / Non-Goals

**Goals:**
- Ajouter le champ optionnel `author` sur les entrées plugin dans `marketplace.json`
- Afficher l'auteur dans la metadata grid de la page de détail
- Afficher l'auteur sur les cartes de la page liste (sous la description)
- Maintenir la rétrocompatibilité (champ absent = pas d'affichage)

**Non-Goals:**
- Validation ou authentification des auteurs
- Page de profil auteur ou filtrage par auteur
- Migration automatique des manifests existants

## Decisions

### Champ optionnel au niveau plugin
Le champ `author` est ajouté directement sur l'objet plugin dans `marketplace.json`, pas uniquement au niveau du manifest. Cela permet à chaque plugin d'avoir un auteur différent (utile pour les marketplaces communautaires).

Alternatives considérées :
- Hériter du `owner` du manifest → trop restrictif, ne couvre pas les contributions externes
- Champ `authors` (tableau) → sur-ingénierie pour le besoin actuel

### Affichage sans valeur par défaut
Si `author` est absent, le champ n'est pas rendu (ni placeholder, ni fallback sur `owner`). Cela évite d'afficher une information potentiellement inexacte.

## Risks / Trade-offs

- [Champ non validé côté client] → L'auteur est affiché tel quel, risque d'injection HTML si le template n'échappe pas correctement → Mitigation : utiliser l'échappement HTML du moteur de template existant
- [Rétrocompatibilité] → Les manifests sans `author` continuent de fonctionner sans modification nécessaire
