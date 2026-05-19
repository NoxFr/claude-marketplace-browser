## ADDED Requirements

### Requirement: GitLab CI pipeline
The project SHALL include a `.gitlab-ci.yml` that defines a `pages` job running on pushes to the default branch.

#### Scenario: Pipeline triggers on default branch push
- **WHEN** a commit is pushed to the default branch
- **THEN** the GitLab CI pipeline SHALL run and the `pages` job SHALL execute

#### Scenario: Pipeline artifact published
- **WHEN** the `pages` job completes successfully
- **THEN** `dist/` SHALL be moved to `public/` and uploaded as a GitLab Pages artifact accessible at the project's Pages URL

### Requirement: Static snapshot build script
The project SHALL use `scripts/build.js` to generate a self-contained static HTML representation of the example marketplace. The GitLab CI pipeline SHALL move the resulting `dist/` output into `public/` to satisfy GitLab Pages artifact requirements.

#### Scenario: Build script generates index page
- **WHEN** `node scripts/build.js` is executed
- **THEN** `dist/index.html` SHALL exist and contain rendered HTML of the marketplace homepage

#### Scenario: Build script generates plugin detail pages
- **WHEN** `node scripts/build.js` is executed
- **THEN** for each plugin in the example marketplace, a corresponding HTML file SHALL be generated under `dist/plugins/`

#### Scenario: Build output is self-contained
- **WHEN** `dist/index.html` is opened in a browser without a running server
- **THEN** the page SHALL render correctly with styles and static assets included

### Requirement: Demo banner
The static Pages site SHALL display a banner informing visitors that it is a read-only demo and dynamic interactions require the local server.

#### Scenario: Banner visible on Pages
- **WHEN** a visitor opens the GitLab Pages URL
- **THEN** a visible banner or notice SHALL state that the page is a static demo and link to the repository for full usage

### Requirement: No runtime dependency for Pages
The static output in `public/` SHALL not require a Node.js server or any backend to render correctly.

#### Scenario: Serve from any static host
- **WHEN** the `public/` directory is served by any static file server (nginx, GitHub Pages, etc.)
- **THEN** the demo SHALL display the example marketplace without errors
