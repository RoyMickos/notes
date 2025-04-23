# Google cloud indentity

This is used when you want to use google account as your only authentication method.
This has the advantage that if you already use a google identity in e.g. browser profile,
that identity can be reused in your app.

# Google identity platform (firebase)

Google got this when they brougth firebase. Here, you build an authentication platform where
you can specify several identity providers to get the identity of the user. This is an authentication
app that provides help with password resets etc.

Google identity platform has the advantage of providing an id token that can be validated on the
server. Thus your app is relieved from having to generate tokens.

# Identity Aware Proxy

This is a service that works in the google cloud front-end machines together with the load balancer.
When you enable it, it creates a OAuth client id and secret, so it holds the app identity. It also
automatically directs users to the OAuth authentication flow is the authentication is not correct.

This serviced also provides authorazation using Cloud IAM. The incoming user needs to have a
`IAP-secured web app user` role in order to be granted access to the service that he IAP protects.
