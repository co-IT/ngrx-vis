import { basename } from 'path'
import { PropertyDeclaration, ReferenceEntry, SyntaxKind } from 'ts-morph'
import { ActionHandler } from '../core/action-handler'
import { ActionResolver } from '../core/action-reference-resolver'
import { extractAllActionTypes } from '../utils/ngrx'
import { getCaller } from '../utils/ts-morph'

export class EffectProcessingResolver implements ActionResolver {
  canExecute(actionReference: ReferenceEntry): boolean {
    const caller = getCaller(actionReference.getNode())
    return !caller ? false : caller.getText().includes('ofType(')
  }

  execute(actionReference: ReferenceEntry): ActionHandler {
    const effectDeclaration = actionReference
      .getNode()
      .getFirstAncestorByKind(SyntaxKind.PropertyDeclaration)

    const propertyName = effectDeclaration?.getName()
    const fileName = basename(actionReference.getSourceFile().getFilePath())

    return {
      caption: `${propertyName} - ${fileName}`,
      fileName,
      filePath: actionReference.getSourceFile().getFilePath(),
      category: 'effect',
      followUpActions:
        effectDeclaration && !this.isDispatchDisabled(effectDeclaration)
          ? extractAllActionTypes(effectDeclaration)
          : []
    }
  }

  private isDispatchDisabled(effectDeclaration: PropertyDeclaration): boolean {
    console.log(
      effectDeclaration.getText().includes('{ dispatch: false }'),
      effectDeclaration.getText()
    )

    return effectDeclaration.getText().includes('{ dispatch: false }')
  }
}
