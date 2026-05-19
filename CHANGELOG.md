# Changelog

All notable changes to this project are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versions follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Changed
- Tailwind CSS served from CDN replaced by Tailwind CLI build step — CSS compiled to `public/styles.css`, no network dependency at runtime
- Removed unused `js-yaml` dependency

## [1.1.0] - 2025-05-18

### Added
- English README, LICENSE (MIT), CONTRIBUTING guide, and this CHANGELOG
- GitHub Pages deployment via `.github/workflows/pages.yml`
- Static site build script (`scripts/build.js`) for generating a self-contained HTML demo

## [1.0.0] - 2025-05-01

### Added
- Web UI for browsing Claude plugin marketplaces
- Searchable and filterable plugin grid
- Plugin detail pages with README and component documentation rendering
- Support for `skills`, `commands`, `agents`, `hooks`, `mcpServers`, `lspServers` component types
- Configurable marketplace path via `--marketplace-path` CLI flag or `MARKETPLACE_PATH` env var
- Client-side search and filter via `data-*` attributes — no server required
- Example marketplace for local development and demo
