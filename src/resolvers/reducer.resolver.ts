import { ReferenceEntry } from 'ts-morph'
import { ActionResolver } from '../core/action-reference-resolver'
import { ActionUsageInfo } from '../core/action-usage-info'
import { getCaller } from '../utils/ts-morph'

export class ReducerProcessingResolver implements ActionResolver {
  canExecute(actionReference: ReferenceEntry): boolean {
    const caller = getCaller(actionReference.getNode())
    return !caller ? false : caller.getText().includes('on(')
  }
  execute(actionReference: ReferenceEntry): ActionUsageInfo {
    return {
      filePath: actionReference.getSourceFile().getFilePath()
    }
  }
}
