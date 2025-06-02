Using [limavm](https://lima-vm.io/docs/) to run containers and linux in genearal. To run docker, this is needed:
```bash
limactl start template://docker
export DOCKER_HOST=$(limactl list docker --format 'unix://{{.Dir}}/sock/docker.sock')
```

After this, `docker` or commands can be run on that shell. Docker is installed via nix. Same jazz with podman. Will create a `edh` alias of the DOCKER_HOST export.
