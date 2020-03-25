import { ReferenceEntry, SyntaxKind } from 'ts-morph'
import { ActionRule } from '../core/action-reference-rule'
import { ActionUsageInfo } from '../core/action-usage-info'
import { extractActionType } from '../utils/ngrx'

export class EffectDispatcherRule implements ActionRule {
  canExecute(actionReference: ReferenceEntry): boolean {
    const caller = actionReference
      .getNode()
      .getFirstAncestorByKind(SyntaxKind.PropertyDeclaration)

    return !caller
      ? false
      : caller
          ?.getType()
          .getText()
          .includes(extractActionType(actionReference.getNode()))
  }

  execute(actionReference: ReferenceEntry): ActionUsageInfo {
    return {
      declaredName: actionReference.getNode().getText(),
      filePath: actionReference.getSourceFile().getFilePath()
    }
  }
}
