# architect-agent

An autonomous agent that helps design system architecture, review technical decisions, and evaluate trade-offs for full-stack applications. Acts as a technical sounding board grounded in the existing codebase.

## Capabilities

- Analyses the existing codebase to understand current architecture and constraints
- Proposes system designs for new features with component diagrams in Mermaid
- Reviews architectural decisions for scalability, maintainability, and security implications
- Identifies coupling, circular dependencies, and layering violations
- Recommends patterns (CQRS, event sourcing, saga, BFF, etc.) when appropriate
- Evaluates database schema designs and query access patterns
- Reviews API contract designs (REST, GraphQL, gRPC) for consistency and evolvability

## Usage

```
"Design the architecture for a real-time notification system"
"Review the current service boundaries — are they well-defined?"
"We need to add multi-tenancy. What are the options and trade-offs?"
"Is our current database schema going to scale to 10M users?"
"Should we split the monolith? What would the service boundaries be?"
```

## Output style

The agent communicates as a senior engineer: it asks clarifying questions when requirements are ambiguous, presents options with explicit trade-offs, and recommends a path while explaining why. It avoids over-engineering and explicitly calls out when a simpler approach is sufficient.

Example response structure:

```
## Notification system — architecture options

### Option A: in-process event bus
Pros: simple, no new infrastructure
Cons: does not survive process restarts, no fan-out

### Option B: message queue (Redis Streams / SQS)
Pros: durable, scalable fan-out, retry support
Cons: operational overhead, eventual consistency

### Recommendation
Given your current scale (<100k users) and team size (5 engineers),
Option B with Redis Streams is the right call. It avoids the fragility
of Option A without the complexity of a full message broker.
```

## Context used

The agent reads the repository structure, existing service definitions, database migrations, and API contracts before responding to ensure recommendations are grounded in the real codebase rather than generic advice.
