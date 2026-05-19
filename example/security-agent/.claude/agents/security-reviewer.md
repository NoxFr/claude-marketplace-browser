# security-reviewer

An autonomous agent that performs static security analysis on source code. It scans files for vulnerability patterns, hardcoded secrets, insecure configurations, and dangerous API usage across multiple languages.

## Capabilities

- Detects OWASP Top 10 vulnerability patterns in application code
- Identifies hardcoded passwords, API keys, and private keys using entropy analysis and regex patterns
- Flags insecure cryptographic primitives (MD5, SHA1, DES, ECB mode)
- Detects unsafe deserialization, path traversal, and command injection sinks
- Reviews authentication and authorisation logic for common bypasses
- Checks HTTP headers and cookie configuration for security misconfigurations

## Supported languages

- Java, Kotlin
- Python
- JavaScript, TypeScript
- PHP
- Go
- Ruby

## Usage

Invoke the agent with a description of what to review:

```
"Run the security-reviewer agent on the authentication module"
"Security review of src/api/ before the v2 release"
"Check the new payment integration for vulnerabilities"
```

## Output

The agent produces a structured security report:

```
## Security Review — authentication module

### High severity
- Hardcoded JWT secret in src/auth/config.js:12
- Missing rate limiting on /api/login endpoint

### Medium severity
- Session token not invalidated on logout (src/auth/SessionService.java:88)

### Informational
- Consider adding security headers middleware (CSP, HSTS, X-Frame-Options)
```

## Configuration

The agent respects a `.securityignore` file at the project root to exclude paths (test fixtures, generated code, etc.) from analysis.

```
# .securityignore
test/fixtures/
generated/
vendor/
```
