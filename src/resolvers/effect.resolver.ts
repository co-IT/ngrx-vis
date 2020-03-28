import { basename } from 'path'
import { ReferenceEntry, SyntaxKind } from 'ts-morph'
import { ActionResolver } from '../core/action-reference-resolver'
import { ActionUsageInfo } from '../core/action-usage-info'
import { extractAllActionTypes } from '../utils/ngrx'
import { getCaller } from '../utils/ts-morph'

export class EffectProcessingResolver implements ActionResolver {
  canExecute(actionReference: ReferenceEntry): boolean {
    const caller = getCaller(actionReference.getNode())
    return !caller ? false : caller.getText().includes('ofType(')
  }

  execute(actionReference: ReferenceEntry): ActionUsageInfo {
    return {
      fileName: basename(actionReference.getSourceFile().getFilePath()),
      filePath: actionReference.getSourceFile().getFilePath(),
      followUpActions: extractAllActionTypes(
        actionReference
          .getNode()
          .getFirstAncestorByKind(SyntaxKind.PropertyDeclaration)!
      )
    }
  }
}
