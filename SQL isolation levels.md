2023-02-16
Tags:

---
# SQL isolation levels

Serializable locks the whole table, allowing only one access at a time. Problem with multiple user scenarios.

Repeatable read locks only the rows read by the transaction, so multiple users can access at the same time. However, process may add new lines.
(assuming that the addition is not preceded by a read to the locked lines).

Happened in project: Serializable was used which destroyed the performance of the DB. Our use cases were such that they all started
with reading the previous data, so that they were put on the wait before that previous transaction was completed.

In PostgreSQL, if a violation to the isolation level is found, this leads to the failure of the transaction and it has to be retried.
Thus, if two transactions are run in different isolation levels, it does not mean that the weaker transaction gets promoted to
a higher level. Thus, some critical use cases can be run at higher isolation level as long as there is a retry.

---
## References
1.
