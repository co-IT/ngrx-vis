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
  const actionStoreDispatchContext = new StoreDispatchContext()
  const actionEffectContext = new EffectContext()
  const actionReducerContext = new ReducerContext()

  if (actionStoreDispatchContext.isMatch(actionReference)) {
    // console.log('Store Dispatch', actionStoreContext.getInfo(actionReference))
    result = actionStoreDispatchContext.getInfo(actionReference)
  }
  if (actionEffectContext.isMatch(actionReference)) {
    // console.log('Effect', actionEffectContext.getInfo(actionReference))
    result = actionEffectContext.getInfo(actionReference)
  }
  if (actionReducerContext.isMatch(actionReference)) {
    // console.log('Reducer', actionReducerContext.getInfo(actionReference))
    result = actionReducerContext.getInfo(actionReference)
  }

  new EffectDispatchContext().isMatch(actionReference)

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
  return file
    .getVariableDeclarations()
    .filter(isNgRxTypedAction)
    .map(declaration => ({
      filePath: file.getFilePath(),
      declaredName: declaration.getName(),
      actionType: declaration.getType().getText(),
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

  run() {
    const usages = { dispatchers: new Set() }
  }
}

interface ActionUsageContext {
  isMatch(actionReference: ReferenceEntry): boolean
  getInfo(actionReference: ReferenceEntry): ActionUsageInfo
}

class StoreDispatchContext implements ActionUsageContext {
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

class ReducerContext implements ActionUsageContext {
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

class EffectContext implements ActionUsageContext {
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

class EffectDispatchContext implements ActionUsageContext {
  isMatch(actionReference: ReferenceEntry): boolean {
    const actionType = actionReference.getNode().getText()
    const caller = actionReference
      .getNode()
      .getFirstAncestorByKind(SyntaxKind.PropertyDeclaration)

    console.log('Type', actionType)

    console.log(
      'Action Type',
      actionReference
        .getNode()
        .getType()
        .getText()
    )

    console.log(extractNgRxActionType(actionReference))

    // console.log('Effect property', caller?.getType().getText())

    return !caller ? false : caller.getText().includes('ofType(')
  }

  getInfo(actionReference: ReferenceEntry): ActionUsageInfo {
    return {
      declaredName: actionReference.getNode().getText(),
      filePath: actionReference.getSourceFile().getFilePath()
    }
  }
}

function extractNgRxActionType(actionReference: ReferenceEntry): void {
  const fullQualifiedImport = actionReference
    .getNode()
    .getType()
    .getText()

  const matches = /.+(TypedAction<".+">).+/.exec(fullQualifiedImport) || []
  console.log(matches)
}

function isNgRxTypedAction(declaration: VariableDeclaration): boolean {
  return declaration
    .getType()
    .getText()
    .includes('.TypedAction<')
}

function getCaller(
  node: Node<ts.Node>
): CallExpression<ts.CallExpression> | undefined {
  return node.getFirstAncestorByKind(SyntaxKind.CallExpression)
}
