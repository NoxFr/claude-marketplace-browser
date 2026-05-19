# pre-push hook

Runs a final quality gate before commits are pushed to the remote repository. Ensures that nothing broken is shared with the rest of the team.

## Checks performed

1. **Full test suite** — runs unit and integration tests (not E2E, which are too slow for a push hook)
2. **Build verification** — confirms the project compiles without errors
3. **Security scan** — quick scan for hardcoded secrets in the commits being pushed
4. **Branch policy** — prevents direct pushes to `main` or `master`; requires a pull request

## Behaviour

The hook receives the list of commits being pushed. It only runs checks relevant to the diff (e.g., if no source files changed, the build step is skipped). This keeps the hook fast for documentation-only pushes.

```
[pre-push] Checking 3 commits for push to origin/feature/checkout-flow
[pre-push] Running tests... 47 passed (1.4s)
[pre-push] Build verification... ok (3.1s)
[pre-push] Secret scan... clean
[pre-push] All checks passed. Pushing.
```

## Branch protection

```yaml
pre-push:
  protected-branches:
    - main
    - master
    - release/*
  allow-force-push: false
```

Attempting to push directly to a protected branch produces:

```
[pre-push] Direct push to 'main' is not allowed.
[pre-push] Open a pull request instead: https://github.com/org/repo/compare/your-branch
```

## Configuration

```yaml
pre-push:
  tests: unit              # "unit" | "all" | false
  build: true
  secret-scan: true
  protected-branches: [main, master]
  skip-for-tags: true      # tags bypass this hook
```

## Bypassing

```bash
git push --no-verify
```

Force-push attempts to protected branches are blocked even with `--no-verify` if the remote has branch protection rules enabled.
