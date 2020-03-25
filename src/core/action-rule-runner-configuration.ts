import { ActionRule } from './action-reference-rule'

export interface ActionRuleRunnerConfiguration {
  dispatchers: ActionRule[]
  reducers: ActionRule[]
  effects: ActionRule[]
}
