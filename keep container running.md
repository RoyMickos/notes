## Keep container running

The container will exit once it's command or entrypoint has finished it's work.
To keep container running, use something along the lines of

```sh
FROM ubuntu:latest

ENTRYPOINT ["tail", "-f", "/dev/null"]
```

The command keeps waiting forever, so the container is live and you can make a bash
connection to it.

---
[Keep container running](https://devopscube.com/keep-docker-container-running/)
