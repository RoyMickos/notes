Cognito provides user authentication for your apps. It can either authenticate by itself or use external identity providers, the usual suspects (google, facebook etc).

For app usage, you can define user pools. User pools are either users signing up directly on cognito, or from external IDP:s. You can define groups within your pool. If you have your own web application whose back-end is running in AWS, then user pools is all you need. Your app is running under an service IAM role that as the necessary credentials to access other AWS resources that your app needs.

Identity pools are tied directly to either IAM roles or attributes defined as tags on aws end. So an identity pool token gives temporary access to assume a IAM role defined for it. Otherwise, it can use attrbute-based tokens to access e.g. certain S3 bucket objects with a matching tag.

#aws 