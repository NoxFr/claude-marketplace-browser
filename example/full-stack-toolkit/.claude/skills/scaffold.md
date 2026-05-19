# scaffold

Generates project structure, boilerplate files, and configuration for new features or entire new services following the team's conventions.

## Usage

```
"Scaffold a new REST endpoint for user notifications"
"Create a new React feature module for the checkout flow"
"Scaffold a new microservice for email delivery"
"Add a new database entity for subscription plans"
```

## What can be scaffolded

### Backend (Node.js / TypeScript)
- REST endpoint: controller, service, repository, DTO, tests
- GraphQL resolver with schema type, resolver, and data source
- Background job / queue consumer
- New microservice with Dockerfile, CI config, and health endpoint

### Frontend (React / Vue)
- Feature module: component, hook, context, styles, and test
- Page with route registration
- Form with validation schema
- Data-fetching hook with error boundary

### Shared
- Database migration file with up/down functions
- OpenAPI schema entry
- Environment variable declarations in `.env.example`

## Conventions applied

- File and folder naming follows the project's existing pattern (detected automatically)
- Imports use the project's configured path aliases
- Test files are placed alongside source files or in the `__tests__` directory, whichever the project uses
- Generated code passes the project's linter and formatter without modification

## Example output

```
Scaffolding REST endpoint: GET /api/notifications

Created:
  src/api/notifications/notifications.controller.ts
  src/api/notifications/notifications.service.ts
  src/api/notifications/notifications.repository.ts
  src/api/notifications/dto/notification.dto.ts
  src/api/notifications/__tests__/notifications.controller.spec.ts
  db/migrations/20240315_create_notifications_table.ts
```
