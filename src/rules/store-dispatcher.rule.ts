import { ReferenceEntry } from 'ts-morph'
import { ActionRule } from '../core/action-reference-rule'
import { ActionUsageInfo } from '../core/action-usage-info'
import { getCaller } from '../utils/ts-morph'

export class StoreDispatcherRule implements ActionRule {
  canExecute(actionReference: ReferenceEntry): boolean {
    const actionCreatorCall = getCaller(actionReference.getNode())
    const actionDispatchCall = actionCreatorCall
      ? getCaller(actionCreatorCall)
      : null
    return !actionDispatchCall
      ? false
      : actionDispatchCall.getText().includes('.dispatch(')
  }
  execute(actionReference: ReferenceEntry): ActionUsageInfo {
    return {
      declaredName: actionReference.getNode().getText(),
      filePath: actionReference.getSourceFile().getFilePath()
    }
  }
}
