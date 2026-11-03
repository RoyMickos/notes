# Postgres advisory locks

Advisory locks are application-defined locks in PostgreSQL. Postgres does not tie them to any table or row and never takes them by itself. The application decides what a lock key means, and every participant must agree to take the lock before doing the protected work. This makes them a cheap way to get a cluster-wide mutex when several app instances already share one database.

See also [[postgres tricks]].

## Keys

A lock is identified either by one `bigint` or by two `int4` values. To lock on a string, such as `token-refresh-<userId>`, hash it to a number:

```sql
SELECT pg_advisory_xact_lock(hashtextextended('token-refresh-' || $1, 0));
```

`hashtextextended` (Postgres 11+) returns a `bigint`. `hashtext` returns an `int4` and so collides more easily. A collision only means two unrelated keys occasionally wait for each other, which is harmless for most uses.

## Session vs transaction level

| | Session level | Transaction level |
| --- | --- | --- |
| Take (blocking) | `pg_advisory_lock(key)` | `pg_advisory_xact_lock(key)` |
| Take (non-blocking) | `pg_try_advisory_lock(key)` | `pg_try_advisory_xact_lock(key)` |
| Release | `pg_advisory_unlock(key)` or session end | Automatically at commit or rollback |

There are also shared variants (`pg_advisory_lock_shared` etc.) for reader/writer patterns.

Prefer **transaction-level** locks. They cannot leak: if the code crashes or forgets to unlock, the lock goes away with the transaction. Session-level locks are re-entrant (taking one twice needs two unlocks) and stay held until explicitly released on the same connection.

## Connection pools

Session-level locks belong to a database connection, not to a request. With a connection pool, the lock and the unlock must run on the same connection, or the lock stays held by whichever request gets the connection next. With PgBouncer in transaction pooling mode, session-level locks do not work reliably at all. Transaction-level locks avoid both problems.

## Blocking vs try-and-retry

`pg_advisory_xact_lock` waits until the lock is free, holding a connection the whole time. `pg_try_advisory_xact_lock` returns `true` or `false` immediately, so the application can retry with a backoff (for example 5 attempts with a 200 ms base delay) and give up with an error instead of piling up waiting connections. Setting `lock_timeout` also limits how long a blocking call waits.

## Pattern: one refresh at a time (double-checked locking)

A common use is refreshing a cached credential, such as a per-user access token, when several requests or instances may notice at the same time that it is about to expire:

1. Read the cache. If the value is still valid, use it. No lock needed.
2. Otherwise begin a transaction and take the advisory lock for that key.
3. **Read the cache again.** Another instance may have refreshed it while this one waited.
4. If it is still missing or expiring, fetch a new value and upsert it.
5. Commit, which releases the lock.

```sql
BEGIN;
SELECT pg_advisory_xact_lock(hashtextextended('token-refresh-' || $1, 0));
SELECT access_token, expires_at FROM token_cache WHERE user_id = $1;
-- if still expiring: fetch a new token in application code, then
INSERT INTO token_cache (user_id, access_token, expires_at)
VALUES ($1, $2, $3)
ON CONFLICT (user_id) DO UPDATE
  SET access_token = EXCLUDED.access_token, expires_at = EXCLUDED.expires_at;
COMMIT;
```

The second check is what makes this work. Without it, every waiting request would still mint its own token once it got the lock.

Holding a transaction open during an external HTTP call ties up a connection, so keep the call short and set a timeout. [[Salesforce delegated authentication]] uses this pattern to refresh Salesforce access tokens per user.

## Inspecting locks

```sql
SELECT pid, classid, objid, granted
FROM pg_locks
WHERE locktype = 'advisory';
```

For a single `bigint` key, the high 32 bits appear in `classid` and the low 32 bits in `objid`.

## References

1. [PostgreSQL docs: Advisory locks](https://www.postgresql.org/docs/current/explicit-locking.html#ADVISORY-LOCKS)
2. [PostgreSQL docs: Advisory lock functions](https://www.postgresql.org/docs/current/functions-admin.html#FUNCTIONS-ADVISORY-LOCKS)
