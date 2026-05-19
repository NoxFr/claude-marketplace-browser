# dependency-auditor

An autonomous agent that audits project dependencies against known vulnerability databases. It parses dependency manifests, resolves transitive dependencies, and reports CVEs with severity scores and remediation advice.

## Capabilities

- Parses `package.json`, `pom.xml`, `build.gradle`, `requirements.txt`, `Gemfile.lock`, `go.mod`, and `composer.json`
- Cross-references declared and transitive dependencies against the NVD (National Vulnerability Database) and GitHub Advisory Database
- Flags packages that have been deprecated, abandoned, or taken over (supply chain risk)
- Detects licence conflicts (e.g., GPL in a proprietary project)
- Suggests minimal-impact upgrade paths to resolve vulnerabilities

## Usage

```
"Audit the dependencies of this project"
"Run dependency-auditor and list all critical CVEs"
"Check if any of our npm packages have known vulnerabilities"
```

## Output format

```
## Dependency Audit — package.json

### Critical CVEs
- lodash@4.17.20 — CVE-2021-23337 (Command Injection) — fix: upgrade to 4.17.21

### High CVEs
- axios@0.21.1 — CVE-2021-3749 (ReDoS) — fix: upgrade to 0.21.4

### Deprecated packages
- request@2.88.2 — no longer maintained since 2020, consider node-fetch or axios

### Licence warnings
- gpl-3.0-licensed-lib@1.0.0 — incompatible with proprietary distribution

### Summary
3 packages with known vulnerabilities (1 critical, 1 high, 1 medium)
2 deprecated packages
1 licence conflict
```

## Remediation workflow

After reporting, the agent can optionally:
1. Generate a `package-upgrades.json` with the minimal required version bumps
2. Apply upgrades automatically when safe (patch-level, non-breaking)
3. Open a summary issue or comment on the current pull request

## Notes

- Transitive dependency resolution may require network access to package registries
- The agent caches advisory data locally for 24 hours to reduce external calls
