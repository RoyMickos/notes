---
id: aws cli tricks
aliases: []
tags: []
---

2024-01-15
Tags:

# copying credentials from one terminal to another

AWS client remembers different logins to different profiles. You can fetch from aws
cache credentials that you have fetced and use them in another window provided that
they are still valid by using:

```sh
eval "$(aws configure export-credentials --profile ytkit --format env)"
```


---
# Aws cli tricks

---
## References
1. 
