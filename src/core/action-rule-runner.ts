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
      const resolvers = this.findRules(actionReference)

      resolvers.forEach(resolver => {
        result = {
          ...result,
          [resolver.type]: [
            ...result[resolver.type],
            resolver.rule.execute(actionReference)
          ]
        }
      })

      return result
    }, this.createEmptyReferenceMap())
  }

  findRules(
    actionReference: ReferenceEntry
  ): {
    type: 'dispatchers' | 'handlers'
    rule: ActionResolver
  }[] {
    return this.resolverPipeline.filter(resolver =>
      resolver.rule.canExecute(actionReference)
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
