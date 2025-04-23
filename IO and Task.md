2022-12-03
Tags:

---
# IO and Task

In functional programming, IO basically means wrapping a side=effect inside a function, and then
treating that function as the pure entity being processed. Basically just delay the invocation of the
effect. All mappings then are built on processing the result of the invocation.

A task is the same thing but for asyncronous functions. The task is the async function which invocation
is delayed. It differs from a promise in that a function interface is built to process the result, and a
specific method is added to start the mayhem(invoking the async function).

---
## References
1. https://mostly-adequate.gitbook.io/mostly-adequate-guide/ch08#old-mcdonald-had-effects...
