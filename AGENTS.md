# Claude Agents Guide

This document describes how AI agents (Claude Code) should work with this repository.

## Project Overview

**claude-marketplace-browser** is a lightweight Node.js/HTMX web application that renders a browsable UI from a `marketplace.json` plugin registry. The server (`server.js`) is a single-file HTTP server with inline HTML rendering — no build step, no framework.

Key files:
- `server.js` — HTTP server, HTML rendering, plugin reading
- `browser.config.js` — marketplace path resolution (CLI arg / env var)
- `scripts/build-static.js` — generates a self-contained static site for GitLab Pages
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

### Building the static demo

```bash
node scripts/build-static.js
# Outputs to public/ (gitignored)
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

- **No build step**: the server is a single `server.js` file — keep it that way.
- **No unnecessary dependencies**: the only runtime deps are `js-yaml` and `marked`.
- **Inline styles**: CSS lives inside `layout()` in `server.js` — do not introduce external stylesheets.
- **No comments** unless the why is non-obvious.
- **Commits**: follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, etc.).

## Testing

There is no automated test suite. Verify changes by:
1. Running `npm start` and checking the browser at http://localhost:3000
2. Running `node scripts/build-static.js` and opening `public/index.html`
3. Checking all plugin cards and at least one detail page

When modifying plugin rendering, test against the full `example/` marketplace (8 plugins covering all component types).
