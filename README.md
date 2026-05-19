# Claude Marketplace Browser

[![GitHub Pages](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue)](https://noxfr.github.io/claude-marketplace-browser)
[![npm](https://img.shields.io/npm/v/claude-marketplace-browser)](https://www.npmjs.com/package/claude-marketplace-browser)

```bash
npx claude-marketplace-browser /path/to/your-marketplace
```

Generates a fully static site from your `marketplace.json` — searchable plugin gallery, per-plugin detail pages with rendered docs, one-click install commands. Deploy anywhere: GitHub Pages, GitLab Pages, S3.

## Features

- Searchable and filterable plugin gallery (by name, description, category) — client-side, no server required
- Plugin detail pages with rendered README and per-component documentation
- Support for all Claude plugin component types: skills, commands, agents, hooks, MCP servers, LSP servers
- **One-click install**: each plugin detail page shows the exact `claude plugin install` command, copied to clipboard on click
- **Add marketplace banner**: the list page shows the `claude plugin marketplace add` command to register this marketplace in Claude Code
- Color-coded badges per component type

## Table of Contents

- [Features](#features)

- [Static Site (GitHub Pages / GitLab Pages)](#static-site-github-pages--gitlab-pages)
- [Local Dev Server](#local-dev-server)
- [Marketplace Format](#marketplace-format)
- [Stack](#stack)
- [Contributing](#contributing)
- [License](#license)

## Static Site (GitHub Pages / GitLab Pages)

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

## Local Dev Server

An alternative to `npx` for browsing your marketplace locally without generating static files.

```bash
npm install
MARKETPLACE_PATH=/path/to/marketplace npm run dev
```

Open http://localhost:3000 in your browser. The `--watch` flag reloads automatically on file changes.

```bash
# CLI flags
node scripts/dev-server.js --marketplace-path /path/to/marketplace

# Environment variables
MARKETPLACE_PATH=/path/to/marketplace npm start
```

The target directory must contain a `.claude-plugin/marketplace.json` file.

### Marketplace URL

```bash
node scripts/dev-server.js --marketplace-path /path/to/marketplace --marketplace-url https://github.com/myorg/my-plugins
MARKETPLACE_URL=https://github.com/myorg/my-plugins npm start
```

Without this option, the banner shows a `<path-or-url>` placeholder.

## Marketplace Format

See the [official plugin marketplace documentation](https://code.claude.com/docs/en/plugin-marketplaces).

## Stack

- **Runtime**: Node.js (no framework, built-in `http` module)
- **Frontend**: Vanilla ES2020 — client-side search/filter via `data-*` attributes
- **Templating**: Server-side HTML string rendering
- **Styles**: [Tailwind CSS](https://tailwindcss.com/) compiled at build time (no CDN, no runtime overhead)
- **Markdown**: [marked](https://marked.js.org/) for plugin README and component docs

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT — see [LICENSE](LICENSE).
