import { NgRxActionInspector } from './core/ngrx-action-inspector'
import { createNetwork } from './vis-js/create-network'
import { createWebView } from './web-view/create-web-view'

const inspector = new NgRxActionInspector('./ngrx-example-app/tsconfig.json')
const network = createNetwork(inspector.inspect())

// eslint-disable-next-line no-console
createWebView(network).catch(err => console.log(err))
