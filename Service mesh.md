 A service mesh operates by installing an envoy proxy with you application workload. This proxy is called a *sidecar*. In kubernetes, a init container is used to configure the node IPTABLES so that all traffic is directed towards the envoy proxy. Envoy is the man-in-the middle in all PODs, and traffic goes between envoy proxies. This is called the data plane.
Control plane is what configures the envoy proxies, and is *the* mesh. No changes to application code is required. Here is a sample rundown of what happens when an cluster application tries to reach for a service in the same cluster:

### The Request Flow: A Step-by-Step Walkthrough
#### 1. Your Application Makes a Standard Network Call:
Your application code, let's say a microservice named my-app, simply makes a request to a service hostname, such as http://other-service. From your application's perspective, this is a standard outbound HTTP request, just as if it were communicating with a service outside the cluster. Crucially, there are no special libraries, APIs, or service mesh-specific code changes required.

#### 2. The OS Redirects the Traffic:
This is where the magic happens. When you deploy a service to the mesh (e.g., by adding a label to a Kubernetes pod and enabling Istio injection), a special init container is run before your application starts. This container configures the pod's networking stack using iptables rules. These rules are configured to redirect all outbound network traffic from your application's container to the local Envoy sidecar proxy.

#### 3. The Envoy Proxy Intercepts the Request:
Your application's network request never leaves the pod. It is instead intercepted by the Envoy sidecar proxy running in the same pod. The proxy acts as a transparent intermediary for all inbound and outbound traffic.

#### 4. The Proxy Handles the "Network Logic":
Now that the request is in the hands of the Envoy proxy, it takes over the complex tasks:

Service Discovery: The proxy consults the central control plane (Istio) to get the latest, most accurate list of healthy endpoints for the other-service you're trying to reach.

Load Balancing: It applies sophisticated load balancing algorithms (e.g., least-requests, round-robin) to choose the best instance of other-service to send the request to.

Security: It automatically initiates a secure, encrypted connection using mutual TLS (mTLS) to the destination service's proxy. Your application doesn't need to manage certificates or encryption.

Traffic Management: It applies any configured traffic rules, such as retries on failure, timeouts, or routing the request to a specific version of the service for a canary deployment.

Observability: As it processes the request, the proxy automatically captures detailed metrics (latency, request count, error rates) and distributed tracing spans, which are sent to the control plane and other monitoring tools.

#### 5. The Request is Forwarded to the Destination:
The Envoy proxy securely forwards the request to the Envoy proxy of the destination service, other-service.

#### 6. The Destination Proxy Forwards the Request to the Destination Application:
The destination service's Envoy proxy receives the request, decrypts it, and then forwards it to the other-service application container on the localhost network interface.

#### 7. The Response Completes the Loop:
The response from other-service follows the same path in reverse, going from the destination application, through its sidecar proxy, and back to your application's proxy, which then hands it back to your application as if it were a direct response.

## How does this relate to event busses?

#### The Service Mesh: Synchronous Communication

A service mesh is primarily concerned with **synchronous, request/response communication.** Think of it as a smart, application-level network for your services. Its job is to manage the `my-service` making a direct HTTP or gRPC call to `other-service`.

**Key Capabilities:**

- **Routing:** Directing a request to the right destination instance.
    
- **Security:** Automatically encrypting traffic with mTLS and enforcing access policies.
    
- **Observability:** Providing detailed metrics and tracing for every request, showing latency, success rates, and the path of a transaction.
    
- **Resilience:** Handling failures with features like retries and circuit breakers.
    

The service mesh operates on the "who is talking to whom" model of communication. It manages the direct conversation between two parties.

#### The Event Bus (Apache Kafka): Asynchronous Communication

An event bus like Apache Kafka is designed for **asynchronous, event-driven communication.** It's a "publish/subscribe" system. Services (producers) publish events to a central log (a Kafka topic), and other services (consumers) that are interested in that event can subscribe to and process it. The producer and consumer are completely decoupled—they don't need to know about each other's existence.

**Key Capabilities:**

- **Decoupling:** Services are not directly coupled. A producer can publish an event, and the consumer can be offline and process it later.
    
- **Durability:** Events are stored in a durable log, so consumers can re-process them or catch up if they fall behind.
    
- **Scalability:** It handles high-volume, real-time data streams and scales horizontally by partitioning topics.
    
- **State Management:** Kafka Streams and other APIs allow services to build stateful applications on top of the event log.
    

The event bus operates on the "something happened" model. It's not a direct conversation; it's a notification system.

### A Real-World Example

Imagine a simple e-commerce application with three services:

1. **`ProductService`**: Manages product data.
    
2. **`OrderService`**: Handles new customer orders.
    
3. **`BillingService`**: Processes payments.
    

- When a customer clicks "Buy Now" on the front end, it makes a direct, synchronous API call to the `OrderService`. The **service mesh** is what would manage this call. It ensures the request is securely routed, applies any configured traffic policies, and captures observability data. The `OrderService` needs an immediate response to tell the customer if the order was created successfully.
    
- After the `OrderService` successfully creates the order, it needs to notify the `BillingService` that a payment is due. Instead of making another synchronous call, which could fail if the `BillingService` is down, the `OrderService` can **asynchronously publish an "OrderCreated" event to an Apache Kafka topic.** The `OrderService` is done with its work and can immediately respond to the customer.
    
- The `BillingService` continuously listens to the "OrderCreated" topic. When it sees the new event, it wakes up and processes the payment. If it fails, it can retry or publish another event. The `ProductService` could also listen to the same topic to decrement its inventory count.
    

In this scenario, the service mesh handles the **request/response** communication, while Apache Kafka handles the **event-driven, asynchronous** communication. They are not competing technologies, but rather complementary tools that, when used together, create a robust, scalable, and resilient microservices architecture.H