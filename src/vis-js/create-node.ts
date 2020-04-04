import { createId } from '../core/create-id'
import { Node } from './index'

export function createNode(
  label: string,
  level: number,
  group: string,
  id = createId()
): Node {
  return { id, label, level, group }
}
