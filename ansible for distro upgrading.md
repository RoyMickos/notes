2023-05-30
Tags: #linux

---
# Ansible for distro upgrading

Ansible seems to be a sensible option to try to automate software upgrades when upgrading distros
A base example using dnf is available, so it is possible to start from there

```yaml
---
- hosts: localhost
  tasks:
    - name: install packages
      become: true
      become_user: root
      dnf:
        state: latest
        name:
          - tcsh
         - htop
```


This might allow for toolbox installations later on, for silverblue scenarios.
Next up, how to use ansible to clone git repos.
Running shell commands (changing shell to zsh, installing asdf, etc.)

Also, need to study how this works in greenfield installations:
1. copy over secrets
2. install pip3 and ansible
3. clone playbooks
4. run playbooks

An ansible project has been set up, which contains different playbooks, one to be run as root as the firts thing, then a user-mode playbook, finally a playbook that is run as user after a reboot. There is also an extra playbook to set up project-specific settings, but this is not put to version control.

---
## References
1. [installing ansible](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html#id10)
