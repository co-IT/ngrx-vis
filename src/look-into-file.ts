import {
  CallExpression,
  Node,
  ReferenceEntry,
  SourceFile,
  SyntaxKind,
  ts,
  VariableDeclaration
} from 'ts-morph'

function identifyActionReferencePurpose(
  actionReference: ReferenceEntry
): null | object {
  let result = null
  const actionStoreContext = new ActionStoreContext()
  const actionEffectContext = new ActionEffectContext()
  const actionReducerContext = new ActionReducerContext()

  if (actionStoreContext.isMatch(actionReference)) {
    // console.log('Store Dispatch', actionStoreContext.getInfo(actionReference))
    result = actionStoreContext.getInfo(actionReference)
  }
  if (actionEffectContext.isMatch(actionReference)) {
    // console.log('Effect', actionEffectContext.getInfo(actionReference))
    result = actionEffectContext.getInfo(actionReference)
  }
  if (actionReducerContext.isMatch(actionReference)) {
    // console.log('Reducer', actionReducerContext.getInfo(actionReference))
    result = actionReducerContext.getInfo(actionReference)
  }

  return result
}

function identifyReferences(declaration: VariableDeclaration): any[] {
  return declaration
    .findReferences()
    .flatMap(referenceSymbol =>
      referenceSymbol
        .getReferences()
        .map(reference => identifyActionReferencePurpose(reference))
    )
}

export function findActions(file: SourceFile): object {
  return file.getVariableDeclarations().map(declaration => ({
    filePath: file.getFilePath(),
    name: declaration.getName(),
    type: declaration.getType().getText(),
    references: identifyReferences(declaration)
  }))
}

interface ActionUsageInfo {
  declaredName: string
  filePath: string
}

interface ActionUsageIdentificationRules {
  dispatchers: ActionUsageContext[]
  reducers: ActionUsageContext[]
  effects: ActionUsageContext[]
}

class ActionContextParser {
  rules: ActionUsageIdentificationRules

  constructor(usageIdentificationRules: ActionUsageIdentificationRules) {
    this.rules = usageIdentificationRules
  }

  run() {}
}

interface ActionUsageContext {
  isMatch(actionReference: ReferenceEntry): boolean
  getInfo(actionReference: ReferenceEntry): ActionUsageInfo
}

class ActionStoreContext implements ActionUsageContext {
  isMatch(actionReference: ReferenceEntry): boolean {
    const actionCreatorCall = getCaller(actionReference.getNode())
    const actionDispatchCall = actionCreatorCall
      ? getCaller(actionCreatorCall)
      : null

    return !actionDispatchCall
      ? false
      : actionDispatchCall.getText().includes('.dispatch(')
  }

  getInfo(actionReference: ReferenceEntry): ActionUsageInfo {
    return {
      declaredName: actionReference.getNode().getText(),
      filePath: actionReference.getSourceFile().getFilePath()
    }
  }
}

class ActionReducerContext implements ActionUsageContext {
  isMatch(actionReference: ReferenceEntry): boolean {
    const caller = getCaller(actionReference.getNode())
    return !caller ? false : caller.getText().includes('on(')
  }

  getInfo(actionReference: ReferenceEntry): ActionUsageInfo {
    return {
      declaredName: actionReference.getNode().getText(),
      filePath: actionReference.getSourceFile().getFilePath()
    }
  }
}

class ActionEffectContext implements ActionUsageContext {
  isMatch(actionReference: ReferenceEntry): boolean {
    const caller = getCaller(actionReference.getNode())
    return !caller ? false : caller.getText().includes('ofType(')
  }

  getInfo(actionReference: ReferenceEntry): ActionUsageInfo {
    return {
      declaredName: actionReference.getNode().getText(),
      filePath: actionReference.getSourceFile().getFilePath()
    }
  }
}

function getCaller(
  node: Node<ts.Node>
): CallExpression<ts.CallExpression> | undefined {
  return node.getFirstAncestorByKind(SyntaxKind.CallExpression)
}
