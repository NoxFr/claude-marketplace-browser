# eslint-lsp

LSP server that exposes ESLint diagnostics and code actions through the Language Server Protocol. Provides real-time linting feedback for JavaScript and TypeScript files as they are edited.

## Installation prerequisite

```bash
npm install -g eslint @microsoft/eslint-language-service
# or use the project-local ESLint if already installed
```

## Capabilities provided

| Capability | Description |
|---|---|
| Diagnostics | ESLint rule violations with severity (error/warning) |
| Code actions | Auto-fix for fixable rule violations |
| Formatting | Apply `--fix` to a file or selection |

## Configuration

The server picks up `.eslintrc.*`, `eslint.config.js` (flat config), or the `eslintConfig` key in `package.json` from the workspace root. Standard ESLint configuration applies:

```js
// eslint.config.js
export default [
  {
    files: ["src/**/*.{js,ts}"],
    rules: {
      "no-unused-vars": "error",
      "no-console": "warn",
      "eqeqeq": ["error", "always"]
    }
  }
];
```

## Plugin settings

```json
{
  "eslint-lsp": {
    "run": "onType",
    "workingDirectory": "${workspaceFolder}",
    "nodePath": null,
    "validate": ["javascript", "typescript"]
  }
}
```

## Notes

- When both `typescript-language-server` and `eslint-lsp` are active, TypeScript diagnostics and ESLint diagnostics are merged into a single diagnostic stream
- Rules that require type information (e.g., `@typescript-eslint/no-floating-promises`) require `parserOptions.project` to point to your `tsconfig.json`
