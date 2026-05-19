# post-merge hook

Runs automatically after a successful `git merge` or `git pull`. Handles housekeeping tasks that should happen whenever the working tree receives new commits from another branch or remote.

## Actions performed

1. **Dependency sync** — detects changes to dependency manifests and triggers the appropriate install command
2. **Cache invalidation** — removes stale build artefacts when source files have changed in ways that could make them invalid
3. **Database migration check** — warns if new migration files were pulled in that have not been applied
4. **Environment file check** — alerts if `.env.example` changed but the local `.env` was not updated

## Dependency detection

The hook compares the merged `HEAD` against `ORIG_HEAD` to detect changes:

| Changed file | Action |
|---|---|
| `package-lock.json` / `yarn.lock` | `npm ci` / `yarn install --frozen-lockfile` |
| `pom.xml` | `mvn dependency:resolve -q` |
| `requirements.txt` / `pyproject.toml` | `pip install -r requirements.txt` |
| `composer.lock` | `composer install` |
| `go.sum` | `go mod download` |

## Output example

```
[post-merge] Detected changes in package-lock.json
[post-merge] Running: npm ci
[post-merge] Dependencies updated successfully.
[post-merge] ⚠ New migration files detected: 20240315_add_user_roles.sql
[post-merge]   Run: ./scripts/migrate.sh
```

## Configuration

```yaml
post-merge:
  install-deps: true
  invalidate-cache: true
  check-migrations: true
  migration-dir: db/migrations
  check-env: true
  env-example: .env.example
```

## Notes

- This hook does not run on rebase; use `post-rewrite` for that scenario
- Long-running install commands run asynchronously by default and print a completion notice when done
