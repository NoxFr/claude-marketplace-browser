# mysql-mcp

MCP server for MySQL and MariaDB databases. Provides schema introspection and safe read-only query execution via the Model Context Protocol.

## Connection

```
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=myapp
MYSQL_USER=readonly_user
MYSQL_PASSWORD=secret
```

Or via DSN:

```
MYSQL_DSN=readonly_user:secret@tcp(localhost:3306)/myapp
```

## Exposed tools

| Tool | Description |
|---|---|
| `list_databases` | List accessible databases on the server |
| `list_tables` | List tables in the current database with engine and row estimate |
| `describe_table` | Column types, keys, and indexes for a table |
| `show_create_table` | Full `SHOW CREATE TABLE` output |
| `run_query` | Execute a SELECT query and return rows as JSON |
| `explain_query` | Return `EXPLAIN FORMAT=JSON` for a query |

## Usage examples

```
"What tables exist in the legacy database?"
"Show me the CREATE TABLE statement for the invoices table"
"Find all orders placed this week with a total above 500"
"Why is this JOIN between customers and orders using a full scan?"
```

## Compatibility

- MySQL 5.7, 8.0, 8.4
- MariaDB 10.6+
- Amazon RDS for MySQL and Aurora MySQL (use `MYSQL_SSL_CA` for RDS certificates)

## Safety

- DDL and DML statements are blocked; only SELECT and EXPLAIN are allowed
- Result sets are capped at 500 rows per query
- Connection pool limited to 5 connections

## Configuration

```json
{
  "mysql-mcp": {
    "maxRows": 500,
    "queryTimeout": 8000,
    "charset": "utf8mb4"
  }
}
```
