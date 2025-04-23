2022-04-12

# SQL Injections

1. If the queries are not parametrized, you can simply run whatever query using the credentials of the app. Just close quotes and append your query.
2. If SQL error messages are displayed on the screen, you can play around with malformed queries to get information presented in the error message.
3. Even if you don't show any error message or the like on the screen, you may play around with e.g. sort orderint to test for one bit of information.

Automated tools, like [sqlmap](https://sqlmap.org/) exists for automating the process. Any security audit worth it's money should at least do the level 1 (non-mutable) checks.

https://example.com/?page_name='; insert into users (name,username,password) values ('new', 'new', 'password'); select ''='

