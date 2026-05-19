# /test

Runs the project test suite with coverage reporting. Supports filtering by file pattern, test name, or suite type.

## Usage

```
/test
/test unit
/test integration
/test src/api/users/
/test --watch
```

## Arguments

| Argument | Description |
|---|---|
| `[suite]` | Test suite to run: `unit`, `integration`, `e2e`, or omit to run all |
| `[path]` | Narrow tests to a specific file or directory |
| `--watch` | Re-run affected tests on file change |
| `--coverage` | Generate a coverage report (default: true for CI) |
| `--bail` | Stop after the first failure |

## Test suites

| Suite | Runner | Description |
|---|---|---|
| `unit` | Vitest / Jest | Fast isolated tests, no I/O |
| `integration` | Vitest / Jest | Tests with real DB and services via Testcontainers |
| `e2e` | Playwright | Browser-level end-to-end tests |

## Output

```
[test] Running unit tests...
  ✓ UserService > creates a user (12ms)
  ✓ UserService > rejects duplicate email (8ms)
  ✓ NotificationService > sends welcome email (5ms)
  ...
  47 passed, 0 failed (1.4s)

[test] Coverage: 84.2% statements, 79.6% branches
[test] Coverage report written to coverage/
```

## Notes

- Integration tests require Docker to be running (Testcontainers spins up databases automatically)
- E2E tests require the application to be running; start it first with `/build` and `npm start`
