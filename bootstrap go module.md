
# Bootstrapping go code

After cloning go code from git, your dependencies are in `go.mod` file. Run `go get -x` on the directory where the go.mod is.
The `-x` switch is there to show output as a sign of progress, as this may take time especially if your network connection
is sluggish.
