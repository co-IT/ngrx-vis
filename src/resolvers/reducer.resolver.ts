import { basename } from 'path'
import { ReferenceEntry } from 'ts-morph'
import { ActionHandler } from '../core/action-handler'
import { ActionResolver } from '../core/action-reference-resolver'
import { getCaller } from '../utils/ts-morph'

export class ReducerProcessingResolver implements ActionResolver {
  canExecute(actionReference: ReferenceEntry): boolean {
    const caller = getCaller(actionReference.getNode())
    return !caller ? false : caller.getText().includes('on(')
  }
  execute(actionReference: ReferenceEntry): ActionHandler {
    return {
      fileName: basename(actionReference.getSourceFile().getFilePath()),
      filePath: actionReference.getSourceFile().getFilePath(),
      category: 'reducer'
    }
  }
}
