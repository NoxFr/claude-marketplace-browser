# typescript-language-server

LSP server for TypeScript and JavaScript projects. Provides full type-checking diagnostics, symbol resolution, and refactoring support powered by the TypeScript compiler service.

## Installation prerequisite

The language server binary must be available on `PATH`:

```bash
npm install -g typescript typescript-language-server
```

## Capabilities provided

| Capability | Description |
|---|---|
| Diagnostics | Type errors, missing imports, unused variables |
| Hover | Type information and JSDoc for any symbol |
| Go to definition | Navigate to the declaration of any symbol |
| Find references | List all usages of a symbol across the project |
| Rename | Safe rename across all files in the project |
| Code actions | Quick fixes, auto-imports, organise imports |
| Inlay hints | Inline parameter names and inferred types |
| Completion | Context-aware symbol and keyword suggestions |

## Configuration

The server reads `tsconfig.json` from the project root. Ensure your `tsconfig.json` includes the files you want to analyse:

```json
{
  "compilerOptions": {
    "strict": true,
    "moduleResolution": "bundler",
    "target": "ES2022"
  },
  "include": ["src/**/*"]
}
```

## Plugin settings

```json
{
  "typescript-language-server": {
    "tsserverPath": "node_modules/.bin/tsserver",
    "preferences": {
      "includeInlayParameterNameHints": "all",
      "includeInlayReturnTypeHints": true
    }
  }
}
```

## Notes

- JavaScript projects are supported via `allowJs: true` in `tsconfig.json` or via `jsconfig.json`
- Performance scales with project size; for very large monorepos, consider scoping `tsconfig.json` to the relevant package
