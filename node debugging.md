2023-08-09
Tags:

---
# Node debugging

These guidelines are for the development (skaffold) environment.

## CPU

Profile for cpu usage using the `--prof` switch when starting the app. It will produce `isolate-*` log files in the directory
where node was started. You can start a shell session using `k9s` and determine the name of the file, then use `kubectl` to copy
the file to host as k9s does not support copying. Then, process the file using node: `node --prof-process isolate-e2e-v8.log > processed-e2e.txt`.


## Memory

You need to start node with `--inspect` flag. The simplest way is to add this flag to the `yarn start` command in package.json, so that the inspect flag is operation when the minikube cluster starts.

Next, use k9s to do a port forward for port `9229` from the container where your inspected node app runs. Now on the host machine, open chrome and navigate to `chrome://inspect`. You should see the node process under "Remote target". Then proceed using chrome devtools as usual.


---
## References
1. [Chrome documentation on memory tools](https://developer.chrome.com/docs/devtools/memory-problems/heap-snapshots/)
2. [Node debugging guide](https://nodejs.org/en/docs/guides/debugging-getting-started). Note that this guide discusses a `ws` url which is not required, chrome will pick up the debugging session automatically.
3. [Node's introduction to profiling](https://nodejs.org/en/docs/guides/simple-profiling)

