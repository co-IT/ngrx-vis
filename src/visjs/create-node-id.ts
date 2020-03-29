import { VisJsNodeId } from './index'

export function createNodeId(): VisJsNodeId {
  return (
    Math.random()
      .toString(36)
      .substring(2) + Date.now().toString(36)
  )
}
