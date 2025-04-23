`shred` is a tool that writes a file contents with random bytes n times before it is removed, so that there is no trace of the file content once removed. However, `btrfm` uses copy-on-write technology when modifying the content, so that the disk may still contain copies of the original data after the remove. Therefore, one should remove the cow attribute of the file _before_ running shred:
```sh
chattr +C /path/to/sensitive_file
shred -u -z -n 3 /path/to/sensitive_file
```
Another strategy is to create e.g `tmp/nocow` directory, where the nocow has copy-on-remove disabled. One could argue that `tmp` directories should not need to have nocow to begin with, but this makes it more explicit.