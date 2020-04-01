import { ActionHandler } from './action-handler'
import { ActionMeta } from './action-meta'

export interface ActionContext {
  filePath: string
  actionMeta: ActionMeta
  dispatchers: ActionHandler[]
  handlers: ActionHandler[]
}
