You should use a test label. Deploy your function to lambda, then use aws sdk's to check that it has been deployed, and then run tests from a ci machine, for example. This should verify that lambda function integrates with tthe rest of the serverless infra.

[AWS lambda](https://docs.aws.amazon.com/lambda/latest/dg/testing-guide.html)