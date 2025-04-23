2023-08-23
Tags:

---
# Performance testing in kube

First, you must enable metrics server in minikube

```sh
minikube addons enable metrics-server
```

With minikube running with metrics ebabled, you may inspect the load using kubectl

```sh
kubectl top pods <pod name>
```

# Generating artifial load

ApacheBench (ab) is a tool for running performance tests using http(s) protocol, already installed on fedora:

```sh
ab -n 100 -c 10 http://localhost:30016/spike/gm/27fb40bd-52db-49c2-9267-3c59f784be47
```
where:
  o -n is the number of requests
  o -c is the concurrency level
You can also give `-g out.data` which collects output data for gnulplot.


---
## References
1. 
