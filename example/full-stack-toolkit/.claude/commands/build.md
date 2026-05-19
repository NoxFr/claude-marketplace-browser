# /build

Triggers the full build pipeline for the project, including compilation, asset bundling, and Docker image creation. Reports build output and any errors.

## Usage

```
/build
/build staging
/build production --no-cache
```

## Arguments

| Argument | Description |
|---|---|
| `[target]` | Build profile to use: `development` (default), `staging`, or `production` |
| `--no-cache` | Disable Docker layer cache for a clean build |
| `--service <name>` | Build only a specific service instead of all services |

## Build steps

1. Install or verify dependencies (`npm ci`)
2. Run TypeScript compilation (`tsc --noEmit` for type checking)
3. Bundle frontend assets (`npm run build:client`)
4. Compile backend (`npm run build:server`)
5. Build Docker images for each service
6. Run smoke tests against built artefacts

## Output

```
[build] Installing dependencies... done (2.1s)
[build] Type checking... done (4.3s)
[build] Bundling frontend... done (12.7s)
[build] Compiling backend... done (3.1s)
[build] Building Docker images...
  api:abc1234 done
  worker:abc1234 done
[build] Build successful in 24.8s
```

## Failure handling

On failure, the command prints the error output from the failing step and exits. The `--verbose` flag streams all output in real time rather than buffering it.
