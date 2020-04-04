export interface ActionHandler {
  fileName: string
  filePath: string
  category: 'component' | 'effect' | 'reducer' | 'test'
  followUpActions?: string[]
}
