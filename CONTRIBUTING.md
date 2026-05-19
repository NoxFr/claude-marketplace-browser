# Contributing

Thank you for your interest in contributing to Claude Marketplace Browser!

## Prerequisites

- Node.js 18+
- npm 9+
- [OpenSpec CLI](https://openspec.dev) (for proposing and tracking changes)

## Development Setup

```bash
git clone <repo-url>
cd claude-marketplace-browser
npm install

# In one terminal: watch and recompile CSS on template changes
npm run watch:css

# In another terminal: start dev server with live-reload
npm run dev
```

Open http://localhost:3000. The server watches for changes and restarts automatically.

## Project Structure

```
server.js               # HTTP server and routing
browser.config.js       # Marketplace path resolution (CLI arg / env var)
lib/
  data.js               # Reads and resolves plugins from the marketplace directory
  render/               # Server-side HTML rendering
    layout.js           # Page shell, header, sidebar, footer
    page-list.js        # Plugin grid page
    page-detail.js      # Plugin detail page
    card.js             # Plugin card component
    badge.js            # Component type badges
src/
  styles.css            # Tailwind CSS source (input)
public/
  styles.css            # Generated CSS — committed, do not edit by hand
  search.js             # Client-side search and filter
tailwind.config.js      # Tailwind configuration and safelist for dynamic classes
scripts/
  build.js              # Generates static site to dist/
example/                # Example marketplace for development and the live demo
  .claude-plugin/
    marketplace.json
openspec/               # Change proposals and specifications
  changes/              # Active and archived changes
  specs/                # Capability specifications
```

**Important**: Tailwind classes built from template strings (e.g. `text-${color}`) are not scanned statically. Add them to the `safelist` in `tailwind.config.js`, then run `npm run build:css`.

## Proposing a Change

This project uses [OpenSpec](https://openspec.dev) to define and track changes before implementation.

1. **Propose**: describe what you want to build
   ```bash
   openspec new change "my-feature-name"
   # then fill in proposal.md, design.md, specs/, tasks.md
   ```
   Or use the `/opsx:propose` skill in Claude Code for AI-assisted proposal generation.

2. **Discuss**: open a GitHub issue linking to your `openspec/changes/<name>/` directory for early feedback.

3. **Implement**: work through `tasks.md` and mark tasks complete as you go.

4. **Archive**: once merged, archive the change:
   ```bash
   openspec archive change "my-feature-name"
   ```

## Commit Convention

Commits follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add plugin category filter
fix: handle missing marketplace.json gracefully
docs: update configuration examples
```

## Merge Request Guidelines

- Reference the OpenSpec change in your MR description
- Keep MRs focused on a single concern
- Test against the `example/` marketplace before submitting
- Ensure `npm start` works without errors

## Reporting Issues

Open a GitHub issue with:
- A clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Node.js version (`node -v`)
