import { basename } from 'path'
import { PropertyDeclaration, ReferenceEntry, SyntaxKind } from 'ts-morph'
import { ActionHandler } from '../core/action-handler'
import { ActionResolver } from '../core/action-reference-resolver'
import { extractActionType, extractAllActionTypes } from '../utils/ngrx'

export class EffectDispatcherRule implements ActionResolver {
  canExecute(actionReference: ReferenceEntry): boolean {
    const effectDeclaration = actionReference
      .getNode()
      .getFirstAncestorByKind(SyntaxKind.PropertyDeclaration)

    return !effectDeclaration || this.isDispatchDisabled(effectDeclaration)
      ? false
      : extractAllActionTypes(effectDeclaration).some(
          actionType =>
            actionType === extractActionType(actionReference.getNode())
        )
  }

  execute(actionReference: ReferenceEntry): ActionHandler {
    const effectDeclaration = actionReference
      .getNode()
      .getFirstAncestorByKind(SyntaxKind.PropertyDeclaration)

    const propertyName = effectDeclaration?.getName()
    const fileName = basename(actionReference.getSourceFile().getFilePath())

    return {
      caption: `${propertyName} - ${fileName}`,
      fileName: fileName,
      filePath: actionReference.getSourceFile().getFilePath(),
      category: 'effect'
    }
  }

  private isDispatchDisabled(effectDeclaration: PropertyDeclaration): boolean {
    return effectDeclaration.getText().includes('{ dispatch: false }')
  }
}
