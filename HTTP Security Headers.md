Case study from adding those to an AWS cloudfront distribution. In this case, the cloudfront distribution was backed by a S3 bucket, so we needed cloudfront to add these headers, which control what the browser can or cannot do with the code bundle it loads.

## Content security policy
[MDN Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP)
This is basically configuration like this:
```
default-src 'self'; 
script-src 'self' https://www.google-analytics.com; 
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
font-src 'self' https://fonts.gstatic.com; 
img-src 'self' data:; 
connect-src 'self';
```
This describes where the browser may load data related to this bundle. `default-src` tells where it can download bundles with the `index.html`, `script-src` tells where `<script>` tags can point, etc. Note that `connect-src` here is not complete for a bundle from cloudfront, since at least the backend API URL needs to be added here. Also, many libraries, for example the microsoft authentication library (MSAL) require `unsafe-eval` to the script declaration. These come with the `Content-Security-Policy` header.

## Strict transport security
[MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Strict-Transport-Security)
With `Strinct-Transport-Security` we can enforce `https` requests. It has a max-age and settings to enforce.

## Referrer policy
[MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Referrer-Policy)
Tells what information the browser puts in the `referer` header.

## Content type options
The header is `X-Content-Type-Options`. [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Content-Type-Options)
This is used to tell the browser to respect `Content-Type` setting and not to deviate from it.

## X-Frame-Options
Tells the browser which sites can embed this content in an `iframe` or equivalent. [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Frame-Options)

## Usage
Content security policy is tailored per application, while the others have well-known defaults to use. See for example this [AWS Default](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-managed-response-headers-policies.html)
Note that [[CORS]] is also considered a security header setting.