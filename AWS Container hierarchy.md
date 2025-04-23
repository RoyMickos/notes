In AWS there are numerous services that support containers. Here is a classificaiton of these based on the (AWS decision guide)[https://aws.amazon.com/getting-started/decision-guides/containers-on-aws-how-to-choose/].
There are only two ways to run containers: either EC2 instances or Fargate, which allows you to operate on container level and let AWS worry on provisioning of the EC2 instances.
Next, there is the orchestration levell. You can use three primary orchestrators:
1. Elastic Container Service helps manage the number of container instances
2. Elastic Kubernetes Services uses kubernetes for managing the containers
3. ROSA is Red-Hat technology hosted on AWS. This is primarily for lift-and-shift of there from on-prem to cloud.
ECS requires that you set up the EC2 instances on top of which EKS deploys container workloads. With Fargate, you don't need to manage EC2 instances, fargate does this for you. In this respect, Fargate is akin to Cloud Run in GCP.
Above the orchestrators, you have apps to further simplify container-based deployments:
1. AWS App Runner is the most simplified and straightforward option to take a piece of source and have it running as an App.
2. Elastic Beanstalk has standard blueprints for web apps and workers, typically involving load balancer and a autoscaling grout on EC2 for web and SQS queue in place of the load balancer for workers. However, containers is one supported tech in Beanstalk, so you could run web apps or workers from containsers.
#aws