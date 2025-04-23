#aws 
AWS sam cli is the fastest way to running a development environment locally. It can emulate lambda environments (running docker images) and lambdas behind api gateway. This allows you to test functions by http.
Alternatively, if you don't want to use http, you can use sam to locally run the lambda only. In that case, you use aws cli to invoke it, using --endpoint to point to your local instance.
SAM is not capable of emulating step functions. For this you need to download a docker image that can run step functions, start it, then again use standard aws commands to point to the local step functions instance.
You can run local step functions instance witht the sam lambda instance together as described [here](https://docs.aws.amazon.com/step-functions/latest/dg/sfn-local-lambda.html).

---
References
[Terraform lambda support](https://registry.terraform.io/modules/terraform-aws-modules/lambda/aws/latest)
[AWS step functions guide](https://docs.aws.amazon.com/step-functions/latest/dg/sfn-local.html)