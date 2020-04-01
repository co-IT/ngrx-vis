import { basename } from 'path'
import { ReferenceEntry, SyntaxKind } from 'ts-morph'
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
    return {
      fileName: basename(actionReference.getSourceFile().getFilePath()),
      filePath: actionReference.getSourceFile().getFilePath(),
      category: 'effect',
      followUpActions: extractAllActionTypes(
        actionReference
          .getNode()
          .getFirstAncestorByKind(SyntaxKind.PropertyDeclaration)
      )
    }
  }
}
