****# AWS developer certificate, spring 2024

Check Anki deck for details. Here are other notes.

To check out:
- Security groups vs IAM policies. In the demo, security groups were used to provide access from ec2 to rds. However, with
  S3, IAM roles were used.
  - security groups are virtual firewalls, there is a corresponding concept in gcp. they act on network level
  - iam roles are per service, and are usually associated with an API call
  - since a connection to a database happens directly using an IP address and a port, the security group is the way to secure
    the connection to a database
  Systems manager parameter store is integrated with the secrets manager. Secret manager's primary function is to rotate secrets

Cloud Front has now capability of running functions in addition to defining a defaulf file to return in case of cache miss. It also has capability to process header data for cache decisions.

## Lambda
Lambda has been viewed as "just the controller function" of a web service, but this view is a bit off.  AWS documentation makes a point that lambdas are _event-driven_ , not _request-driven_. In other words, a more precise view of the lambda framework would be "a giant event bus".

Request-driven also associates with a controller requesting services from service modules, further making requests to other services usually via new requests. These could be replaced with events, but where do you draw the line, should everything be events and no requests? Domain-driven design answers that events should flow between _bounded contexts_ - independent entities identified in system design.

Based on this view, lambda functions should possess the attributes of event-driven systems: idempotency. Lambdas should not be used as orchestrators, you should use Step Functions for this. Step functions are to be used within a bounded context, and EventBridge to handle orchestration across several bounded contexts.

Since the lambdas work with event-driven paradigm, there is no request-response cycle.  However, a lambda function can return a response, which is available for the API Gateway, which can forward this response.

To study: SNS simple notification service and SQS simple queue service acts as message busses/queues between bounded contects, and EventBridge - and event classification and filtering service. Using so many components sounds clumsy though, compared to things like Jetstream. Also, RDS proxy is  useful with lambdas as it prevents database connection flooding when lambdas scale beyond connections.

It is possible to configure API Gateway to write requests directly to an SQS queue without using a lambda function. Instead, lambda functions can be configured to respond to SQS events instead. In this scenario, you can additionally configure lambda to consume several SQS messages in one go.

AWS X-Ray, a debugging and monitoring service for logs produced by several microservices for a  transaction.

### Practice exam holes
ElasticCache can rank and sort results - new to me, needs review
Lambda `/tmp` has 512 default size. Also, if lambda reuses the environment, the init phase is not run for successive invocations.
CloudFront terminology, cloud front options
configuring lambda to access a private vpc, security issues
one cannot encrypt an AMI, encryption is done as part of the copy operation
code build test action
retry and backpff in dynamoDb
sqs long/short polling

Reviewing AWS developer material:
what AWS SDKs can do for you: dynamoDb, RDS, S3 etc
Lambda concurrency
[[Testing serverless functions]]
[[ AWS Glue vs Kinesis vs Dataproc]]
[[AWS Account setup]]
[[Local development of lambda and step functions]]
codePipeline
code deploy templates

katso privabrowserin tesien viereiset tabit. tee ennemmin aws: kokeita kuin acg:n



---
### References
1. [AWS Serverless land guide](https://serverlessland.com/content/service/lambda/guides/aws-lambda-operator-guide/intro)