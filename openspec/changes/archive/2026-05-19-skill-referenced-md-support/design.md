## Context

Les fichiers SKILL.md peuvent contenir des références à d'autres fichiers Markdown via des chemins relatifs entre backticks, ex :
```
- **API Web (WebMVC)** : Voir `references/application-web.md` pour les spécificités REST
```
Ces fichiers existent physiquement dans le répertoire du skill (ex : `java-backend/references/application-web.md`). Le navigateur affiche actuellement le chemin comme un code span inerte — l'utilisateur ne peut pas voir le contenu sans accéder directement aux fichiers sources.

Le cas concret : skill `java-backend` avec 5 fichiers référencés dans `references/`.

## Goals / Non-Goals

**Goals:**
- Détecter les chemins relatifs `.md` entre backticks dans le contenu des composants
- Vérifier l'existence des fichiers correspondants (relatifs au répertoire du composant)
- Afficher les fichiers trouvés comme des sections dépliables (accordéons) **après** le contenu principal du skill
- Laisser ces accordéons **fermés par défaut** (ressources complémentaires, pas du contenu principal)

**Non-Goals:**
- Support de chemins absolus ou hors du répertoire du plugin
- Résolution récursive (les fichiers référencés ne sont pas eux-mêmes scannés)
- Modification du format `marketplace.json`
- Remplacement inline du texte dans le contenu (trop complexe, casse la structure de liste)

## Decisions

### D1 : Détection des chemins relatifs `.md` entre backticks dans `lib/data.js`

Pattern regex : `` /`([^`]+\.md)`/g `` appliqué sur le contenu brut avant rendu.

**Rationale** : Pattern naturel dans les SKILL.md — les auteurs citent les fichiers en code span. On ne veut pas parser des paths génériques ou des imports, seulement des références explicites à des fichiers `.md`.

**Alternatives écartées** :
- `@NomFichier.md` : pas utilisé dans le cas réel observé
- Scan du répertoire sans détection dans le texte : chargerait des fichiers non liés au contenu

---

### D2 : Résolution relative au répertoire du fichier source du composant

Le chemin est résolu relativement au répertoire contenant le SKILL.md (ex : `.claude/skills/java-backend/`). Un chemin comme `references/application-web.md` pointe donc sur `.claude/skills/java-backend/references/application-web.md`.

**Rationale** : Correspond à la convention des auteurs de skills — les `references/` sont dans le dossier du skill.

---

### D3 : Les fichiers référencés ajoutés comme accordéons fermés **après** le contenu principal

UX choisie : le contenu principal du skill reste intact et lisible. En dessous, une section "Ressources référencées" affiche les fichiers résolus dans des `<details>` **fermés par défaut**.

```
[Contenu principal du skill — rendu markdown]

▼ Ressources référencées (N)
  ▶ references/application-web.md    ← fermé par défaut
  ▶ references/application-rabbit.md ← fermé par défaut
  ...
```

**Rationale** :
- Préserve la lisibilité du contenu principal (les ressources sont complémentaires, pas centrales)
- Fermé par défaut = l'utilisateur les ouvre à la demande, évite le wall of text
- Différent des composants principaux (ouverts par défaut) — distinction sémantique claire
- Implémentation simple : pas de manipulation de l'AST Markdown, pas de remplacement inline

**Alternatives écartées** :
- Remplacement inline du code span par un `<details>` : casse la structure de liste Markdown, complexe
- Callout blockquote inliné : lisible mais intrusif pour 5+ fichiers
- Ouvert par défaut : surcharge la page, les ressources sont optionnelles

---

### D4 : Retour des fichiers référencés dans la structure de données existante

`readSkillFiles` et `readComponentFiles` retournent déjà `{ name, content }`. On étend avec un champ optionnel `referencedFiles: [{ name, content }]` sur chaque entrée.

**Rationale** : Pas de rupture de l'interface existante. Le renderer reçoit les données supplémentaires uniquement si des références ont été résolues.

## Risks / Trade-offs

- **[Risque] Faux positifs** : un code span `` `path/file.md` `` qui n'est pas une référence réelle → Mitigation : on vérifie l'existence du fichier avant inclusion, pas de bruit si le fichier est absent
- **[Risque] Contenu référencé très long** → Mitigation : accordéon fermé, l'utilisateur choisit d'ouvrir
- **[Trade-off] Pas de récursion** → Acceptable pour les cas réels observés

## Open Questions

- Grouper les fichiers référencés sous un label "Ressources référencées" ou les afficher directement sans en-tête de section ? → Décision : avec label pour la clarté
