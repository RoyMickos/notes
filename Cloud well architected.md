2023-03-02
Tags:

---
# Cloud well architected
Both AWS and GCP have roughly equal core pillars:
1. Operational excellence
2. Security (GCP adds privacy and compliance)
3. Reliability
4. Performance efficiency
5. Cost optimization
6. Sustainability

## AWS

AWS has a "well-architected" concept that brings best practices in the cloud. Basically automate and test everything. They have a bunch of "Lens" whitepapers that go deeper in to problem verticals. They also have a well-architected tool that can be used, and their partner network provide reviews of the well-architected concept.

Some of these have been observed in our YTK project, where we have run into some surprising problems when our design did not cope with production volumes. So measurement and metrics allow for fact-based descisions and improvements. We have a fairly good baseline automation, but it has not been maintained nor polished after it's initial conception. So we need to complete the "innovation circle": build, measure, adapt.

The principles are applicable to other providers as well.
[Last week in AWS](https://www.lastweekinaws.com/)

## GCP

Scalability
Resilience - responding to failures in the system itself (fault-tolerance)

Optimize resources, improve quality and availability, user experience through sre, evolving
Automation again, new word "toil" stards for routine, repetitive, automatable tasks

3 major questions
1. what is the background of the company/business
2. where is the company/business going to ?
3. what's next

Data lifecycle
- a way to look at the cloud services
1. ingest
  - streaming: cloud pub/sub
  - batch: cloud storage, storage transfer service, big query transfer service, storage transfer appliance
  - generated: Cloud logging, cloud pub/sub, cloud sql, cloud firestore, cloud bigtable, cloud spanner
2. store
  - blobs: Cloud storage, cloud storage for firebase
  - databases: Cloud sql, cloud spanner, cloud bigtable, cloud firestore (cloud datastore)
  - warehouse: big query
3. process/analyze
  - compute: compute engine, kubernetes engine, app engine, cloud run (not mentioned, although it is replacing app engine!)
  - large-scale: cloud dataproc, cloud dataflow, cloud dataprep
  - analysis: big query
4. explore/visualize
  - exploring: cloud datalab (jupyter notebooks)
  - visualizing: big query BI, cloud data studio, looker

Idea for the next sections is to be a kind of "index" to all cloud stuff through the well-architected perspective. Idea is to use this framework as a reference for why some tool or technology is important.
# Operational excellence
### Data-based decisions and automation
| Google              | AWS |
| ------------------- | --- |
| Cloud Monitoring    |     |
| Cloud observability |     |
| Big Query           |     |
### React to incidents and problems
| Google              | AWS |
| ------------------- | --- |
| Cloud Run           |     |
| Cloud Run Functions |     |
| EventArc            |     |
### Use your data to improve and innovate
In addition to reacting based on your data, you can also use it for longer-term improvements. These don't have any cloud tools associated with them, they are rather policies, conventions and cultural aspects:
- Continuous learning
- Keep up-to date on cloud offerings
- Experimentation, blameless culture
- Retrospectives
- Feedback
### Manage and optimize resources / cost
| Google           | AWS |
| ---------------- | --- |
| Cloud Monitoring |     |
| Recommender      |     |
| Cloud Billing    |     |
### Manage change & automate
| Google            | AWS       |
| ----------------- | --------- |
| Terraform         | Terraform |
| Cloud Build       |           |
| Cloud Deploy      |           |
| Puppet            | Puppet    |
| Chef              | Chef      |
| Ansible           | Ansible   |
| Artifact Registry |           |
# Security, privacy and compliance
[Summary of GCP tools related to this](https://cloud.google.com/architecture/framework/security#focus_areas_of_cloud_security)
[The cloud controls matrix](https://cloudsecurityalliance.org/research/cloud-controls-matrix/#)
[OWASP Application threat modeling](https://owasp.org/www-community/Threat_Modeling_Process)
Secure your data in transit and in storage. Use indentity and access management to control access to data. Use secure infrastructure. Monitor security data like metrics and logs and establish security responses. Add Audit and vpc logs to your logging. Design security in your apps.
A way to view the security flow: [[Overall security view of an app.excalidraw]]
### Security by design
Tools:
Snyk
Github Dependabot

| Google                     | AWS |
| -------------------------- | --- |
| Assured oss (Python, Java) |     |
#### VMs
| Google            | AWS |
| ----------------- | --- |
| OS Login          |     |
| Shielded VM       |     |
| Confidential VM   |     |
| Virtual TPM       |     |
| Curated OS Images |     |
#### Containers
| Google                 | AWS |
| ---------------------- | --- |
| Container optimized OS |     |
| Distroless images      |     |
#### Data encryption
| Google                      | AWS |
| --------------------------- | --- |
| Cloud KMS                   |     |
| Cloud Interconnect (MACSec) |     |
| Cloud VPN (IPSec)           |     |
| APIGee TLS/mTLS             |     |
| Cloud Service Mesh          |     |
### Zero Trust
#### Network

| Google                       | AWS |
| ---------------------------- | --- |
| Identity aware proxy         |     |
| Chrome enterprise            |     |
| Cloud interconnect           |     |
| Cloud VPN                    |     |
| Private service connect      |     |
| Cloud Service Mesh Egress GW |     |
| Shared VPC                   |     |
| VPC Service Controls         |     |
| Cloud Armor                  |     |
#### Explicit verification
| Google                              | AWS     |
| ----------------------------------- | ------- |
| Cloud Identity                      | Cognito |
| Workload Identity Federation        |         |
| Google Security Operations (SecOps) |         |
| Security Command Center             |         |
### Monitor your network
| Google                                  | AWS |
| --------------------------------------- | --- |
| Network Analyzer                        |     |
| Web Security Scanner                    |     |
| Cloud Intrusion Detection Service (IDS) |     |
| Cloud NextGen Firewall NGFW             |     |
| Google SecOps                           |     |
#### Shift-left security
"Pushing security into development process"
Guardrails for your organizational setup on cloud. These are resource/network constraits you can set in your cloud organisation, that prevent accidental misconfiguration.

| Google                                | AWS             |
| ------------------------------------- | --------------- |
| Resource Manager                      |                 |
| VPC Service Controls                  |                 |
| Privileged Access Manager             |                 |
| 8<---8<---8<---8<---                  | 8<---8<---8<--- |
| Cloud Build                           |                 |
| Cloud Deploy                          |                 |
| Binary Authorization                  |                 |
| Web Security Scanner                  |                 |
| Artifact Registry / Artifact analyzer |                 |
### Pre-emptive cyber defence
| Google                      | AWS |
| --------------------------- | --- |
| Google SecOps               |     |
| Security Command Center     |     |
| Network Intelligence Center |     |
### Secure AI
| Google              | AWS |
| ------------------- | --- |
| Vertex AI           |     |
| BigQuery ML         |     |
| Cloud Logging       |     |
| Cloud Observability |     |
### AI in security
| Google                     | AWS |
| -------------------------- | --- |
| Google Threat Intelligence |     |
| Security Command Center    |     |
| Google SecOps              |     |
### Compliance
| Google                    | AWS |
| ------------------------- | --- |
| Assured Workloads         |     |
| Access Transparency       |     |
| Key Access Justifications |     |
| Google Distributed Cloud  |     |
| Sensitive Data Protection |     |
## Reliability
Measurement: measure as close to the user as possible, simply because these are the metrics that matter most. Ideally on the browser (user consent required). Sentry or similar for in-browser tracking. Cloud solutions work inside the cloud domain.

| Google                      | AWS |
| --------------------------- | --- |
| Cloud trace                 |     |
| Personalized Service Health |     |
Guidelines for regional/zonal divisions:

| Reliability target | Downtime/Month    | Deployment strategy                    |
| ------------------ | ----------------- | -------------------------------------- |
| < 99.9%            | ~72 h             | Single-zone, dev and testing workloads |
| 99.95 - 99.99 %    | ~ 45 min          | Multi-zone                             |
| > 99.99 %          | ~ 4 min (5 nines) | Multi-region                           |
Databases:

| Reliability target | Database strategy                             |
| ------------------ | --------------------------------------------- |
| < 99.95%           | SQL (note this does not factor in migrations) |
| > 99.99%           | SQL with High Availability                    |
| > 99.999%          | NoSQL or CloudSpanner                         |
## Costs

| Google                       | AWS |
| ---------------------------- | --- |
| Billing dashboards (reports) |     |
| BigQuery                     |     |
|                              |     |

## AI
A bit of background learning required to understand the material, like data artifacts and features.
**Features**: this is a thing for traditional ML training. Think linear regression style. Each feature is a measurement or input given to the model, and one (or perhaps more) feature is then predicted based on the rest. In traditional ML, data engineers work with the training data to create features that best correlate with the features to be predicted. Any reference to features means that traditional ML is used.
**LLM fine tuning**: LLM fine tuning is implicit based on textual input. You use "shots" or examples of input-output pairs that you use in fine-tuning the model.

| Google                     | AWS | Notes                                                          |
| -------------------------- | --- | -------------------------------------------------------------- |
| Vertex AI workbench        |     | Jupyter -based AI exploration tool                             |
| Vertex AI Studio           |     | Develop prompts                                                |
| Dataflow                   |     | Data collection                                                |
| Dataproc                   |     | Data collection                                                |
| BigQuery                   |     | Data storage                                                   |
| BigQuery DataFrames        |     | Synthetic data generation                                      |
| TensorFlow Data Validation |     | Data quality scan in BigQuery                                  |
| Vertex AI Custom Training  |     | Training traditional ML models                                 |
| Vertex AI Model Garden     |     | Pre-trained ML models                                          |
| Vertex AI Feature Store    |     | Versioning for feature data                                    |
| Vertex AI Model Registry   |     | Track and manage trained models                                |
| Vertex AI Model Monitoring |     | Track model data drift and production anomalities in ML models |
| Vertex AI Pipelines        |     | ML lifecycle automation ("CI")                                 |
| Vertex AI Experiments      |     | Compare new models to old ones                                 |
| Vertex AI Model evaluation |     | Assess LLM model performance                                   |
AI security flow image: [[Overview of LLM app security.excalidraw]]

## Multi-cloud

| Google                   | AWS |
| ------------------------ | --- |
| Cross-cloud interconnect |     |

## Backlog
- [ ] Re-architecting white paper


---
## References
1. [AWS well architected](https://aws.amazon.com/architecture/well-architected/?wa-lens-whitepapers.sort-by=item.additionalFields.sortDate&wa-lens-whitepapers.sort-order=desc&wa-guidance-whitepapers.sort-by=item.additionalFields.sortDate&wa-guidance-whitepapers.sort-order=desc)
2. [Using multiple accounts in AWS](https://docs.aws.amazon.com/whitepapers/latest/organizing-your-aws-environment/organizing-your-aws-environment.html)
3. [AWS architecture center](https://aws.amazon.com/architecture/?cards-all.sort-by=item.additionalFields.sortDate&cards-all.sort-order=desc&awsf.content-type=*all&awsf.methodology=*all&awsf.tech-category=*all&awsf.industries=*all&awsf.business-category=*all)
4. [Google well archietected](https://cloud.google.com/architecture/framework)
5. [Re-architecting for cloud (google)](https://cloud.google.com/resources/rearchitecting-to-cloud-native?hl=en)
