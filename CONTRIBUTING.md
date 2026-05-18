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

# Start dev server with live-reload
npm run dev
```

Open http://localhost:3000. The server watches for changes and restarts automatically.

## Project Structure

```
server.js           # HTTP server and HTML rendering
browser.config.js   # Marketplace path configuration
scripts/            # Build utilities
example/            # Example marketplace for development
  .claude-plugin/
    marketplace.json
openspec/           # Change proposals and specifications
  changes/          # Active and archived changes
  specs/            # Capability specifications
```

## Proposing a Change

This project uses [OpenSpec](https://openspec.dev) to define and track changes before implementation.

1. **Propose**: describe what you want to build
   ```bash
   openspec new change "my-feature-name"
   # then fill in proposal.md, design.md, specs/, tasks.md
   ```
   Or use the `/opsx:propose` skill in Claude Code for AI-assisted proposal generation.

2. **Discuss**: open a GitLab issue linking to your `openspec/changes/<name>/` directory for early feedback.

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

Open a GitLab issue with:
- A clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Node.js version (`node -v`)
