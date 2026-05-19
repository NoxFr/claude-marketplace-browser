# deploy

Orchestrates the full deployment pipeline for a full-stack application. Builds artefacts, runs pre-deployment checks, pushes to the target environment, and reports the outcome.

## Usage

```
"Deploy the current branch to staging"
"Deploy version 2.4.1 to production with a canary rollout"
"Deploy only the backend service to staging"
```

## Deployment targets

The skill reads target definitions from `deploy.config.json` at the project root:

```json
{
  "targets": {
    "staging": {
      "provider": "aws",
      "region": "eu-west-1",
      "cluster": "staging-ecs",
      "services": ["api", "worker", "frontend"]
    },
    "production": {
      "provider": "aws",
      "region": "eu-west-1",
      "cluster": "prod-ecs",
      "services": ["api", "worker", "frontend"],
      "strategy": "canary",
      "canaryWeight": 10
    }
  }
}
```

## Deployment steps

1. Run `npm run build` (or the configured build command)
2. Execute the test suite and abort on failure
3. Build and push Docker images tagged with the commit SHA
4. Update the target service definition
5. Wait for the health check to pass
6. Print the deployment URL and service versions

## Rollback

If the health check fails after deployment, the skill automatically rolls back to the previous task definition and reports the failure:

```
Deployment failed — health check timeout after 120s
Rolled back api service to revision 47
```

## Supported providers

- AWS ECS / Fargate
- Google Cloud Run
- Heroku
- Fly.io
- Custom (via deploy script hook)
