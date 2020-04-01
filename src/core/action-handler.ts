export interface ActionHandler {
  fileName: string
  filePath: string
  category: 'component' | 'effect' | 'reducer'
  followUpActions?: string[]
}
