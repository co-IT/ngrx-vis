import { DataSet } from '../visjs'
import { copySync, readFileSync, writeFileSync } from 'fs-extra'

export function createWebView(dataSet: DataSet) {
  copySync('./src/web-view/template', './ngrx-vis/')

  const graphJsFile = readFileSync('./ngrx-vis/src/network-graph.js', {
    encoding: 'utf-8'
  })

  const filledGraphJsFile = graphJsFile
    .replace('/* __NETWORK_NODES__ */', JSON.stringify(dataSet.nodes))
    .replace('/* __NETWORK_EDGES__ */', JSON.stringify(dataSet.edges))

  writeFileSync('./ngrx-vis/src/network-graph.js', filledGraphJsFile)
}
