# Changelog

All notable changes to this project are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Versions follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [1.1.0] - 2025-05-18

### Added
- English README, LICENSE (MIT), CONTRIBUTING guide, and this CHANGELOG
- GitLab Pages deployment via `.gitlab-ci.yml`
- Static site build script (`scripts/build-static.js`) for generating a self-contained HTML demo

## [1.0.0] - 2025-05-01

### Added
- Web UI for browsing Claude plugin marketplaces
- Searchable and filterable plugin grid
- Plugin detail pages with README and component documentation rendering
- Support for `skills`, `commands`, `agents`, `hooks`, `mcpServers`, `lspServers` component types
- Configurable marketplace path via `--marketplace` CLI flag or `MARKETPLACE_PATH` env var
- HTMX-powered dynamic search with offline CDN fallback (`npm run vendor`)
- Example marketplace for local development and demo
