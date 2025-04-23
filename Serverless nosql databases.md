#cloud-omnibus 
Contenders are
- AWS DynamoDB
- Azure CosmosDB
- GCP Firebase

These are all non-relational databases. The key concept is a _paritiion key_ which is used to distribure data across partitions that are served by different database instances. AWS hides these partitions from the users, but places requirements on how to choose the partition key to avoid hot partitions. In Azure the same applies but the partitions are called containers and are visible in the data model. The same considerations for the partition key remain.  AWS allows optionally to define a sort key that can be used to sort items hitting the same partition. Both AWS and Azure allow for defining a TTL for the items so that they are automatically erased after they have expired.
Azure also offers different "front-ends" for the base database: Mongo, Cassandra, and Gremlin