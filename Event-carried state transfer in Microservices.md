
In a microservice context, a service owns it's data. Whenever some other service needs to know the state of affairs in data owned by another service, we have been issued a request for the owning service to get the data. However, this method is what is known as a remote query. 

An alternative is a `local query` where a view to the other service's data is held locally at the requesting service.

How is this possible? The idea is that all services advertise changes to the data models they own through events. The receivers can then use these events to build a local view of the remote service's data. This is called `event-carried state transfer`. This is related to the `change capture streams` of databases, where all changes to the models are captured and transferred as a stream.

This of course has the issues of eventual consistency and the dangers of data drift. But it scales better in large systems that always initiating a remote query. Note that this is not gospel, there are use cases for both local and remote queries.

There's also the reliability dimention. With remote query, the availability of service A is dependent on service b, and both are needed to produce a result to a request. With local query, service A can tolerate some outages of service B thus providing better overall reliability.

#microservices 