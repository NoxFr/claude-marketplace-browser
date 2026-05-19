# php-review

Performs a comprehensive code review of PHP files, checking for security issues, PSR compliance, and architectural quality. Produces a prioritised list of findings with explanations and suggested fixes.

## Usage

```
Trigger this skill by describing what you want reviewed:
"Review the PHP files in src/Controller"
"Check this PHP class for security issues"
"Audit the entire src/ directory for PSR-12 compliance"
```

## What is checked

### Security
- SQL injection via string concatenation in queries
- Cross-site scripting (unescaped output)
- Insecure use of `eval()`, `exec()`, `shell_exec()`
- Hardcoded credentials or API keys
- Insecure deserialization with `unserialize()`
- Missing CSRF protection on state-changing endpoints

### Code Quality
- PSR-1, PSR-2, PSR-12 naming and formatting conventions
- Proper use of type declarations (parameter types, return types, property types)
- Nullable types and union types consistency (PHP 8.x)
- Dead code, unused variables, unused imports

### Architecture
- Fat controllers — business logic that belongs in services
- Direct database access outside repository classes
- Circular dependencies between namespaces
- Missing interfaces for injectable services

## Output format

The skill produces a report structured as:

```
## PHP Review — src/Controller/UserController.php

### Critical
- [SEC-001] Potential SQL injection at line 42: ...

### Warnings
- [PSR-012] Method name does not follow camelCase convention at line 17

### Suggestions
- [ARCH-003] Consider extracting email validation to a dedicated ValueObject
```

## Configuration

You can focus the review by specifying a scope in your request:
- `security` — only report security findings
- `psr` — only report PSR standard violations
- `architecture` — only report structural concerns
- `all` (default) — full report
