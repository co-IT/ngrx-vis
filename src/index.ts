import { createNetwork } from './visjs/create-network'
import { createWebView } from './web-view/create-web-view'
import { NgRxActionInspector } from './core/ngrx-action-inspector'

const inspector = new NgRxActionInspector('./ngrx-example-app/tsconfig.json')
const network = createNetwork(inspector.inspect())

createWebView(network)
