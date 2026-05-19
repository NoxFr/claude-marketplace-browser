# commit-msg hook

Validates commit messages against a configurable convention before the commit is finalised. Rejects commits that do not conform and prints a helpful error message with the expected format.

## Default convention: Conventional Commits

The hook enforces the [Conventional Commits](https://www.conventionalcommits.org/) specification by default:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Allowed types

`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

### Examples of valid messages

```
feat(auth): add OAuth2 login flow
fix: prevent race condition in cache invalidation
docs: update API reference for v3 endpoints
refactor(payment): extract card validation to ValueObject
```

### Examples of rejected messages

```
WIP                          ← no type prefix
Fix bug                      ← type not lowercase, missing colon
feat : add feature           ← space before colon
FEAT(auth): something        ← type must be lowercase
```

## Error output

When a message is rejected, the hook prints:

```
[commit-msg] Commit message does not follow Conventional Commits format.

Expected: <type>[optional scope]: <short description>
Got:      "Fix bug in login"

Allowed types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
```

## Configuration

```yaml
commit-msg:
  convention: conventional-commits   # "conventional-commits" | "custom" | false
  min-length: 10
  max-length: 100
  require-scope: false
  custom-pattern: ""   # regex, used when convention is "custom"
```

## Bypassing

```bash
git commit --no-verify
```

Bypass is discouraged for this hook since it directly affects changelog generation.
