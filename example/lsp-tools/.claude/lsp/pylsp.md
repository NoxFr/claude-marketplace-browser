# pylsp

LSP server for Python based on the Python Language Server Protocol implementation. Provides diagnostics, hover, completion, and formatting for Python projects.

## Installation prerequisite

```bash
pip install python-lsp-server[all]
# or with specific plugins only:
pip install python-lsp-server pylsp-mypy python-lsp-black pylsp-rope
```

## Capabilities provided

| Capability | Description |
|---|---|
| Diagnostics | Syntax errors, undefined names, unused imports (via pyflakes) |
| Type checking | Optional Mypy integration for static type errors |
| Hover | Type signatures and docstrings |
| Go to definition | Navigate to symbol declaration |
| Find references | List all usages |
| Rename | Symbol rename across the project |
| Formatting | Black or autopep8 on save or on demand |
| Code actions | Auto-import, remove unused imports |

## Configuration

pylsp reads `pyproject.toml` or `.pylsp.toml`:

```toml
[tool.pylsp]
plugins.pyflakes.enabled = true
plugins.pylsp_mypy.enabled = true
plugins.pylsp_mypy.strict = false
plugins.black.enabled = true
plugins.autopep8.enabled = false
plugins.rope_autoimport.enabled = true
```

## Virtual environment support

The server uses whichever Python interpreter is active when it starts. For projects with a virtualenv, activate it first:

```bash
source .venv/bin/activate
# or use direnv / pyenv-virtualenv for automatic activation
```

## Plugin settings

```json
{
  "pylsp": {
    "plugins": {
      "pylsp_mypy": { "enabled": true, "dmypy": false },
      "black": { "enabled": true },
      "flake8": { "enabled": false }
    }
  }
}
```

## Notes

- Mypy integration significantly increases analysis time on first run; subsequent runs use a cache
- For monorepos with multiple packages, set `rootPath` to the specific package directory rather than the repo root
