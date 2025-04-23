2022-05-01
Tags:

---
# Information disclosure

## Fuzzing
Testing an app with automatically generated data, some of which may be malformed. Also used by hackers to try to crack sites with random data.

1. Never commit secrets to version control.
2. Drop all non-essential files from deployments. Especially all .env and .git directories etc.
3. Separate configuration from code.

Consider running gitleaks in pre-commit hook.

---
## References
1. [Ffuf fuzzing tool](https://github.com/ffuf/ffuf)
2. [Wordlist for web fuzzing](https://github.com/danielmiessler/SecLists/blob/master/Discovery/Web-Content/quickhits.txt)
3. [Goop - a tool to dump git repos](https://github.com/deletescape/goop)
4. [Gitleaks - a tool to scan commit history for sensitive data](https://github.com/zricethezav/gitleaks)
