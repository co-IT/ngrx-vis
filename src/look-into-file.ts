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
  const ancestor = actionReference
    .getNode()
    .getFirstAncestorByKind(SyntaxKind.CallExpression)

  if (!ancestor) {
    return null
  }

  const ancestorTypeText = ancestor.getType().getText()

  const tester = new ActionStoreContext()
  console.log('ACTIONSTORECONTEXT' + tester.isMatch(actionReference))

  if (
    ancestorTypeText.includes('.TypedAction') &&
    !ancestorTypeText.includes('.OperatorFunction')
  ) {
    const grandAncestor = ancestor.getFirstAncestorByKind(
      SyntaxKind.CallExpression
    )
    console.log('===== ' + grandAncestor?.getText())

    if (grandAncestor?.getText().includes('.dispatch(')) {
      return { type: 'Dispatched', ancestorTypeText, actionReference }
    }

    return { type: 'Use of ActionCreator', ancestorTypeText, actionReference }
  } else if (
    ancestorTypeText.includes('.OperatorFunction') &&
    ancestor.getText().includes('ofType(')
  ) {
    console.log(ancestor.getText())

    return { type: 'Processed in Effect', ancestorTypeText, actionReference }
  } else if (ancestorTypeText.includes('.On')) {
    return { type: 'Processed in Reducer', ancestorTypeText, actionReference }
  }

  return null
}

function identifyReferences(declaration: VariableDeclaration): string[] {
  return declaration.findReferences().flatMap(referenceSymbol =>
    referenceSymbol.getReferences().map(reference => {
      console.log(identifyActionReferencePurpose(reference))

      return reference.getSourceFile().getFilePath()
    })
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

interface ActionUsageIdentificationRules {
  dispatchers: ActionUsageContext[]
  reducers: ActionUsageContext[]
  effects: ActionUsageContext[]
}

class ActionContextParser {
  constructor(usageIdentificationRules: ActionUsageIdentificationRules) {}

  run() {}
}

interface ActionUsageContext {
  isMatch(actionReference: ReferenceEntry): boolean
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
}

class ActionReducerContext implements ActionUsageContext {
  isMatch(actionReference: ReferenceEntry): boolean {
    const caller = getCaller(actionReference.getNode())
    return !caller ? false : caller.getText().includes('on(')
  }
}

class ActionEffectContext implements ActionUsageContext {
  isMatch(actionReference: ReferenceEntry): boolean {
    const caller = getCaller(actionReference.getNode())
    return !caller ? false : caller.getText().includes('ofType(')
  }
}

function getCaller(
  node: Node<ts.Node>
): CallExpression<ts.CallExpression> | undefined {
  return node.getFirstAncestorByKind(SyntaxKind.CallExpression)
}
