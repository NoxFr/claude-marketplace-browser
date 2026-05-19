# security-agent

Autonomous security analysis plugin that performs in-depth vulnerability audits on source code and project dependencies. Designed to run as part of a CI pipeline or on-demand before releases.

## What it does

This plugin ships two autonomous agents: `security-reviewer` scans source code for vulnerabilities, secrets, and insecure patterns; `dependency-auditor` cross-references your dependency manifests against known CVE databases and flags outdated or compromised packages.

## When to use it

Run this plugin before any production release, after adding new third-party dependencies, or whenever a new CVE is disclosed for a technology your project uses. It is also useful during security audits or penetration testing preparation to surface low-hanging fruit before engaging an external team.
