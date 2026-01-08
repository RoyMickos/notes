Notes from [this article series](https://aicoding.leaflet.pub/) on how AI changes SW development.
Key tenet is that cost of code is vanishing, but the cost of understanding still remains. This drives the architecture of a software system towards a direction where the power of AI can be utilized. In many cases it is not worth refactoring or maintaining the code: it is simpler and better to just regenerate it with a new prompt.
## Pace layers
AI excels when it is given a clearly defined 'box' to implement: it can be well defined, it's output can be verified. Interfaces between modules become a source of these definitions, and hence they define the effectiveness of how AI can be utilized in a system. A _pace layer_ is an architecture which separates fast and slow moving parts of a system. The fast layer can be regenerated at will, whereas slow layers are foundational and provide stability. Humans are needed to design this structure and this becomes the framework that steers code generation.

## Cohesion, coupling and complexity
Architecture should separate concerns and create small 'boxes' that can be effectively regenerated if needed. Feeding massive amounts of code to an AI assistant is a bad approach, as _noise_ - code that is not relevant to the problem we are trying to solve - degrades the generated results _and_ increases the cost of producing it.
**Essential complexity** is the complexity of the problem domain itself.
**Accidential complexity** is the complexity arising from the way things have been built, and is not related to essential complexity.
The key driver is to create an architecture that can fit inside the head of engineers, a system that can be comprehended. If for example code repetition makes a system easier to understand, it is good. This is called **Compaction**.

## Invariants
Argument is that if the architecture, the interfaces, are designed carefully, then the individual boxes can be easily generated. However, testing for verification has to be re-thought. In principle, you may write the box using language A today and use language B tomorrow, so the tests should be independent of the chosen implementation language, and test business invariants, system interfaces and the like. This in turn makes architecting and interface definitions even more important activity than before.

A second argument is that your system may 'drift' as it is reimplemented (it may be easier to refine the spec and re-generate rather than try to understand the current implementation and modify it. Also, generating from scratch usually leads to more simpler and coherent entity when the changed contrainta are accounted for in the beginning rather that 'worked around').