# git-hooks-suite

A collection of Git hooks that automate and enforce workflow conventions at key points in the Git lifecycle. Covers commit validation, pre-commit quality gates, and post-merge notifications.

## What it does

This plugin installs three hooks: `pre-commit` runs linting and formatting checks before a commit is recorded; `commit-msg` validates that the commit message follows the configured convention (Conventional Commits by default); `post-merge` triggers dependency installation and cache invalidation after a merge or pull.

## When to use it

Use this plugin to enforce consistent commit history and prevent broken code from entering the repository. It is particularly useful for teams onboarding new contributors or for projects that feed commit messages into automated changelogs and release tooling.
