import { Project, SourceFile, VariableDeclaration } from 'ts-morph'
import { inspect } from 'util'
import { ActionRuleRunner } from './core/action-rule-runner'
import {
  EffectDispatcherRule,
  EffectProcessingRule,
  ReducerProcessingRule,
  StoreDispatcherRule
} from './rules'
import {
  extractActionPayload,
  extractActionType,
  isTypedAction
} from './utils/ngrx'

export function identifyReferences(declaration: VariableDeclaration): any {
  const parser = new ActionRuleRunner({
    dispatchers: [new StoreDispatcherRule(), new EffectDispatcherRule()],
    reducers: [new ReducerProcessingRule()],
    effects: [new EffectProcessingRule()]
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
