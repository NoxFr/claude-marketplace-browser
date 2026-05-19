# postgres-mcp

MCP server for PostgreSQL databases. Provides schema introspection, read-only query execution, and explain plan analysis through the Model Context Protocol.

## Connection

Credentials are read from environment variables:

```
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=myapp
POSTGRES_USER=readonly_user
POSTGRES_PASSWORD=secret
POSTGRES_SSL=true
```

Alternatively, provide a connection string:

```
DATABASE_URL=postgresql://readonly_user:secret@localhost:5432/myapp?sslmode=require
```

## Exposed tools

| Tool | Description |
|---|---|
| `list_schemas` | List all schemas in the database |
| `list_tables` | List tables in a given schema with row counts |
| `describe_table` | Full column definitions, constraints, and indexes for a table |
| `run_query` | Execute a read-only SELECT query and return results as JSON |
| `explain_query` | Return the EXPLAIN ANALYZE output for a query |
| `list_functions` | List user-defined functions and stored procedures |

## Usage examples

```
"List all tables in the public schema"
"Show me the columns and constraints on the orders table"
"How many users signed up in the last 30 days?"
"Explain why this query is slow: SELECT * FROM events WHERE user_id = 42"
```

## Safety

- Only read-only operations are permitted (SELECT, EXPLAIN)
- Mutations (INSERT, UPDATE, DELETE, DDL) are rejected at the MCP layer
- Query results are limited to 1000 rows by default to prevent memory issues
- Queries time out after 10 seconds

## Configuration

```json
{
  "postgres-mcp": {
    "maxRows": 1000,
    "queryTimeout": 10000,
    "includeSystemSchemas": false
  }
}
```
