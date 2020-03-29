import { Project, SourceFile, VariableDeclaration } from 'ts-morph'
import { ActionReferenceMap, ActionResolverRunner } from './core/action-rule-runner'
import {
  EffectDispatcherRule,
  EffectProcessingResolver,
  ReducerProcessingResolver,
  StoreDispatcherResolver
} from './resolvers'
import { extractActionPayload, extractActionType, isTypedAction } from './utils/ngrx'
import { ActionContext } from './core/action-context'
import { createNetwork } from './visjs/create-network'
import { createWebView } from './web-view/create-web-view'

export function identifyReferences(
  declaration: VariableDeclaration
): ActionReferenceMap {
  const parser = new ActionResolverRunner({
    dispatchers: [new StoreDispatcherResolver(), new EffectDispatcherRule()],
    handlers: [new ReducerProcessingResolver(), new EffectProcessingResolver()]
  })

  const references = declaration
    .findReferences()
    .flatMap(referenceSymbol => referenceSymbol.getReferences())

  return parser.run(references)
}

export function findActions(file: SourceFile): ActionContext[] {
  return file
    .getVariableDeclarations()
    .filter(isTypedAction)
    .map(declaration => ({
      filePath: file.getFilePath(),
      declaredName: declaration.getName(),
      actionType: extractActionType(declaration),
      actionPayloadType: extractActionPayload(declaration),
      ...identifyReferences(declaration)
    }))
}

const project = new Project({
  tsConfigFilePath: `./ngrx-example-app/tsconfig.json`
})
const files = project.getSourceFiles('**/*.actions.ts')
const actionContexts = files.flatMap(file => findActions(file))
const dataSet = createNetwork(actionContexts)

createWebView(dataSet)
