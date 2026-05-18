# Claude Marketplace Browser

A lightweight web UI for browsing Claude plugin marketplaces. Displays plugins, their components (skills, agents, MCP servers, hooks, etc.), and renders their documentation in a clean interface.

[![GitHub Pages](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue)](https://noxfr.github.io/claude-marketplace-browser)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Marketplace Format](#marketplace-format)
- [Stack](#stack)
- [Offline HTMX Fallback](#offline-htmx-fallback)
- [Contributing](#contributing)
- [License](#license)

## Overview

The browser reads a `marketplace.json` file from a local directory and serves a searchable, filterable plugin gallery. Each plugin card links to a detail page showing its README and component documentation.

## Features

- Searchable and filterable plugin gallery (by name, description, category)
- Plugin detail pages with rendered README and per-component documentation
- Support for all Claude plugin component types: skills, commands, agents, hooks, MCP servers, LSP servers
- Color-coded badges per component type
- Markdown rendering for plugin and component documentation (with syntax-highlighted code blocks)
- Static snapshot export for hosting on GitLab/GitHub Pages
- Offline mode with vendored HTMX fallback

## Installation

```bash
npm install
```

## Usage

```bash
# Start the server (default: http://localhost:3000)
npm start

# Start with live-reload during development
npm run dev
```

Open http://localhost:3000 in your browser.

## Configuration

By default the server reads plugins from the `./example` directory.

Point it to another directory via CLI argument or environment variable:

```bash
# CLI argument
node server.js --marketplace /path/to/marketplace

# Environment variable
MARKETPLACE_PATH=/path/to/marketplace npm start
```

The target directory must contain a `.claude-plugin/marketplace.json` file.

## Marketplace Format

`marketplace.json` structure:

```json
{
  "name": "My Marketplace",
  "owner": "Team Name",
  "plugins": [
    {
      "name": "my-plugin",
      "description": "What this plugin does",
      "category": "Development",
      "version": "1.0.0",
      "skills": ["skill-name"],
      "mcpServers": ["server-name"]
    }
  ]
}
```

Supported component fields: `skills`, `commands`, `agents`, `hooks`, `mcpServers`, `lspServers`.

Each component name resolves to a Markdown file inside the plugin directory under `.claude/<type>/<name>.md`. A special value `"./"` reads `SKILL.md` or `README.md` from the plugin root.

## Stack

- **Runtime**: Node.js (no framework, built-in `http` module)
- **Frontend**: [HTMX](https://htmx.org/) for dynamic search/filtering without JavaScript
- **Templating**: Server-side HTML string rendering
- **Markdown**: [marked](https://marked.js.org/) for plugin README and component docs
- **Config parsing**: [js-yaml](https://github.com/nodeca/js-yaml)

## Offline HTMX Fallback

The UI uses HTMX for dynamic search. If you need to run without CDN access, vendor the script locally:

```bash
npm run vendor
```

This downloads `htmx.min.js` into `vendor/` and the server serves it as a fallback.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT — see [LICENSE](LICENSE).
