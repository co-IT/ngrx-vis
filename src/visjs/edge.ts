import { VisJsNodeId } from './node'

export interface Edge {
  from: VisJsNodeId
  to: VisJsNodeId
  arrows: 'to'
}
