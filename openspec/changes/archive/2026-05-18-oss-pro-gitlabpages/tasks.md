## 1. OSS Documentation

- [x] 1.1 Rewrite `README.md` in English with sections: Overview, Installation, Usage, Configuration, Marketplace Format, Contributing, License
- [x] 1.2 Add `LICENSE` file with MIT license text (copyright holder: Liksi)
- [x] 1.3 Add `CONTRIBUTING.md` with prerequisites, dev setup, Conventional Commits workflow, and MR process
- [x] 1.4 Add `CHANGELOG.md` following Keep a Changelog format with an initial entry for v1.0.0

## 2. Static Build Script

- [x] 2.1 Create `scripts/build-static.js` that starts the server on port 3000, waits for it to be ready, and shuts it down after crawling
- [x] 2.2 Crawl the marketplace index (`/`) and each plugin detail page, writing full-page HTML to `public/`
- [x] 2.3 Inline or copy static assets (CSS, vendor JS) into `public/` so the output is self-contained
- [x] 2.4 Inject a visible demo banner into each generated page explaining it is a static read-only demo

## 3. GitLab CI Pipeline

- [x] 3.1 Create `.gitlab-ci.yml` with a `pages` job that runs on the default branch
- [x] 3.2 Configure the job to: install deps (`npm ci`), run `node scripts/build-static.js`, and expose `public/` as the Pages artifact
- [x] 3.3 Add `public` to `.gitignore` so the generated output is not committed

## 4. Verification

- [x] 4.1 Run `node scripts/build-static.js` locally and confirm `public/index.html` renders correctly in a browser
- [x] 4.2 Push to a feature branch, confirm the CI pipeline passes and Pages URL is accessible
- [x] 4.3 Verify README, CONTRIBUTING, and CHANGELOG render correctly on the GitLab project page
