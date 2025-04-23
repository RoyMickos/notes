Two-phase commits are used with _distribured transactions_ where several databases need to be co-ordinate; that is, a transaction is at the system level and multiple participants are needed. This requires a _protocol_ to handle the execution of the transaction at system level. The protocol, in turn, stipulates that there needs to be a lead node that orchestrates the execution of the protocol.

PostgreSQL does support two-phase commits, but it does not have support for the protocol and orchestration. You will need to use an external transaction co-ordinator.

Incidentally, _Spanner_ is one of the ways manage distributed transactions and is the basis of google's CloudSpanner product.

[Wikipedia](https://en.wikipedia.org/wiki/Two-phase_commit_protocol)