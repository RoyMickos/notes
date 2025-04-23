#cloud-omnibus 
# AWS
AWS offers storage as a collection of individual services:
- S3 for object storage
- S3 Storage gateway for NFS/Samba resources
- Elastic File system for NFS resources
- Elastic Block Store for virtual disks for EC2 instances

# Azure
Azure uses a storage account that collects all storage related services together:
- Azure Blobs object storage, like S3
- Files: managed file share
- Elastic SAN
- Azure Queues: messaging store
- Azure Tables: NoSQL store for schemaless storage
- Azure managed disks: Bloxk storage for VMs (same as EBS)
- Azure Container Storage: volumes specificatlly for containers

# Storage tiers and Lifecycle policies
All cloud providers define multiple storage tiers. The idea is that the more you pay for the storage, the less you pay for transfers. So you will have the "normal" storage tier/class (Azure calls this "Hot", AWS "standard") where objects are accessed frequently but with less transfer fees.
Then, you gradually trade access for transfer fees. AWS infrequent access or glacier instant retrieval class for access once per quarter, Azure cool for data that it accessed one every 30 - 90 days, Azure cold storage for data that is accessed once every 90 days (quarter). And then the AWS Glacier Deep archive / Azure archive for data that is accessed once every 180 days.

Lifecycle policies can be defined to automatically transition objects between the tiers. The policies are per-object. The difference is that in AWS policies are defined at the bucket level, whereas in Azure they are at the storage account level.

# Static website hosting
AWS allows static website hosting using `http` protocol only. Azure supports access using `https` but only using azure-managed credentials. In both Azure and AWS you need to use CDN if you want to use your own domain with your own certificates.