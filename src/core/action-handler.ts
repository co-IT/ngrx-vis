export interface ActionHandler {
  caption?: string
  fileName: string
  filePath: string
  category: 'component' | 'effect' | 'reducer' | 'test'
  followUpActions?: string[]
}
