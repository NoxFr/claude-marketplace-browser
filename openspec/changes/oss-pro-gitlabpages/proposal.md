## Why

The project is currently written in French with a minimal README, no license, and no contribution guide — which limits its reach and professional credibility as an open-source tool. Adding a GitLab Pages deployment will provide a live, browsable demo of the example marketplace without requiring a local setup.

## What Changes

- Translate README to English with full usage documentation
- Add `LICENSE` file (MIT)
- Add `CONTRIBUTING.md` with contribution guidelines and dev setup
- Add `CHANGELOG.md` for release history
- Add `.gitlab-ci.yml` with a GitLab Pages job that deploys the `example/` content as a static demo
- Create a static export mode or adapt the example for a Pages-compatible static presentation

## Capabilities

### New Capabilities

- `oss-documentation`: Full English OSS documentation suite — README, LICENSE, CONTRIBUTING, CHANGELOG — following open-source best practices.
- `gitlab-pages-deployment`: GitLab CI/CD pipeline that publishes a static HTML demo of the example marketplace to GitLab Pages on every push to the default branch.

### Modified Capabilities

<!-- None: no existing spec-level behavior is changing -->

## Impact

- New files: `LICENSE`, `CONTRIBUTING.md`, `CHANGELOG.md`, `.gitlab-ci.yml`, `public/` (static output for Pages)
- Modified files: `README.md` (full rewrite in English)
- No breaking changes to `server.js` or the plugin format
- GitLab Pages requires a `public/` artifact; the static demo must be self-contained HTML (no Node.js runtime)
