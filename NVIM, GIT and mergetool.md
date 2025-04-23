2022-08-04
Tags:

---
# NVIM, GIT and mergetool

You have to define the git tool locall in  .gitconfig because git does not recognize `nvim` as a legal diff tool:
```
[merge]
	tool = nvimdiff
  conflictstyle = diff3
[mergetool]
  prompt = false
  keepBackup = false
[mergetool "nvimdiff"]
	cmd = nvim -d \"$LOCAL\" \"$MERGED\" \"$BASE\" \"$REMOTE\" -c \"wincmd w\" -c \"wincmd J\"
```

The order of the LOCAL, BASE etc in nvim is weird, but this one works. Checking the base .gitconfig into dotfiles.

---
## References
1. 
