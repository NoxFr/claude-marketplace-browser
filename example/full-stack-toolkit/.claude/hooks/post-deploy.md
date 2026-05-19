# post-deploy hook

Runs automatically after a successful deployment. Performs smoke testing, cache warming, and notifications so the team knows the deployment succeeded and the service is healthy.

## Actions performed

1. **Smoke tests** — sends a set of HTTP requests to key endpoints and verifies expected responses
2. **Cache warming** — pre-fetches high-traffic pages or primes application-level caches
3. **Database migration check** — verifies that pending migrations were applied successfully
4. **Notification** — posts a deployment summary to the configured Slack channel or webhook
5. **Monitoring alert suspension** — pauses deployment noise alerts in PagerDuty / Grafana for 5 minutes

## Smoke test configuration

Define smoke tests in `deploy/smoke-tests.json`:

```json
[
  { "path": "/health", "expect": { "status": 200, "body": { "status": "ok" } } },
  { "path": "/api/version", "expect": { "status": 200 } },
  { "path": "/api/products", "expect": { "status": 200, "maxMs": 500 } }
]
```

## Notification format

```
Deployed api@abc1234 to production
  3/3 smoke tests passed
  Response time p95: 142ms
  Deployed by: mathieu.durand
  Duration: 3m 12s
```

## Configuration

```yaml
post-deploy:
  smoke-tests: deploy/smoke-tests.json
  warm-cache: true
  notify:
    slack:
      webhook: ${SLACK_DEPLOY_WEBHOOK}
      channel: "#deployments"
  monitoring:
    suppress-alerts: 5m
    provider: grafana
```

## Failure handling

If smoke tests fail, the hook:
1. Triggers automatic rollback via the `deploy` skill
2. Posts a failure notification with the failing test details
3. Re-enables monitoring alerts immediately

## Notes

- The hook runs in the context of the deployment pipeline, not on the developer's machine
- Environment-specific configuration is selected based on the `DEPLOY_ENV` variable set by the `deploy` skill
