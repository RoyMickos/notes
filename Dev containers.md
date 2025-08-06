This is originally a vs code concept. The benefits outside this ecosystem are a bit unclear at the moment. At the moment this is just a normal docker-compose setup, with two sets: the standard `docker-compose.yml` with database, backend, and frontend; then `docker-compose.dev.yml` with the "devshell" containers. The idea is to install into these devshells the "standard" development tools like linters, formatters and the like. I would also like to add AI tooling like gemini-cli or opencode.

This is progressing much slower than expected. The reason is that poetry took a lot of time to get right. The initial setup with using a `.venv` directory was a wrong move, and a lot of effort was put into fighting with remapping the directory. This is because we cannot share libraries between the host (mac) and the container (linux). After a long time I resorted into doing the normal poetry install that does install theses system wide, but maintains separation. This ensured that we did not have to fight with mapping `.venv` directory, as poetry wanted to delete and re-create it which obviously did not work as this was a mount point. After that, another issue was that file watches from inside the container did not work when the mount was on mac. It took a lot of trial and error to get the dev mode to recognize changes.

Now the backend seems to be in order. What still needs to be done is to do the same with front-end. `node_modules`cannot be shared between mac and linux, let's hope we don't run into similar issues with it. And after all that, we still need to get to the actual devcontainer beef: running the AI agent assistants in the `devshells`. Some random issues to fix:
- Need separate docker files for running the backend/frontend and devshells
- Need separate `.env` files for these as well

After this, the same jazz for the front-end
Key takeaways so far: both python and node libraries contain plaftorm-dependant components, so you need to make sure that `.venv` and `node-modules` are separate for both environments. You still need those on the host for editing the files, while the execution environment needs it own separate resources if your host is a mac and the container is always linux. And you need to make sure those are kept in sync, one idea is to abstract package operations as make targets.
Also there's the devshell container, where you can install specific software like the `gemini-cli` that you want to limit what it can see and do on your computer. The "production" and "devshell" machines may be able to share a common volume for the `node-modules` but that remains to be seen.

[Devcontainers spec](https://containers.dev/)
[gemini-cli](https://github.com/google-gemini/gemini-cli)
[opencode](https://opencode.ai/)