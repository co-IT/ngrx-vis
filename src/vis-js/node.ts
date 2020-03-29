export type VisJsNodeId = string

export interface Node {
  id: VisJsNodeId
  level: number
  label: string
  group: string
}
