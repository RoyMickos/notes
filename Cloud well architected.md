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

The priciples are applicable to other providers as well.

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

---
## References
1. [AWS well architected](https://aws.amazon.com/architecture/well-architected/?wa-lens-whitepapers.sort-by=item.additionalFields.sortDate&wa-lens-whitepapers.sort-order=desc&wa-guidance-whitepapers.sort-by=item.additionalFields.sortDate&wa-guidance-whitepapers.sort-order=desc)
2. [Using multiple accounts in AWS](https://docs.aws.amazon.com/whitepapers/latest/organizing-your-aws-environment/organizing-your-aws-environment.html)
3. [AWS architecture center](https://aws.amazon.com/architecture/?cards-all.sort-by=item.additionalFields.sortDate&cards-all.sort-order=desc&awsf.content-type=*all&awsf.methodology=*all&awsf.tech-category=*all&awsf.industries=*all&awsf.business-category=*all)
4. [Google well archietected](https://cloud.google.com/architecture/framework)
