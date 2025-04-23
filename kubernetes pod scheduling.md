2023-03-20
Tags:

---
# Kubernetes pod scheduling

## Affinity and anti-affinity

Used to place (or not) pods based on other pods on a node. You can say that a pod must be co-located
with another pod, or say that a pod cannot be on the same node as another pod.

This is the primary mechanism to use when you want to avoid all instances of the same service ending
up in the same node, so that when the node is reset, all instances of the service are lost.

## Pod topology spread contraints

This is primarily used when you want to take into account the underlying cloud architecture when spreading
pods. For example, you can require that instances are placed on different availability zones, or different regions.

## Taints and tolerations

This is used when you have nodes with special hardware intended to serve a specific service and it's pods.
As an example, you may have special GPU hardware on nodes, and want to ensure that pods requiring those
capabilities land on proper hardware.

## Replication controllers

These are more ephemeral than services. They are used to ensure that a service always has at least X capacity
to offer. Use case include rolling updates, where a ReplicationController is defined both for the new and the
old release, and then those controllers are used to scale the amount of requests served by new vs old version.

ReplicationControllers sit "behind" a service, and are used as needed to scale versions behind the service facade.

## Using kubectl to inspect pods scheduled on nodes

1. Do aws sso login
2. set context as needed:
  ``
  kubectl config get-contexts
  kubectl config use-context <context>
  ```
3. list nodes
  ```
  kubectl get nodes
  ```
4. You can get pods running on a node in two ways. First, you can request a describe on a node
  ```
  kubectl describe node <node>
  ```
  OR query pods based on which nodes they run:
  ```
  kubectl get pods --all-namespaces -o wide --field-selector spec.nodeName=<node>
  kubectl get pods --namespace <ns> -o wide --field-selector spec.nodeName=<node>
  ```

---
## References
1. 
