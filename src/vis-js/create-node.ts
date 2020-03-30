import { Node } from './index'
import { createNodeId } from './create-node-id'

export function createNode(label: string, level: number, group: string): Node {
  return { id: createNodeId(), label, level, group }
}
