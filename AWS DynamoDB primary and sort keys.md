DynamoDB is a key-value store. A key to identify *items* in a *table* is called the primary key, which can either be a plain *hash* key  or a composite key comprising of the hash and a *sort* key. While the dynamodb is schemaless, each item in a table must have the primary key.
The dynamics of the hash-sort keys is that the hash key still identifies a single logical record of data, which can be thought of as one big object, but the sort key further divides that big object into entites that can be queried independently. For example, a hash key might identify a user, and the sort keys are then used to group documents related to the user for differing purposes, for example notes, projects, messages etc. In effect, this is to work around the single-table limitation, by embedding data into a single table that in a relational database would reside in another table.
Another key aspect of the hash-sort key dynamics is expressing one-to-many relationships. As in above, one user has many notes, and you might want to be able to query for individual notes that a user owns.

Note that it is entirely feasible to have multiple tables in DynamoDB, but there are no relations between them, each table needs to be queried separately.

[[AWS DynamDB query vs scan]]

#aws #nosql