# /php-review

Slash command that triggers a PHP code review on a specified path. Accepts a file path, directory, or glob pattern as its argument and delegates to the `php-review` skill.

## Usage

```
/php-review <path>
/php-review src/Controller/UserController.php
/php-review src/Service/
/php-review src/**/*.php
```

## Arguments

| Argument | Description |
|----------|-------------|
| `<path>` | File, directory, or glob pattern to review. Defaults to the current working directory if omitted. |

## Examples

Review a single controller:
```
/php-review src/Controller/OrderController.php
```

Review all service classes:
```
/php-review src/Service/
```

Review the whole project source:
```
/php-review src/
```

## Behaviour

1. Resolves the path relative to the project root
2. Collects all `.php` files matching the argument
3. Runs the `php-review` skill on each file
4. Aggregates results into a single report grouped by severity
5. Prints a summary line: `X critical, Y warnings, Z suggestions`

## Notes

- Large directories may take a moment to process
- Binary or generated PHP files (e.g., compiled Blade templates) are skipped automatically
- Use the `php-review` skill directly for more control over scope filters
