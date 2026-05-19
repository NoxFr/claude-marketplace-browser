# git-mcp

MCP server that exposes Git repository data to Claude. Provides access to commit history, diffs, branches, tags, and blame information without requiring shell command execution.

## Capabilities

| Tool | Description |
|---|---|
| `git_log` | List commits with author, date, and message; supports range and path filters |
| `git_diff` | Show diff between two refs, or between working tree and HEAD |
| `git_show` | Show the full content and diff of a specific commit |
| `git_blame` | Line-by-line attribution for a file |
| `git_branches` | List local and remote branches with their HEAD commits |
| `git_tags` | List tags with their associated commits and messages |
| `git_status` | Show working tree status (staged, unstaged, untracked) |
| `git_stash_list` | List stashed changesets |

## Usage examples

```
"Show me the last 10 commits that touched src/api/users/"
"What changed between v2.3.0 and v2.4.0?"
"Who last modified the payment service and when?"
"What commits are on this branch that aren't on main yet?"
"Show me the full diff for commit abc1234"
```

## Configuration

The server operates on the current workspace root by default. For monorepos with multiple Git repositories, specify the target:

```json
{
  "git-mcp": {
    "workspaceRoot": "${workspaceFolder}",
    "maxLogEntries": 500,
    "diffContextLines": 5
  }
}
```

## Notes

- Read-only: no write operations (commit, push, reset) are exposed
- Binary file diffs are summarised as "binary file changed" rather than shown inline
- Commit messages and diffs are truncated at 50KB per entry to avoid context overflow
