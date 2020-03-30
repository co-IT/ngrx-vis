# NgRx Vis

> ⚙️ This package is in a very early stage.
> 🐛You are welcome to test it and report an issue if you find any bug.

NgRx Vis visualizes the journey of each action in your project.

It displays in which file an action is **created**, where it is
**dispatched** and how it is **processed** (by an effect or a reducer).

You get a documentation being always up to date.
You will be able to identify effects that are too complex.

In future we plan to provide guidance to apply best practices that are
recommended by the NgRx core-team.

## How to use

```bash
# install ngrx-vis
npm install -D ngrx-vis

# run ngrx-vis
./node_modules/.bin/ngrx-vis -p ./src/tsconfig.app.json

# -> generated report is saved in ngrx-vis/
```

## FAQ

### Which versions of NgRx are supported?

You need at least NgRx 8 installed. NgRx Vis traces actions which are created
with the `createAction` helper.

### How does a generated graph looks like?

![action-journey](https://github.com/co-IT/ngrx-vis/blob/master/assets/graphs.png?raw=true)

## Limitations

### Actions created at runtime

NgRx Vis is not capable of resolving actions that are created at runtime.
Currently @ngrx/data-Actions wont show up either.
In some of those cases where actions are generated based on a convention,
it would be possible to write a Resolver that generates the needed meta data
for the graph.

### 3rd Party Libraries

If a plugin for NgRx does not use vanilla NgRx actions, NgRx Vis cannot show
them out-of-the-box.
However, it is possible to write a Resolver that parses the AST for other
Action types.
