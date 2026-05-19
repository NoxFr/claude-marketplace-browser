# pre-commit hook

Runs quality checks on staged files before recording a commit. The hook aborts the commit if any check fails, printing a clear explanation of what needs to be fixed.

## Checks performed

1. **Linting** — runs the project's configured linter (ESLint, Pylint, PHP_CodeSniffer, Checkstyle) on staged files only
2. **Formatting** — verifies that staged files conform to the project formatter (Prettier, Black, gofmt) without modifying them
3. **Secret detection** — scans for patterns that look like API keys, tokens, or private keys
4. **Test smoke check** — if a test file corresponding to a staged source file exists, runs that test in isolation

## Behaviour

- Only staged files are checked (not the whole working tree)
- The hook is skipped automatically on merge commits and rebase operations
- Exit code 0 allows the commit to proceed; any non-zero exit aborts it

## Bypassing (emergency use only)

```bash
git commit --no-verify -m "emergency fix"
```

Use `--no-verify` only when absolutely necessary. Bypasses are logged to `.git/hooks-bypass.log` with timestamp and author.

## Configuration

Create a `.pre-commit-config.yml` at the project root to customise checks:

```yaml
pre-commit:
  skip-patterns:
    - "generated/**"
    - "*.min.js"
  lint: true
  format: check   # "check" (fail if wrong) | "fix" (auto-fix and re-stage) | false
  secrets: true
  tests: false    # set true to enable smoke tests
```

## Troubleshooting

If the hook runs slowly, enable the `staged-only` optimisation (on by default) and ensure your linter supports `--stdin-filename` for per-file invocation rather than whole-project scans.
