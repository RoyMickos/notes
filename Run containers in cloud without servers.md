#cloud-omnibus 
Contenders here are:
- AWS Fargate
- Azure Container Instances
- Azure App Service with Custom Containers
- GCP App Engine Flexible

All of these allow running container workloads without having to set up virtual servers to run them. The platform provisions these resources for you. Azure ACI is different in that it does not offer orchestration, which is required by Fargate, so it is better for one-shot workloads like CI runners. ACI has manual scaling and ephemeral instances. Fargate uses Elastic Container Service or Elastic Kubernetes Service for orchestration.

Google App Engine Flex and Azure App Service are more App centric. You implement your app in as a containerized workload, and the platform handles the rest. Note that Azure App Service supports docker-compose, so that you can run multiple containers with the same life cycle.
AWS Fargate also supports this and they use task definitions to achieve the job. Likewise, Azure Container Instances lets you define container groups. This way of running multiple containers is termed **sidecars** as they all share the same life cycle.

If you want to run these containers independently, you get into kubernetes land. You could also use these services similarly, but the each individual service is deployed individually on these cloud platforms and connected by some means.