# mongodb-mcp

MCP server for MongoDB. Enables schema discovery, collection exploration, and aggregation pipeline execution through the Model Context Protocol.

## Connection

```
MONGODB_URI=mongodb://readonly_user:secret@localhost:27017/myapp?authSource=admin
MONGODB_DB=myapp
```

For Atlas:

```
MONGODB_URI=mongodb+srv://readonly_user:secret@cluster0.example.mongodb.net/myapp
```

## Exposed tools

| Tool | Description |
|---|---|
| `list_collections` | List collections with document counts and storage size |
| `sample_documents` | Return a random sample of documents from a collection |
| `infer_schema` | Analyse a sample of documents and infer the field schema |
| `run_find` | Execute a `find()` query with optional filter, projection, and sort |
| `run_aggregate` | Execute an aggregation pipeline |
| `explain_query` | Return the query plan for a find or aggregate operation |
| `list_indexes` | List indexes on a collection |

## Usage examples

```
"What collections are in the database and how many documents does each have?"
"Show me a few example documents from the events collection"
"What fields does the users collection typically contain?"
"Find all orders with status 'pending' created in the last 7 days"
"Count sign-ups per day for the past month"
```

## Safety

- Write operations (insert, update, delete, drop) are rejected
- Aggregation pipelines with `$out` or `$merge` stages are blocked
- `run_find` results are limited to 200 documents
- Operations time out after 15 seconds

## Configuration

```json
{
  "mongodb-mcp": {
    "maxDocuments": 200,
    "sampleSize": 100,
    "queryTimeout": 15000,
    "readPreference": "secondaryPreferred"
  }
}
```

## Notes

- Schema inference uses a sample of up to 100 documents and may not capture all optional fields in large heterogeneous collections
- For Atlas Search indexes, use `list_indexes` and look for indexes of type `search`
