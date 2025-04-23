2022-11-19
Tags:

---
# distro update

### before upgrade

download image
use fedora media writer to create a usb stick
- Install new distro as a virtual image and verify ansible scripts
- Update package lists for fedora and nix, ensure that everything is found in the playbook
- Go through ansible-playbooks asdf configurations: check current versions of tools and update accordingly `dnf history userinstalled` `nix profile list`
- Go through your git projects: dotfiles, notes (personal and work), ansible-playbooks and compdev. Ensure all have been made as commits _and_ are pushed to upstream repo
- backup virtual machines from `/var/lib/libvirt/images`
- ensure anki decks are backed up to anki web
- copy the fresh version of aws and kube configs to disk
-  backup stuff in /roy folder

1. Install new image see [[Partitioning scheme]]
2. Copy over secrets, and unversioned backup files from a separate disk
		- create a new ssh key for the machine: ssh-keygen -t ed25519 -C <email>
		- add new key to github and gitlab
3. copy over .aws/config from backup
4. copy over .kube/config from backup
5. copy nerd fonts ~/.local/share/fonts/ from backup
6. connect to vincit-guest, then go to vincit homepage https://sites.google.com/vincit.fi/vincit-intranet navigate to it and further to it confluence
7. Configure wlan: [vincit wlan onboarding](https://vincit.atlassian.net/wiki/spaces/AS/pages/8709701683/Wireless)
8. Install ansible: `sudo dnf install ansible`
9. create `roy` directory and clone ansible-playbooks `git@gitlab.com:roy.mickos1/ansible-playbooks.git`
10. clone notes `git@gitlab.com:roy.mickos1/owl.git`
	9.5 go to ansible-playbooks dir and checkout fedora
1. run ansible `ansible-playbook root.yml --ask-become-pass`
2. run ansible `ansible-playbook user.yml --ask-become-pass`
	2.1 run ansible `ansible-playbook user-npm.yml --ask-become-pass`
1. reboot
2. run ansible `ansible-playbook reboot-user.yml --ask-become-pass`
3. copy over ytk ansible playbook and run it
4. run rclone config to create access to google_drive_vincit, and copy over the windows virtual machine
5. Install aws-sam-cli manually, install obsidian from nix manually
6. `sudo chattr +C /var/lib/libvirt/images` to check, cd to /var/lib/libvirt and run `lsattr`
7. Clone neovim, build and install

#### Links you will miss
[AWS SSO vincit](https://vincit-aws.awsapps.com/start) 
[OMAYTK mainenance manual](https://docs.google.com/document/d/1X_PiTeMaCoWCECq8WSCfzXPmeq15sqk94C_OMT-tZbc/edit?pli=1)
[vincit chatapp](https://chatapp.vincit.com/)
[Daifuku](https://www.justonecookbook.com/daifuku/)
[Mermaid](https://mermaid.js.org/)
[Chatgpt prompt engineering](https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/)
[MoErgo user guide](https://docs.moergo.com/glove80-user-guide/)

---
legacy

Stuff that needs to be run as roy
# 10. install oh my zsh `sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"`
11. run `gcloud init`
11. install Anki: `https://docs.ankiweb.net/platform/linux/installing.html`
12. import anki bakckup
13. load latest nvim and create symbolic link



3. Configure dnf: /etc/dnf/dnf.conf
    [main]
    gpgcheck=True
    installonly_limit=3
    clean_requirements_on_remove=True
    best=False
    skip_if_unavailable=True

    # added for speed
    fastestmirror=True
    max_parallel_downloads=10
    defaultyes=True
    keepcache=True

4. Upgrade packages
4. switch to zsh
  sudo dnf install zsh
17. set shell to zsh `cat /etc/shells` `usermod --shell /bin/zsh roy`
15. Install [oh-my-zsh](https://ohmyz.sh/)
9. Enable RPM Fusion
  sudo dnf install https://mirrors.rpmfusion.org/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm https://mirrors.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-$(rpm -E %fedora).noarch.rpm
18. Install tailscale
  sudo dnf config-manager --add-repo https://pkgs.tailscale.com/stable/fedora/tailscale.repo
  sudo dnf install tailscale
5. use dnf for google-chrome-stable & chromedriver
  sudo dnf install google-chrome-stable chromedriver
12. prefer flatpak for ui-apps
enable flathub
  flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
  flatseal, dbeaver
13. base apps
  sudo dnf install alacritty sway waybar wofi mako grimshot toolbox util-linux-user gcc-c++ golang libstdc++-static.x86_64
    NetworkManager-tui cowsay fortune-mod figlet pavucontrol light seahorse pass htop luajit-devel @development-tools
  sudo dnf install libxcrypt-compat.x86_64 postgresql meld
14. install [google cloud cli](https://cloud.google.com/sdk/docs/install#rpm) - requires configuration of a new dnf source
16. clone dotfiles git@gitlab.com/roy.mickos1/dotfiles.git
    git clone --bare git@gitlab.com:roy.mickos1/dotfiles ~/.dotfiles
    alias config='/usr/bin/git --git-dir=$HOME/.cfg/ --work-tree=$HOME'  // should be in dotfiles already
    config config --local status.showUntrackedFiles no
6. install nix https://nixos.org/download.html, single-user
7. install nix-packages from file in root
8. install [asdf](https://asdf-vm.com/guide/getting-started.html)
    install asdf plugins for nodejs, terraform, golang
    `asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git`
    `asdf plugin-add terraform https://github.com/asdf-community/asdf-hashicorp.git`
    `asdf plugin-add golang https://github.com/kennyp/asdf-golang.git`
    `asdf plugin add skaffold https://github.com/nklmilojevic/asdf-skaffold.git`
    `asdf plugin-add protoc https://github.com/paxosglobal/asdf-protoc.git`
    + kubectl, skaffold, kustomize, minikube
    WAS: install [nvm](https://github.com/nvm-sh/nvm)
9. install efm-langserver: go install github.com/mattn/efm-langserver@latest
9. install latest skaffold 1.x from [github](https://github.com/GoogleContainerTools/skaffold/releases)
18. download latest stable nvim and create symbolic link
19. install docker https://docs.docker.com/engine/install/fedora/
20. add yourself to docker group
21. install docker-compose `sudo dnf install docker-compose`
22. Change docker driver to overlay2: /etc/docker/daemon.json
{
  "storage-driver": "overlay2",
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
24. set nvm/asdf to use latest node 18, then install yarn: `npm install -g yarn`
25. open omaytk maintenance manual, do a `aws sso login --profile=ytkit`, then proceed per maintenance manual to add
  kubernetes profiles for aws resources:
  aws eks update-kubeconfig --alias ytk-eks-prod --name ytk-eks-prod --role-arn arn:aws:iam::117110016077:role/k8s-admin-prod --profile=ytkit
  aws eks update-kubeconfig --alias ytk-eks-test --name ytk-eks-test --role-arn arn:aws:iam::117110016077:role/k8s-admin-test --profile=ytkit
  ❯ kubectl config get-contexts
CURRENT   NAME                       CLUSTER                                                                  AUTHINFO                                                                 NAMESPACE
*         minikube                   minikube                                                                 minikube                                                                 default
          ytk-association-eks-prod   arn:aws:eks:eu-central-1:062549848537:cluster/ytk-association-eks-prod   arn:aws:eks:eu-central-1:062549848537:cluster/ytk-association-eks-prod
          ytk-association-eks-test   arn:aws:eks:eu-central-1:062549848537:cluster/ytk-association-eks-test   arn:aws:eks:eu-central-1:062549848537:cluster/ytk-association-eks-test
          ytk-eks-dev                arn:aws:eks:eu-central-1:023911789422:cluster/ytk-eks-dev                arn:aws:eks:eu-central-1:023911789422:cluster/ytk-eks-dev
          ytk-eks-prod               arn:aws:eks:eu-central-1:117110016077:cluster/ytk-eks-prod               arn:aws:eks:eu-central-1:117110016077:cluster/ytk-eks-prod
          ytk-eks-test               arn:aws:eks:eu-central-1:117110016077:cluster/ytk-eks-test               arn:aws:eks:eu-central-1:117110016077:cluster/ytk-eks-test
26. optionally, enable metrics server in minikube: minikube addons enable metrics-server
26. clone [tpm](https://github.com/tmux-plugins/tpm)
Deprecated:
    25. install [tfenv](https://github.com/tfutils/tfenv)
      - symbolic links to ~/bin
      ```
      tfenv install latest
      tfenv install latest:^0.11
      tfenv use latest:^0.11
      ```
      ```
      asdf list-all terraform
      asdf install terraform ....
      asdf global terraform ....
      ```
27. clone omaytk, run yarn install then yarn setup:build-libraries
28. increase inotify watches: edit `/etc/sysctl.conf`
  fs.inotify.max_user_watches=524288


29. copy over the `local` folder to `comde/pomo` to avoid having to recreate the certificates
30 run `go get -x` in comde/pomo/go-app as this potentially may take some time

other
  7 things from "to do after installing fedora"
  Set minikube defaults: minikube config set driver docker
    memory 16g
    cpus 4
    disk-size 60g
  Configure aws cli https://sites.google.com/vincit.fi/vincit-intranet/it-support/aws-sso

nix profile upgrade '.*'

list installed fedora packages
`dnf history userinstalled`

updates: need to work on stow, you have dotfiles but you do not stow the files after cloning. need to add a step for that


---
## References
1. 

