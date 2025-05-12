2022-06-23
Tags: #linux 

---
# nix

### Nix vs Toolbox vs FlatPak

Nix appears to be general, while FlatPacks are for UI software only. Thus using nix for command line and FlatPacks for UI seems reasonable split.

Nix flakes seem to be an alternative to Toolbox, which is based on containers. However, it seems more clear that invoking a project-specific
toolbox is again cleaner alternative. Need more info on how nix handles node versions etc. Perhaps one thing is to use nix inside toolboxes?

Nix is moving to more flakes-based approach, where the whole nix repo is a giant flake.

## Profiles
Profiles is the legacy way, currently using nix home manager with flakes to manage a "system flake".
### Install using nix (flake-tool)
`nix profile install nixpkgs#graphviz`
### List currently installed packages
` nix profile list > nix-packages.txt`
`nix-env -qa --installed "*"`
### Upgrade current packages
`NIXPKGS_ALLOW_UNFREE=1 nix profile upgrade --all --impure`

## Home manager
Using home manager to maintain a "system flake", replacing the old profile based setup. This puts the configuration into dotfiles out of the ansible script. This is more aligned with `darwin-nix` used on macos, as it has a concept of "system flake".

The configuration is in `base/.config/home-manager`. There is a `flake.nix` that refers to a module `home.nix`. This latter file hosts the home manager configurations. It, in turn, comprises of imported files. I'm still thinking how much should I use the configuration of the home manager vs dotfiles. Current dotfiles takes effect immediately, whereas storing configs into home manager would require to run `home-manager switch` to take effect. However, one could do some clever things because the nix configs are functions.

Read the sources to find out more what can be configured for which program at the [home-manager repo](https://github.com/nix-community/home-manager/tree/master/modules/programs)
### Listing packages
`home-manager packages`
### Updating packages and home manager
~~~sh
cd ~/.config/home-manager
nix flake update
nix run .#homeConfigurations.roy.activationPackage
~~~

### Adding new configuration files to home manager
Here's a nice footgun in home manager: you have to add your new file to git before home manager accepts it. It will complain that it can't find the file in the nix store.

### Installing a specific version of a utility
The idea is to create overlays of nixpkgs. Nixpkgs is the package source for the latest packages, so you create overlays to "get back in time" for certain packages. This means that you need to replace 
```nix
pkgs = nixpkgs.legacyPackages.${system};
```
in the `flake.nix` file with overlayed version of it:
```nix
pkgs = import nixpkgs {
    inherit system;
    overlays = [
      (import ./overlays/bat.nix)
    ];
  };
```

Then, create an overlay directory and put this into it:
```nix
final: prev: {
  bat = prev.bat.overrideAttrs (old: {
    version = "0.22.1";
    src = prev.fetchFromGitHub {
      owner = "sharkdp";
      repo = "bat";
      rev = "v0.22.1";
      sha256 = "sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
    };
  });
}
```
Here, `prev` is the original nixpkgs, where you replace bat with the version stated. In this case we can use actual version by fetching the source from github and having the source compiled using normal rules. If the rules have changed then this might not work. You need to run the build once with the dummy sha to get the actual sha, then replace the dummy with actual.

## Darwin-nix

#### Updating packages
```nix

```

## Flakes
It looks like flakes could be a good option for managing dev environments, although toolbox could also be used. However, a nix flake also documents what the environment comprises of, so it has an edge. There is some line drawing to be thought of as developer tooling is not part of the flake. There is currently one pilot project for using flake based dev environment, the ai comde project. It uses python, and the flake sets up python and a venv. At this point it looks like using programming language tools for managing libs and packages of the project is in general preferred to using nix for it.

### zsh
Nix uses bash by default, and it's apis are built on top of it. There are twofold solution to this, fist is to use [zsh-nix-shell](https://github.com/chisui/zsh-nix-shell) to provide a compatibility layer, and then putting zsh activation in the `postShellHool` of the flake.

### Bad ideas
Some thing that I have studied but which turned out to be bad ideas:
```nix
  installGoTool = { name, repo, version, sha256 ... }: pkgs.stdenv.mkDerivation {
    pname = name;
    version = version;

    # Fetch source from GitHub
    src = pkgs.fetchFromGitHub {
      owner = builtins.elemAt (builtins.split "/" repo) 0;
      repo = builtins.elemAt (builtins.split "/" repo) 1;
      rev = "v${version}";
      sha256 = sha256;
    };

    buildInputs = [ pkgs.go ];

    installPhase = ''
      mkdir -p $out/bin           # Create the bin directory in the Nix store
      export GOPATH=$(mktemp -d) # Isolate Go build environment
      export GOBIN=$out/bin      # This is where Go will install the binary
      go install .               # Build and install the tool
    '';
  };
```
This helper function would install packages using `go install` after the actual go compiler installation. This is bad because all of the utilties I would like to install are already available as normal nix packages.

---
## References
1. [reddit](https://www.reddit.com/r/NixOS/comments/fsummx/how_to_list_all_installed_packages_on_nixos/)
2. [list packages in ubuntu](https://www.cyberithub.com/2-ways-to-list-all-manually-installed-packages-in-ubuntu-debian/)
