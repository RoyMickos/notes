2023-03-03
Tags:

---
# Postgres tricks

## Finding out if there are running transactions

```sql
select * 
from pg_stat_activity
where (state = 'idle in transaction')
    and xact_start is not null;
```
- requires postgres >= 9.2
- officially list idle connections with uncommitted transactions

## Postgres settings

Postgres settings are found in a database view named `pg_settings`. This can be queried like any database:

```
select name, setting, unit from pg_settings;
```

## Removing roles
You must revoke privileges from the role before you can remove it, because there are entries in the pg_catalog descibing those privileges which refer to the role. Postgres will not allow removal before these have been cleared.

### Listing privileges of a role
I could not get my psql to read pg_catalog schema. The easiest way is to try to remove the role using `DROP ROLE <role_name>`. It will complain, as it refuses to remove the role if that role has granted privileges, which need to be removed first. If the error message mentions about a specific database, then connect to that database and retry the role removal; you will get a list of most tables where this role has privileges. Then simply remove them using `REVOKE ALL ON table_name FROM role_name;`.

It seems that not all tables are reliably listed; attempting to drop role again will bing up any tables that may have been missed in the first listing.

---
## References
1. 
