# Claude Marketplace Browser

Interface web pour explorer les plugins d'un marketplace Claude.

## Installation

```bash
npm install
```

## Lancement

```bash
node server.js
```

Puis ouvrir http://localhost:3000

## Configuration du marketplace

Par défaut, le serveur utilise le dossier `./example` comme source de plugins.

Pour pointer vers un autre dossier :

```bash
# Via argument CLI
node server.js --marketplace /path/to/marketplace

# Via variable d'environnement
MARKETPLACE_PATH=/path/to/marketplace node server.js
```

Le dossier cible doit contenir `.claude-plugin/marketplace.json`.

## Format de marketplace.json

```json
{
  "name": "Mon Marketplace",
  "owner": "Equipe",
  "plugins": [
    {
      "name": "mon-plugin",
      "description": "Description du plugin",
      "category": "Development",
      "version": "1.0.0",
      "skills": ["nom-du-skill"],
      "mcpServers": ["nom-serveur"]
    }
  ]
}
```

Champs de composants supportés : `skills`, `commands`, `agents`, `hooks`, `mcpServers`, `lspServers`.

## Fallback HTMX offline

```bash
npm run vendor
```

Télécharge `htmx.min.js` dans `vendor/` pour un usage sans accès CDN.
