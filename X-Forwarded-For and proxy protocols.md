X-Forwarded-For (XFF) is a http header that records the originator's IP address, along with all the proxies the request has traveled through. By convention, the client IP is first in the XFF array, and proxies follow.

This header is set by a proxy, it is not set by the client. Also, the proxy must be L7 proxy, as L4 does not process http. A proxy always adds the address of the previous sender of the package.

Logging client IP is a security feature for services. By logging the source IP of incoming requests, one can potentially build defences against flooding attacks. It also servers as forensic data when analying access logs.
#### Network Proxy
A netowork proxy operates at TCP/UDP level. These proxies can be configured to be transparent, so that they do not touch the source IP address. This is desirable if the network proxy is the outermost proxy and you do not want to lose the client IP information.

#### Edge and internal proxies
An Edge L7 proxy is special because it has the task of initialising xff with the client's address. Conversely, there are some proxies, like service mesh proxies, which we do not want to touch the xff header.
For example. traefik which is configured to be "normal" proxy operates by default so that if an incoming request does not have an XFF, it creates one and adds the client IP to the list. Otherwise, it just appends it's own address to the XFF list.
Conversely, Envoy proxy which is has features related to service meshes, has a lot of logic to determine internall addresses that are not recorded in XFF, vs externals that are.

#### Proxy protocol
Proxy protocol is used in scenarios where the proxy operates at L4 to convey data about proxies onwards.