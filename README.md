# NgRx Vis

NgRx Vis visualizes the journey of each action in your project.

It displays in which file an action is **created**, where it is
**dispatched** and how it is **processed** (by an effect or a reducer).

You get a documentation being always up to date.
You will be able to identify effects that are too complex.

In future we plan to provide guidance to apply best practices that are
recommended by the NgRx core-team.

![action-journey](./assets/graphs.png)

## Limitations

### Actions created at runtime

NgRx Vis is not capable of resolving actions that a created at runtime.
Currently @ngrx/data-Actions wont show up either.
In some those cases where Actions are generated based on a convention, it is
possible to write a Resolver that generates the needed meta data for the graph.

### 3rd Party Libraries

If a plugin for NgRx does not use vanilla NgRx actions, NgRx Vis cannot show
them out-of-the-box.
However, it is possible to write a Resolver that parses the AST for other
Action types.
