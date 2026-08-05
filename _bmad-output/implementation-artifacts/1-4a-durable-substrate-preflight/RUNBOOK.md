# Story 1.4a durable-substrate preflight runbook

This kit reruns the disposable proof without retaining credentials or a live route. It is for the approved Jagwar non-production Supabase project and a disposable Vercel custom environment named `preflight`. It must never target Vercel Production, a customer database, or a real provider.

## Immutable safety gates

1. Confirm the writable repository, branch, HEAD, pinned Onlook commit, remote push policy, tool versions, and dirty work before mutation.
2. Confirm Supabase project ref `moknfpotrlbqktpqxlqf` remains explicitly approved non-production and reports `ACTIVE_HEALTHY` in `us-west-2`.
3. Create or verify a Vercel custom environment whose API response is `{"slug":"preflight","type":"preview"}`. Do not use the built-in `preview` value with Vercel CLI 54.7.0; it was misclassified as Production in this environment.
4. Deploy with Vercel CLI 56.5.0 or later and `--target=preflight`. Before sending a request, require both `vercel list`/`vercel inspect` to report environment/target `preflight` and the deployment OIDC claim to report `environment:preflight`. If any check differs, delete the deployment and stop.
5. Generate the HMAC value in memory. Substitute it into `hosted-setup.sql` and pass it to the deployment without printing it, placing it in a command transcript, saving substituted SQL, or writing it to a file.
6. The temporary route additionally fails closed unless `VERCEL_TARGET_ENV=preflight` and `JAGWAR_PREFLIGHT_ENABLED=true`.
7. Never generate or inspect a Vercel automation-bypass credential. The qualifying run used a dedicated custom environment, temporarily disabled Vercel Authentication only while the HMAC-gated route existed, then restored protection.

## Retained inputs

- `signature.ts` and `signature.test.ts`: constant-time HMAC verification and local signature matrix.
- `route.ts.template`: bounded Next.js Node route template; copy beside `signature.ts` only for the disposable deployment.
- `local-proof.sql` / `local-cleanup.sql`: local logged queue and real-login authorization proof.
- `hosted-setup.sql` / `hosted-cleanup.sql`: hosted disposable objects, least-privilege functions, Vault credential, and signed `pg_net` dispatch.
- `EVIDENCE.md`: redacted result matrix from the qualifying run.

## Exact command sequence

Commands containing `<IN_MEMORY_...>` are executed by an orchestrator that injects values without echoing them. Do not paste literal credentials into a terminal transcript.

```sh
date -u +'%Y-%m-%dT%H:%M:%SZ'
git rev-parse --show-toplevel
git branch --show-current
git rev-parse HEAD
git rev-parse origin/bmad/jagwar-foundation-bootstrap
git rev-parse 423e2e924366419e418ee049093872d535eea41a
git remote -v
bun --version
bunx supabase --version
docker version --format '{{.Client.Version}}/{{.Server.Version}}'
bunx --bun vercel@56.5.0 --version
bun test _bmad-output/implementation-artifacts/1-4a-durable-substrate-preflight/signature.test.ts
```

Local database and actual worker login:

```sh
docker exec -i supabase_db_onlook-web psql -U postgres -d postgres \
  < _bmad-output/implementation-artifacts/1-4a-durable-substrate-preflight/local-proof.sql
docker exec supabase_db_onlook-web psql -U postgres -d postgres \
  -c "alter role jagwar_preflight_worker password '<IN_MEMORY_WORKER_PASSWORD>'"
docker exec -e PGPASSWORD='<IN_MEMORY_WORKER_PASSWORD>' supabase_db_onlook-web \
  psql 'host=127.0.0.1 port=5432 dbname=postgres user=jagwar_preflight_worker connect_timeout=5' \
  -Atc 'select current_user, session_user, jagwar_preflight_private.worker_assertions()'
```

For the local Data API request, obtain the local API URL and publishable key from `bunx supabase status --workdir apps/backend -o env` in memory, then send a request to `/rest/v1/jagwar_preflight_absent?select=*` with `Accept-Profile: pgmq`. A modern publishable key is supplied only as `apikey`; a legacy JWT is also supplied as `Authorization: Bearer`. Required result: HTTP 406, `PGRST106`, exposed schemas excluding `pgmq`.

Hosted setup is executed through the project-scoped Supabase MCP `execute_sql` tool. Read `hosted-setup.sql`, replace `__HMAC_SECRET__` in memory, and submit the resulting SQL without emitting it. Query `pg_available_extensions` immediately afterward to bind exercised behavior to exact installed versions.

The hosted worker password is assigned in memory. Connect through `aws-1-us-west-2.pooler.supabase.com:5432` as `jagwar_preflight_worker.<PROJECT_REF>` and invoke `jagwar_preflight_private.worker_assertions()`. The result must show the actual session user is the worker, `claimComplete=true`, and every deny assertion `true`.

Create a Vercel `preflight` custom environment through `POST /v9/projects/<project>/custom-environments`, require `type=preview`, temporarily place the retained template at `apps/web/client/src/app/api/internal/preflight/durable-substrate/`, and deploy:

