#cloud-omnibus
# AWS
AWS has accounts, that can be grouped into an organisation. Each account has it's own IAM users (groups, roles, policies). It is a best practice to restrict an account for a single purpose and not mix them (e.g. separate accounts for development and production etc). Cross-account access requires explicit setup. Billing is per account, but you can consolidate billing using organizations.

# Azure
Azure has subscriptions. Subscriptions live under an Azure Active Directory (AAD) tenant, which manages user identities globally. One can have multiple subscriptions under one AAD tenant. Thus with Azure, identity management is separate from subscriptions. For example, Vincit as a company has one AAD, under which subscriptions for various purposes, like compdev, can be established. Active Directory has been rebranded as Microsoft Entra ID.