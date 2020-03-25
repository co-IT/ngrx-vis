import { ReferenceEntry } from 'ts-morph'
import { ActionUsageInfo } from './action-usage-info'

export interface ActionRule {
  canExecute(actionReference: ReferenceEntry): boolean
  execute(actionReference: ReferenceEntry): ActionUsageInfo
}
