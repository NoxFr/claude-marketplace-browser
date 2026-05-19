# mcp-database

MCP server plugin providing natural-language access to relational and document databases. Supports PostgreSQL, MySQL, and MongoDB with automatic schema introspection and query generation.

## What it does

This plugin exposes three MCP servers — `postgres-mcp`, `mysql-mcp`, and `mongodb-mcp` — that Claude can use to inspect database schemas, run read queries, and explain query execution plans. Each server authenticates with the database using credentials from the environment and presents the schema as a set of tools and resources.

## When to use it

Use this plugin when working on a project that involves database-heavy features and you want to query live data, understand an unfamiliar schema, or generate and validate SQL/aggregation queries without leaving the editor. It is also useful for debugging data issues or generating test fixtures from real schema shapes.
