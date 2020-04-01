import { ReferenceEntry } from 'ts-morph'
import { ActionHandler } from './action-handler'

export interface ActionResolver {
  canExecute(actionReference: ReferenceEntry): boolean
  execute(actionReference: ReferenceEntry): ActionHandler
}
