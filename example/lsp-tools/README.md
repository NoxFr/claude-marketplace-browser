# lsp-tools

LSP server integration plugin that enables static analysis and intelligent code assistance for TypeScript, JavaScript, and Python directly within the Claude Code workflow.

## What it does

This plugin configures three language servers — `typescript-language-server` for TypeScript and JavaScript, `eslint-lsp` for style and quality linting, and `pylsp` for Python. Together they provide diagnostics, hover information, go-to-definition, and refactoring capabilities that Claude can leverage when analysing or modifying code.

## When to use it

Use this plugin on any project where you want Claude to have live access to compiler diagnostics and linter output rather than relying solely on static file analysis. It is especially helpful for large TypeScript codebases where type errors and import resolution are critical to generating correct code changes.
