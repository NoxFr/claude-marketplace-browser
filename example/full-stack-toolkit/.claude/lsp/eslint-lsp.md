# eslint-lsp

LSP server that surfaces ESLint diagnostics and auto-fix actions for JavaScript and TypeScript files within the full-stack-toolkit workflow.

## Installation prerequisite

ESLint must be available either locally in the project or globally:

```bash
npm install --save-dev eslint
# or globally:
npm install -g eslint
```

## Capabilities provided

| Capability | Description |
|---|---|
| Diagnostics | Rule violations with error/warning severity |
| Code actions | One-click auto-fix for fixable rules |
| Format on save | Apply `--fix` automatically when a file is saved |

## Integration with the toolkit

Within `full-stack-toolkit`, `eslint-lsp` is complementary to `typescript-language-server` (from the `lsp-tools` plugin if installed). ESLint handles style and quality rules; TypeScript handles type correctness. Both diagnostic streams are merged and presented together.

The `/build` command respects ESLint: the build step runs `eslint src/ --max-warnings 0` and fails if any warnings are present in production build mode.

## Configuration

The server reads the project's ESLint configuration automatically. A recommended baseline for full-stack TypeScript projects:

```js
// eslint.config.js
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-console": "warn"
    }
  }
);
```

## Plugin settings

```json
{
  "eslint-lsp": {
    "run": "onSave",
    "fixOnSave": false,
    "validate": ["javascript", "javascriptreact", "typescript", "typescriptreact"]
  }
}
```

## Notes

- `run: "onType"` provides the fastest feedback but increases CPU usage on large files
- Type-aware lint rules require `parserOptions.project` pointing to your `tsconfig.json`
