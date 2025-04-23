This looks a bit messy. The base plugin seems to support only omnicompletition, a legacy VIM method. However, one can use it to install an experimental language server, that would presumambly feed code suggestions through LSP plugin in nvim-cmp.

```
gitlab.vim: Installing @gitlab-org/gitlab-lsp under /home/roy/.local/share/nvim/lazy/gitlab.vim
gitlab.vim: Unable to install @gitlab-org/gitlab-lsp please install it manually before continuing.

```
```
✦ ❯  ❯ echo @gitlab-org:registry=https://gitlab.com/api/v4/packages/npm/ >> .npmrc

~ on ☁<fe0f>  roy.mickos@gmail.com
✦ ❯ npm i -g @gitlab-org/gitlab-lsp
npm WARN deprecated uuid@3.4.0: Please upgrade  to version 7 or higher.  Older versions may use Math.random() in certain circumstances, which is known to be problematic.  See https://v8.dev/blog/math-random for details.
npm ERR! code 127
npm ERR! path /home/roy/.asdf/installs/nodejs/20.10.0/lib/node_modules/@gitlab-org/gitlab-lsp/node_modules/fastify-socket.io
npm ERR! command failed
npm ERR! command sh -c npx only-allow pnpm
npm ERR! npm WARN exec The following package was not found and will be installed: only-allow@1.2.1
npm ERR! sh: line 1: only-allow: command not found

npm ERR! A complete log of this run can be found in: /home/roy/.npm/_logs/2024-06-07T12_00_17_759Z-debug-0.log
```