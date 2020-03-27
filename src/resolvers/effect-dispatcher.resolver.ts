import { ReferenceEntry, SyntaxKind } from 'ts-morph'
import { ActionResolver } from '../core/action-reference-resolver'
import { ActionUsageInfo } from '../core/action-usage-info'
import { extractActionType } from '../utils/ngrx'

export class EffectDispatcherRule implements ActionResolver {
  canExecute(actionReference: ReferenceEntry): boolean {
    const caller = actionReference
      .getNode()
      .getFirstAncestorByKind(SyntaxKind.PropertyDeclaration)

    return !caller
      ? false
      : caller
          ?.getType()
          .getText()
          .replace(/"/g, '')
          .includes(extractActionType(actionReference.getNode()))
  }

  execute(actionReference: ReferenceEntry): ActionUsageInfo {
    return {
      filePath: actionReference.getSourceFile().getFilePath()
    }
  }
}
