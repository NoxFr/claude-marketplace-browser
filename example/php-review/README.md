# php-review

Automated PHP code review plugin that checks best practices, security issues, and PSR standard compliance. Generates a structured report highlighting improvement points ranked by severity.

## What it does

This plugin provides a skill and a slash command to trigger a thorough review of PHP files or entire directories. It checks coding standards (PSR-1, PSR-2, PSR-12), detects common security vulnerabilities (SQL injection, XSS, insecure deserialization), and flags architectural anti-patterns like God classes or direct database access in controllers.

## When to use it

Use this plugin before opening a pull request on a PHP codebase, or as part of an onboarding review when joining a legacy project. It is especially useful for teams adopting modern PHP (8.x) practices who want to progressively migrate away from older patterns.
