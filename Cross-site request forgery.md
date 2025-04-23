2022-05-15
Tags:

Assuming that the user is logged into site A, while browsing site B, a malicious request on site B targeting site A gets executed with the user's credentials.

---
# Cross-site request forgery
Requires usage of cookies.
```
  <form onsubmit=submit method="post" action="https://example.com/password">
    <label>Please enter new password:
      <input type="password">
    </label>
    <input type="hidden" name="password" value="pwned" id="realpw">
    <button type="submit">Submit</button>
  </form>
```
- visible password field has no name, so it is not sent
- action-attribute specifies a targeted website
- the action is made possible since even through this page was loaded from a different address, the browser includes all cookies from the domain it is sending the request to.
- spa's can add a specific api endpoint for crsf tokens, which can be fetched separately and included in the form
- cookies can use SameSite policy to control how they are included in cross-site requests

# Server-side request forgery

Fooling the server to make requests on your behalf. Especially valuable, if the server is connected to an intranet, so you can bypass protections. All configured urls are a potential security threat.
- always using dedicated libraries for handling url
- never allow redirects
- whitelist known addresses, and because of DNS rebinding, re-validate for every request
- never use the input string for anything else than parsing, sanitize the result with only the parts you need

---
## References
1. [DNS rebinder](https://lock.cmpxchg8b.com/rebinder.html)
2. [ip-address npm package](https://www.npmjs.com/package/ip-address)
