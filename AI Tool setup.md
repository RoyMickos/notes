Ensure that [headroom](https://github.com/headroomlabs-ai/headroom) is installed. Used `uv tool install --python 3.13 "headroom-ai[all]"` initially. `start_opencode.sh` currently wraps inside headroom.
Results: at least with `Opencode`, headroom struggled to show any benefit, so it was dropped from the workflow.

Docker sandboxes: the kit approach seems to be ok, with a mise extension. A project dedicated extension can open
the newtork addresses that are required for a project (back-ends, integrations). However, there are the following pain points:
- with git worktrees, one cannot map the .git into the sandbox as it is a symbolic link. The .git needs to be mapped separately. unless you give it read/write access, then it cannot make commits. The alternative `clone` mode only works with the 'native repo'. Here, the sanbox has it's own git repo which registers as a remote on the host. This provides added security but adds the requirement of code editing inside the sandbox.
- .env files that contain secrets necessary to run a backend. THe host firewall can only manipulate http headers when it masks secrets, it cannot manipulate anthing else.:w

