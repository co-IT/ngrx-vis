import { ReferenceEntry } from 'ts-morph'
import { ActionResolver } from './action-reference-resolver'
import { ActionRuleRunnerConfiguration } from './action-rule-runner-configuration'
import { ActionUsageInfo } from './action-usage-info'

export interface ActionReferenceMap {
  dispatchers: ActionUsageInfo[]
  handlers: ActionUsageInfo[]
}

export class ActionResolverRunner {
  private resolverPipeline: {
    type: 'dispatchers' | 'handlers'
    rule: ActionResolver
  }[]

  constructor(configuration: ActionRuleRunnerConfiguration) {
    this.resolverPipeline = this.flattenResolvers(configuration)
  }

  run(actionReferences: ReferenceEntry[]): ActionReferenceMap {
    return actionReferences.reduce((result, actionReference) => {
      const resolver = this.findRule(actionReference)

      if (!resolver) {
        return result
      }

      return {
        ...result,
        [resolver.type]: [
          ...result[resolver.type],
          resolver.rule.execute(actionReference)
        ]
      }
    }, this.createEmptyReferenceMap())
  }

  findRule(
    actionReference: ReferenceEntry
  ): {
    type: 'dispatchers' | 'handlers'
    rule: ActionResolver
  } | null {
    return (
      this.resolverPipeline.find(resolver =>
        resolver.rule.canExecute(actionReference)
      ) || null
    )
  }

  private flattenResolvers(
    configuration: ActionRuleRunnerConfiguration
  ): { type: 'dispatchers' | 'handlers'; rule: ActionResolver }[] {
    return [
      ...configuration.dispatchers.map(rule => ({
        type: 'dispatchers' as const,
        rule
      })),
      ...configuration.handlers.map(rule => ({
        type: 'handlers' as const,
        rule
      }))
    ]
  }

  private createEmptyReferenceMap(): ActionReferenceMap {
    return {
      dispatchers: [],
      handlers: []
    }
  }
}
