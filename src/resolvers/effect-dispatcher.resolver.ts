import { basename } from 'path'
import { PropertyDeclaration, ReferenceEntry, SyntaxKind } from 'ts-morph'
import { ActionResolver } from '../core/action-reference-resolver'
import { ActionUsageInfo } from '../core/action-usage-info'
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

  execute(actionReference: ReferenceEntry): ActionUsageInfo {
    return {
      fileName: basename(actionReference.getSourceFile().getFilePath()),
      filePath: actionReference.getSourceFile().getFilePath()
    }
  }

  private isDispatchDisabled(effectDeclaration: PropertyDeclaration) {
    return effectDeclaration.getText().includes('{ dispatch: false }')
  }
}
