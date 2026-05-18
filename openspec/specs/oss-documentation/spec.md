## ADDED Requirements

### Requirement: English README
The project SHALL provide a comprehensive English-language README covering installation, usage, configuration, and the marketplace format.

#### Scenario: Developer lands on the repo
- **WHEN** a developer visits the repository root
- **THEN** they SHALL find a README.md in English with sections: Overview, Installation, Usage, Configuration, Marketplace Format, Contributing, License

#### Scenario: README describes all CLI options
- **WHEN** a developer reads the README
- **THEN** they SHALL find documentation for the `--marketplace` CLI flag and `MARKETPLACE_PATH` env var

### Requirement: MIT License
The project SHALL include a LICENSE file containing the full MIT license text with the correct copyright holder.

#### Scenario: License file present
- **WHEN** the repository is cloned
- **THEN** a `LICENSE` file SHALL exist at the root with valid MIT license text

### Requirement: Contributing guide
The project SHALL include a CONTRIBUTING.md that explains how to set up the dev environment, the contribution workflow, and code standards.

#### Scenario: New contributor setup
- **WHEN** a contributor reads CONTRIBUTING.md
- **THEN** they SHALL find: prerequisites, `git clone` + `npm install` steps, how to run the dev server, and how to submit a merge request

#### Scenario: Contribution workflow documented
- **WHEN** a contributor wants to submit a change
- **THEN** CONTRIBUTING.md SHALL describe branch naming, commit message format (Conventional Commits), and MR process

### Requirement: Changelog
The project SHALL include a CHANGELOG.md following Keep a Changelog format, recording notable changes per version.

#### Scenario: Initial changelog entry
- **WHEN** the changelog is read
- **THEN** it SHALL contain at least one entry documenting the initial release and the OSS/Pages additions
