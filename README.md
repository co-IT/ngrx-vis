# NgRx Vis

<p align="center">
  <img src="https://github.com/co-IT/ngrx-vis/blob/master/assets/logo.png?raw=true">
</p>

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
```

Create a script in your package.json executing NgRx Vis.

```json
{
  "scripts": {
    "ngrx-vis": "ngrx-vis -p ./tsconfig.app.json"
  }
}
```

```bash
# generate report and store it in ngrx-vis/
npm run ngrx-vis
```

## Options

```bash
Options:
  -V, --version                 output the version number
  -g, --glob <**/*.actions.ts>  Glob for files containing actions (default: "**/*.actions.ts")
  -p, --project <path>          Specify path to tsconfig
  -h, --help                    display help for command

Example call:
  $ ngrx-vis --project ./src/tsconfig.app.json
```

## FAQ

### Which versions of NgRx are supported?

You need at least NgRx 8 installed. NgRx Vis traces actions which are created
with the `createAction` helper.

### How is the graph built?

NgRx Vis does static code analysis.
It looks for action declarations, resolves all references and identifies the
usages of the respective action.

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

## Credits

<div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/"     title="Flaticon">www.flaticon.com</a></div><div>Icons made by <a href="https://www.flaticon.com/authors/those-icons" title="Those Icons">Those Icons</a> from <a href="https://www.flaticon.com/"     title="Flaticon">www.flaticon.com</a></div><div>Icons made by <a href="https://www.flaticon.com/authors/google" title="Google">Google</a> from <a href="https://www.flaticon.com/"     title="Flaticon">www.flaticon.com</a></div><div>Icons made by <a href="https://www.flaticon.com/authors/pixel-perfect" title="Pixel perfect">Pixel perfect</a> from <a href="https://www.flaticon.com/"     title="Flaticon">www.flaticon.com</a></div>

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://medium.com/@gregor.woiwode"><img src="https://avatars3.githubusercontent.com/u/444278?v=4" width="100px;" alt=""/><br /><sub><b>Gregor Woiwode</b></sub></a><br /><a href="https://github.com/Gregor Woiwode/ngrx-vis/commits?author=GregOnNet" title="Code">💻</a> <a href="https://github.com/Gregor Woiwode/ngrx-vis/commits?author=GregOnNet" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!