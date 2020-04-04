import { Project, SourceFile, VariableDeclaration } from 'ts-morph'
import {
  EffectDispatcherRule,
  EffectProcessingResolver,
  ReducerProcessingResolver,
  StoreDispatcherResolver
} from '../resolvers'
import {
  extractActionPayload,
  extractActionType,
  isTypedAction,
  segmentAction
} from '../utils/ngrx'
import { ActionContext } from './action-context'
import { ActionReferenceMap, ActionResolverRunner } from './action-rule-runner'
import { createId } from './create-id'

export class NgRxVanillaInspector {
  private parser = new ActionResolverRunner({
    dispatchers: [new StoreDispatcherResolver(), new EffectDispatcherRule()],
    handlers: [new ReducerProcessingResolver(), new EffectProcessingResolver()]
  })

  constructor(
    private pathToTsConfig: string,
    private actionFilesGlob: string
  ) {}

  inspect(): ActionContext[] {
    const project = new Project({
      tsConfigFilePath: this.pathToTsConfig
    })

    const files = project.getSourceFiles(this.actionFilesGlob)
    return files.flatMap(file => this.findActions(file))
  }

  private findActions(file: SourceFile): ActionContext[] {
    return file
      .getVariableDeclarations()
      .filter(isTypedAction)
      .map(declaration => ({
        id: createId(),
        filePath: file.getFilePath(),
        actionMeta: {
          declaredName: declaration.getName(),
          ...segmentAction(extractActionType(declaration)),
          payloadType: extractActionPayload(declaration)
        },
        ...this.identifyReferences(declaration)
      }))
  }

  private identifyReferences(
    declaration: VariableDeclaration
  ): ActionReferenceMap {
    const references = declaration
      .findReferences()
      .flatMap(referenceSymbol => referenceSymbol.getReferences())

    return this.parser.run(references)
  }
}
