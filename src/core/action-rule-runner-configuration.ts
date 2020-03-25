import { ActionResolver } from './action-reference-resolver'

export interface ActionRuleRunnerConfiguration {
  dispatchers: ActionResolver[]
  handlers: ActionResolver[]
}
