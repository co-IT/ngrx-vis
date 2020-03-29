import { Project, SourceFile, VariableDeclaration } from 'ts-morph'
import { ActionContext } from './action-context'
import {
  extractActionPayload,
  extractActionType,
  isTypedAction
} from '../utils/ngrx'
import { ActionReferenceMap, ActionResolverRunner } from './action-rule-runner'
import {
  EffectDispatcherRule,
  EffectProcessingResolver,
  ReducerProcessingResolver,
  StoreDispatcherResolver
} from '../resolvers'

export class NgRxActionInspector {
  constructor(
    private pathToTsConfig: string,
    private actionFilesGlob = '**/*.actions.ts'
  ) {}

  inspect(): ActionContext[] {
    const project = new Project({
      tsConfigFilePath: `./ngrx-example-app/tsconfig.json`
    })

    const files = project.getSourceFiles(this.actionFilesGlob)
    return files.flatMap(file => this.findActions(file))
  }

  private findActions(file: SourceFile): ActionContext[] {
    return file
      .getVariableDeclarations()
      .filter(isTypedAction)
      .map(declaration => ({
        filePath: file.getFilePath(),
        declaredName: declaration.getName(),
        actionType: extractActionType(declaration),
        actionPayloadType: extractActionPayload(declaration),
        ...this.identifyReferences(declaration)
      }))
  }

  private identifyReferences(
    declaration: VariableDeclaration
  ): ActionReferenceMap {
    const parser = new ActionResolverRunner({
      dispatchers: [new StoreDispatcherResolver(), new EffectDispatcherRule()],
      handlers: [
        new ReducerProcessingResolver(),
        new EffectProcessingResolver()
      ]
    })

    const references = declaration
      .findReferences()
      .flatMap(referenceSymbol => referenceSymbol.getReferences())

    return parser.run(references)
  }
}
