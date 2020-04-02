import { Edge, Node } from './index'

export function createEdge(
  from: Node,
  to: Node,
  options: any = { arrows: 'to' }
): Edge {
  return {
    from: from.id,
    to: to.id,
    ...options
  }
}
