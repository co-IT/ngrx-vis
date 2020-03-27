# NgRx Vis

## Next steps

- [x] read actions being dispatched by an effect
- [ ] draw first graph based on the given data
- [ ] plan simple web-ui

## Vision

We want to create a Tool that provides a beautiful graph displaying the journey of each action.
It should be displayed in which file an action is **created**, where it is **dispatched** and where it is **processed** (effect or reducer).
The user gets a documentation being always up to date. It is possible to identify effects that are too complex. Also best practices could be provided by ngrx-graph according to the recommendations given by the NgRx team (Good action hygiene).

![action-journey](./assets/graphs.png)
