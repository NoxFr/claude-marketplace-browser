# Claude Agents Guide

This document describes how AI agents (Claude Code) should work with this repository.

## Project Overview

**claude-marketplace-browser** is a lightweight Node.js web application that renders a browsable UI from a `marketplace.json` plugin registry.

Key files:
- `server.js` — HTTP server and routing
- `lib/data.js` — reads and resolves plugins from the marketplace directory
- `lib/render/` — server-side HTML rendering (layout, cards, detail pages, badges)
- `src/styles.css` — Tailwind CSS source (input)
- `public/styles.css` — generated CSS (committed, used by server and static build)
- `public/search.js` — client-side search/filter
- `tailwind.config.js` — Tailwind configuration and safelist for dynamic classes
- `scripts/build.js` — generates a self-contained static site for GitHub Pages
- `browser.config.js` — marketplace path resolution (CLI arg / env var)
- `example/` — example marketplace used for development and the live demo
- `openspec/` — change proposals, specs, and tasks (see workflow below)

## Development Workflow

### Starting the server

```bash
npm start          # production mode
npm run dev        # dev mode with live-reload
```

The server reads `./example` by default. Point it elsewhere:

```bash
MARKETPLACE_PATH=/path/to/marketplace npm start
```

### CSS

Styles are in `src/styles.css` and compiled by Tailwind CLI to `public/styles.css`.

```bash
npm run build:css   # one-shot build (minified)
npm run watch:css   # watch mode for development
```

Run `watch:css` in a separate terminal alongside `dev` when editing templates or styles.

`public/styles.css` is committed — npm consumers get it without needing to run the build.

### Building the static site

```bash
npm run build
# Outputs to dist/
```

## Change Workflow (OpenSpec)

All non-trivial changes go through OpenSpec. Follow this sequence:

```
/opsx:propose  ──►  /opsx:apply  ──►  /opsx:archive
```

| Step | Command | What it does |
|------|---------|--------------|
| Propose | `/opsx:propose` | AI-assisted creation of proposal, design, specs, and tasks |
| Implement | `/opsx:apply` | Work through tasks, mark them complete as you go |
| Archive | `/opsx:archive` | Finalize and archive the change after merge |

Change artifacts live in `openspec/changes/<name>/`:
- `proposal.md` — why and what
- `design.md` — technical decisions
- `specs/<capability>/spec.md` — testable requirements
- `tasks.md` — implementation checklist

Always read `tasks.md` and relevant specs before making changes. Mark tasks `[x]` immediately after completing them.

## Coding Guidelines

- **Minimal deps**: runtime dep is `marked` only. Tailwind CLI is a devDep (build-time only).
- **No comments** unless the why is non-obvious.
- **Dynamic Tailwind classes**: classes built from template strings (e.g. `text-${color}`) must be added to the `safelist` in `tailwind.config.js`, then rebuild CSS.
- **Commits**: follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, etc.).

## Testing

There is no automated test suite. Verify changes by:
1. Running `npm start` and checking the browser at http://localhost:3000
2. Running `npm run build` and opening `dist/index.html`
3. Checking all plugin cards and at least one detail page

When modifying plugin rendering, test against the full `example/` marketplace.
