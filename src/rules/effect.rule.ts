import { ReferenceEntry } from 'ts-morph'
import { ActionRule } from '../core/action-reference-rule'
import { ActionUsageInfo } from '../core/action-usage-info'
import { getCaller } from '../utils/ts-morph'

export class EffectProcessingRule implements ActionRule {
  canExecute(actionReference: ReferenceEntry): boolean {
    const caller = getCaller(actionReference.getNode())
    return !caller ? false : caller.getText().includes('ofType(')
  }
  execute(actionReference: ReferenceEntry): ActionUsageInfo {
    return {
      declaredName: actionReference.getNode().getText(),
      filePath: actionReference.getSourceFile().getFilePath()
    }
  }
}
