## Context

`claude-marketplace-browser` is a Node.js/HTMX web app that serves a dynamic plugin marketplace UI from a local directory. The project exists but lacks OSS hygiene (French-only docs, no license, no CI) and has no public demo. GitLab Pages only serves static files — the dynamic Node server cannot run there directly.

## Goals / Non-Goals

**Goals:**
- Full English OSS documentation (README, LICENSE, CONTRIBUTING, CHANGELOG)
- GitLab Pages deployment that shows a live static demo of the `example/` marketplace
- CI pipeline that builds and publishes the demo on every default-branch push

**Non-Goals:**
- Changing the server runtime or plugin format
- Supporting dynamic server-side features on Pages (no SSR)
- i18n of the UI itself (the browser UI language is out of scope)

## Decisions

### Static demo approach: pre-rendered HTML snapshot

**Decision**: Generate a self-contained static snapshot of the example marketplace using a build script (`scripts/build-static.js`) that renders the server's HTML output to files.

**Rationale**: GitLab Pages needs a `public/` folder with static files. Options considered:
1. **Pre-rendered snapshot** (chosen) — run the server locally during CI, crawl its pages with `curl`/`playwright`, dump HTML + inline assets into `public/`. Simple, no new deps beyond what CI provides.
2. **Full SPA rewrite** — too large a scope change; deviates from HTMX architecture.
3. **iframe embed of a live server** — no free hosting for Node apps in scope.

The snapshot approach produces a read-only static demo that mirrors the real app's look and feel. HTMX partial updates won't work on the static version, but the full-page HTML is sufficient for a demo.

### GitLab CI job strategy

**Decision**: Single `.gitlab-ci.yml` with one `pages` job that installs deps, starts the server briefly, generates the static snapshot, then publishes `public/`.

**Rationale**: Keeps CI simple. No separate Docker image needed — Node is available in the default GitLab runner image. The server starts, the build script fetches pages, server stops, artifacts are uploaded.

### License: MIT

**Decision**: MIT license.

**Rationale**: Most permissive, standard choice for developer tools. Matches the spirit of the project.

## Risks / Trade-offs

- [Static snapshot may miss dynamic HTMX partials] → Mitigation: render full-page HTML for index + each plugin detail; add a banner in the static demo saying "Live demo — some interactions require the local server."
- [CI runner may not have a stable port for the server] → Mitigation: use a fixed port (3000) with a health-check retry loop before crawling.
- [Snapshot script maintenance burden] → Mitigation: keep it minimal — only crawl top-level routes; document how to add new pages.

## Migration Plan

1. Add all new files (LICENSE, CONTRIBUTING.md, CHANGELOG.md, .gitlab-ci.yml, scripts/build-static.js)
2. Rewrite README.md in English
3. Test CI pipeline on a feature branch before merging to default branch
4. Verify GitLab Pages URL is accessible after first successful pipeline

No rollback needed — all changes are additive except the README rewrite (reversible via git).
