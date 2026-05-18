# Claude Marketplace Browser

A lightweight web UI for browsing Claude plugin marketplaces. Displays plugins, their components (skills, agents, MCP servers, hooks, etc.), and renders their documentation in a clean interface.

[![GitHub Pages](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue)](https://noxfr.github.io/claude-marketplace-browser)
[![npm](https://img.shields.io/npm/v/claude-marketplace-browser)](https://www.npmjs.com/package/claude-marketplace-browser)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Static Site (GitHub Pages / GitLab Pages)](#static-site-github-pages--gitlab-pages)
- [Dev Server](#dev-server)
- [Configuration](#configuration)
- [Marketplace Format](#marketplace-format)
- [Publishing to npm](#publishing-to-npm)
- [Stack](#stack)
- [Contributing](#contributing)
- [License](#license)

## Overview

The browser reads a `marketplace.json` file from a local directory and can either serve a live dev server or generate a fully static site deployable anywhere (GitHub Pages, GitLab Pages, S3, etc.).

## Features

- Searchable and filterable plugin gallery (by name, description, category) — client-side, no server required
- Plugin detail pages with rendered README and per-component documentation
- Support for all Claude plugin component types: skills, commands, agents, hooks, MCP servers, LSP servers
- **One-click install**: each plugin detail page shows the exact `claude plugin install` command, copied to clipboard on click
- **Add marketplace banner**: the list page shows the `claude plugin marketplace add` command to register this marketplace in Claude Code
- Color-coded badges per component type
- Markdown rendering for plugin and component documentation

## Static Site (GitHub Pages / GitLab Pages)

Generate a fully static `dist/` folder from your marketplace and host it anywhere — no server needed.

### Quick start via npx

```bash
npx claude-marketplace-browser /path/to/your-marketplace
```

This generates a `dist/` directory in the current working directory:

```
dist/
  index.html
  styles.css
  search.js
  agents/
    {plugin-name}/
      index.html
```

### With marketplace URL (for install commands)

```bash
npx claude-marketplace-browser /path/to/marketplace https://github.com/myorg/my-plugins
```

Or with named flags:

```bash
npx claude-marketplace-browser --marketplace-path /path/to/marketplace --marketplace-url https://github.com/myorg/my-plugins
```

### Deploy to GitHub Pages

Add this workflow to `.github/workflows/pages.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: true  # if your marketplace is a submodule
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npx claude-marketplace-browser ./your-marketplace-dir
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

### Deploy to GitLab Pages

Add this to `.gitlab-ci.yml`:

```yaml
pages:
  image: node:20
  script:
    - npx claude-marketplace-browser ./your-marketplace-dir
    - mv dist public
  artifacts:
    paths:
      - public
  only:
    - main
```

## Dev Server

For local development with live reload:

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

```bash
# Start the server
npm start

# Start with live-reload
npm run dev
```

## Configuration

Point the server or build at your marketplace:

```bash
# CLI argument (dev server)
node server.js --marketplace-path /path/to/marketplace

# Environment variable
MARKETPLACE_PATH=/path/to/marketplace npm start
```

The target directory must contain a `.claude-plugin/marketplace.json` file.

### Marketplace URL (for install commands)

```bash
node server.js --marketplace-path /path/to/marketplace --marketplace-url https://github.com/myorg/my-plugins
MARKETPLACE_URL=https://github.com/myorg/my-plugins npm start
```

Without this option, the banner shows a `<path-or-url>` placeholder.

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

## Publishing to npm

This package is published to npm via GitHub Actions on every version tag.

To release a new version:

```bash
# Bump version in package.json, then:
git tag v1.2.3
git push origin v1.2.3
```

The `.github/workflows/publish.yml` workflow runs `npm publish` automatically using the `NPM_TOKEN` repository secret.

## Stack

- **Runtime**: Node.js (no framework, built-in `http` module)
- **Frontend**: Vanilla ES2020 — client-side search/filter via `data-*` attributes
- **Templating**: Server-side HTML string rendering
- **Markdown**: [marked](https://marked.js.org/) for plugin README and component docs
- **Config parsing**: [js-yaml](https://github.com/nodeca/js-yaml)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT — see [LICENSE](LICENSE).
