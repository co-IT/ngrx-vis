import { ReferenceEntry } from 'ts-morph'
import { ActionRule } from './action-reference-rule'
import { ActionRuleRunnerConfiguration } from './action-rule-runner-configuration'
import { ActionUsageInfo } from './action-usage-info'

export interface ActionReferenceMap {
  dispatchers: ActionUsageInfo[]
  effects: ActionUsageInfo[]
  reducers: ActionUsageInfo[]
}

export class ActionRuleRunner {
  private readonly emptyReferenceMap: ActionReferenceMap

  private rulePipeline: {
    type: 'dispatchers' | 'reducers' | 'effects'
    rule: ActionRule
  }[]

  constructor(configuration: ActionRuleRunnerConfiguration) {
    this.emptyReferenceMap = {
      dispatchers: [],
      effects: [],
      reducers: []
    }

    this.rulePipeline = [
      ...configuration.dispatchers.map(rule => ({
        type: 'dispatchers' as const,
        rule
      })),
      ...configuration.reducers.map(rule => ({
        type: 'reducers' as const,
        rule
      })),
      ...configuration.effects.map(rule => ({
        type: 'effects' as const,
        rule
      }))
    ]
  }
  run(actionReferences: ReferenceEntry[]): ActionReferenceMap {
    return actionReferences.reduce((result, actionReference) => {
      const rule = this.findRule(actionReference)

      return !rule
        ? result
        : {
            ...result,
            [rule.type]: [
              ...result[rule.type],
              rule.rule.execute(actionReference)
            ]
          }
    }, this.emptyReferenceMap)
  }
  findRule(
    actionReference: ReferenceEntry
  ): {
    type: 'dispatchers' | 'reducers' | 'effects'
    rule: ActionRule
  } | null {
    for (let { rule, type } of this.rulePipeline) {
      if (rule.canExecute(actionReference)) {
        return { rule, type }
      }
    }
    return null
  }
}
