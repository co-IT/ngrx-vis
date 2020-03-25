import { ActionRule } from './action-reference-rule'

export interface ActionUsageIdentificationRules {
  dispatchers: ActionRule[]
  reducers: ActionRule[]
  effects: ActionRule[]
}