```sh
bunx --bun vercel@56.5.0 deploy \
  --target=preflight \
  --regions iad1 \
  --yes \
  --build-env SKIP_ENV_VALIDATION=1 \
  --env JAGWAR_PREFLIGHT_ENABLED=true \
  --env JAGWAR_PREFLIGHT_HMAC_SECRET='<IN_MEMORY_HMAC_SECRET>' \
  --env NEXT_PUBLIC_SUPABASE_URL='<APPROVED_PUBLIC_URL>' \
  --env NEXT_PUBLIC_SUPABASE_ANON_KEY='<APPROVED_PUBLIC_KEY>' \
  --env CSB_API_KEY=preflight-disabled \
  --env SUPABASE_DATABASE_URL=postgresql://preflight.invalid/jagwar \
  --env SUPABASE_SERVICE_ROLE_KEY=preflight-disabled \
  --env OPENROUTER_API_KEY=preflight-disabled
bunx --bun vercel@56.5.0 list jagwar --scope andrew-simics-projects
bunx --bun vercel@56.5.0 inspect '<DEPLOYMENT_URL>' --scope andrew-simics-projects
```

The server placeholders only satisfy inherited build/runtime validation; the preflight route cannot call those providers. The route uses only the approved public Supabase URL/key and the disposable HMAC credential.

Run the signed matrix using `timestamp.nonce.exactBody` HMAC-SHA256: missing, malformed, stale by 61 seconds, future by 30 seconds, body tamper, invalid signature, valid, replay, rotated current, and rotated retired. Truncate only the disposable nonce/work tables before the negative matrix; afterward they must remain `0/0`. The valid/replay pair must produce `1/1`, and the retired key must produce no work row.

For the caller-timeout proof, call:

```sql
select jagwar_preflight_private.dispatch_signed(
  '<PREFLIGHT_ROUTE_URL>',
  '{"traceId":"pgnet-timeout-proof","workMs":1800}'::jsonb
);
```

`dispatch_signed` fixes `timeout_milliseconds := 9000`; require `net._http_response.status_code=200`, `timed_out=false`, and one matching work row. Schedule the same function through `cron.schedule(..., '10 seconds', ...)`, observe at least one correlated HTTP 200/work row, and unschedule immediately.

For the retry proof, claim with visibility 60, call `pgmq.set_vt(queue, msg_id, selected_backoff)`, prove immediate invisibility, wait past the selected backoff, then require `read_ct=2`. Production code must set the visibility explicitly for each `5s`, `15s`, or `30s` retry; it may not rely on the initial claim window.

For the bounded-load proof, run 20 signed invocations in ten sequential waves of two, each with `workMs=1800`. Require only HTTP 200 responses, actual compute `iad1`, and p95 route time below the adopted six-second wall clock.

## Adopted Story 1.4b entry budgets

| Budget | Value | Invariant / evidence basis |
| --- | ---: | --- |
| Claim batch | 2 | One wave at concurrency 2; no three-wave overflow. |
| Worker concurrency | 2 | Qualifying load ran ten sequential two-request waves with no failures. |
| Outbound request timeout | 2s | Bounded work is capped at 2s; the route retains 4s for database calls and cleanup. |
| Route wall clock | 6s | 2.5x the measured 2.367s route p95 and 4s below `maxDuration=10`. |
| `pg_net` timeout | 9s | 3s above the route wall clock and 1s below the provider duration ceiling. |
| Queue claim visibility | 60s | 10x route wall clock and 2x the operation lease. |
| Operation lease / renewal | 30s / 15s | At least five route budgets; renewal at half-life. |
| Retry backoff | 5s, 15s, 30s | Every retry explicitly calls `set_vt`; maximum is half the normal visibility. |
| Attempt ceiling | 4 | Initial attempt plus three bounded delays; exhausted work moves to dead-letter/reconciliation. |
| Accepted timestamp | past 60s / future 5s | Both boundaries are explicitly rejected outside the window. |
| Clock-drift reserve | 5s | Included in nonce-retention invariant. |
| Nonce retention | 600s | Exceeds `60 + 5 + 5` by 530 seconds. |

These are entry budgets, not customer-facing allowances or final provider limits. Story 1.4b must enforce them as constants with deterministic boundary tests and may tighten them without an AD-6 amendment. Broadening them requires new measured evidence.

## Cleanup

1. Unschedule the Cron job before removing the route.
2. Remove every disposable Vercel deployment, restore `ssoProtection.deploymentType=all_except_custom_domains`, and delete the `preflight` custom environment.
3. Execute `hosted-cleanup.sql` through Supabase MCP and `local-cleanup.sql` through local `psql`.
4. Delete the temporary app-route copy while retaining this kit.
5. Require: no Vercel deployments, aliases, automation bypass, custom environment, or preflight-only environment variables; no hosted/local preflight schema, role, queue, job, secret, nonce, or work row; hosted `pgmq`, `pg_cron`, and `pg_net` restored to absent and Vault retained at 0.3.1.

