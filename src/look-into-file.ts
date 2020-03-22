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
  const storeDispatchContext = new StoreDispatchContext()
  const effectContext = new EffectContext()
  const effectDispatchContext = new EffectDispatchContext()
  const actionReducerContext = new ReducerContext()

  if (storeDispatchContext.isMatch(actionReference)) {
    // console.log('Store Dispatch', actionStoreContext.getInfo(actionReference))
    result = storeDispatchContext.getInfo(actionReference)
  }
  if (effectContext.isMatch(actionReference)) {
    // console.log('Effect', actionEffectContext.getInfo(actionReference))
    result = effectContext.getInfo(actionReference)
  }
  if (actionReducerContext.isMatch(actionReference)) {
    // console.log('Reducer', actionReducerContext.getInfo(actionReference))
    result = actionReducerContext.getInfo(actionReference)
  }

  if (effectDispatchContext.isMatch(actionReference)) {
    console.log(
      'Effect Dispatch',
      effectDispatchContext.getInfo(actionReference)
    )

    result = effectDispatchContext.getInfo(actionReference)
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
    const caller = actionReference
      .getNode()
      .getFirstAncestorByKind(SyntaxKind.PropertyDeclaration)

    // console.log(extractNgRxActionType(actionReference))
    // console.log('Effect property', caller?.getType().getText())

    return !caller
      ? false
      : caller
          ?.getType()
          .getText()
          .includes(extractNgRxActionType(actionReference))
  }

  getInfo(actionReference: ReferenceEntry): ActionUsageInfo {
    return {
      declaredName: actionReference.getNode().getText(),
      filePath: actionReference.getSourceFile().getFilePath()
    }
  }
}

function extractNgRxActionType(actionReference: ReferenceEntry): string {
  const fullQualifiedImport = actionReference
    .getNode()
    .getType()
    .getText()

  const [, typedAction] =
    /.+(TypedAction<".+">).+/.exec(fullQualifiedImport) || []

  return typedAction
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
