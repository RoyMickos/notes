Typescript uses by default the module system of the target, that is ESM in the browser, and cjs in node..

A problem arises when you want to use an ESM module in your node project. If you are using native js, then you can make an awaited require statement and be done with it. However, typescript hides this as it _appears_ to be using esm style includes while behind the curtains it compiles to cjs. If you try to use an awaited require in ts, it will complain that you must use a ejs compatible module setting, causing ts to generate ejs modules for node.

To make a full ejs conversion for node requires fiddling with ts and package.json settings, but unfortunately there are changes in code as well:
1. Can\t use default imports, must refer to the index file.
2. Relative imports need to refer to files using `js` extension even if that file is also written in ts.

This may be done using a (codemod)[https://www.npmjs.com/package/commonjs-to-es-module-codemod],  and apparently at least vs**** can add those extensions by default,

An option would be to use libmagic wrappers. There are several of them, with the exotic ones are using webassembly to run the library. This is not as bad as it sounds, because it removes the linux platform dependency that comes with using `libmagic`. Especially as the most used wrapper is 5 years old, and has no license information. Using the wasm version means that we need to use the file system to store files for inspection, which is not ideal.

Finally is the option of using an old file-type version that is not esm. The most recent such version is from July 2022.

(Sindre Sörhus summary)[https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c]
(TS official docs)[https://www.typescriptlang.org/docs/handbook/modules/reference.html#node16-nodenext]

#javascript #typescript
