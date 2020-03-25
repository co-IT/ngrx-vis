import { Project, SourceFile, VariableDeclaration } from 'ts-morph'
import { inspect } from 'util'
import { ActionResolverRunner } from './core/action-rule-runner'
import {
  EffectDispatcherRule,
  EffectProcessingResolver,
  ReducerProcessingResolver,
  StoreDispatcherResolver
} from './resolvers'
import {
  extractActionPayload,
  extractActionType,
  isTypedAction
} from './utils/ngrx'

export function identifyReferences(declaration: VariableDeclaration): any {
  const parser = new ActionResolverRunner({
    dispatchers: [new StoreDispatcherResolver(), new EffectDispatcherRule()],
    handlers: [new ReducerProcessingResolver(), new EffectProcessingResolver()]
  })

  const references = declaration
    .findReferences()
    .flatMap(referenceSymbol => referenceSymbol.getReferences())

  return parser.run(references)
}

export function findActions(file: SourceFile): object {
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

const project = new Project({ tsConfigFilePath: `./ngrx-app/tsconfig.json` })
const files = project.getSourceFiles('**/*.actions.ts')

const result = files.map(file => findActions(file))
console.log(inspect(result, false, 5))
