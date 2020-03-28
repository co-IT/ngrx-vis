import { basename } from 'path'
import { ReferenceEntry } from 'ts-morph'
import { ActionResolver } from '../core/action-reference-resolver'
import { ActionUsageInfo } from '../core/action-usage-info'
import { getCaller } from '../utils/ts-morph'

export class StoreDispatcherResolver implements ActionResolver {
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
      fileName: basename(actionReference.getSourceFile().getFilePath()),
      filePath: actionReference.getSourceFile().getFilePath()
    }
  }
}
