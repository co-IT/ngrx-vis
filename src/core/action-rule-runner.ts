import { ReferenceEntry } from 'ts-morph'
import { ActionRule } from './action-reference-rule'
import { ActionUsageIdentificationRules } from './action-usage-identification-rules'
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

  constructor(usageIdentificationRules: ActionUsageIdentificationRules) {
    this.emptyReferenceMap = {
      dispatchers: [],
      effects: [],
      reducers: []
    }

    this.rulePipeline = [
      ...usageIdentificationRules.dispatchers.map(rule => ({
        type: 'dispatchers' as const,
        rule
      })),
      ...usageIdentificationRules.reducers.map(rule => ({
        type: 'reducers' as const,
        rule
      })),
      ...usageIdentificationRules.effects.map(rule => ({
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
