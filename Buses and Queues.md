A queue and a bus are not the same thing. A queue is a memory store for events in order, but they are point-to-point. In AWS SQS, there is no fan-out; you need to use AWS SNS (simple notification service) for this.

An event bus like AWS Event Bridge (or NATS or Kafka) provides fan-out in that events on the bus can have multiple subscribers. Events may or may not be delivered in order, as is the case of SQS. An event bus acts more like a publis-subscribe, it has an internal queue but it is time-constrained. Events are remembered even if they are consumed for this time period (note that in [[EventBridge]], event storage is an opt-in feature). In a queue there is no time contraint, but consuming an event from the queue removes it from the queue.

#aws #SQS #EventBridge