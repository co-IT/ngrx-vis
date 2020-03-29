import { copy, ensureDir, readFile, writeFile } from 'fs-extra'

export function createWebView(dataSet: { nodes: any[]; edges: any[] }) {
  return ensureDir('./ngrx-vis')
    .then(() => copy(`${__dirname}/template`, './ngrx-vis/'))
    .then(() =>
      readFile('./ngrx-vis/src/network-graph.js', {
        encoding: 'utf-8'
      })
    )
    .then(graphJsFile =>
      graphJsFile
        .replace('/* __NETWORK_NODES__ */', JSON.stringify(dataSet.nodes))
        .replace('/* __NETWORK_EDGES__ */', JSON.stringify(dataSet.edges))
    )
    .then(filledGraphJsFile =>
      writeFile('./ngrx-vis/src/network-graph.js', filledGraphJsFile)
    )
}
