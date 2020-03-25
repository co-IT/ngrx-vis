import {
  CallExpression,
  Node,
  ReferenceEntry,
  SourceFile,
  SyntaxKind,
  ts,
  VariableDeclaration
} from 'ts-morph'

function identifyReferences(declaration: VariableDeclaration): any {
  const parser = new ActionContextParser({
    dispatchers: [new StoreDispatchContext(), new EffectDispatchContext()],
    reducers: [new ReducerContext()],
    effects: [new EffectContext()]
  })

  const references = declaration
    .findReferences()
    .flatMap(referenceSymbol => referenceSymbol.getReferences())

  return parser.run(references)
}

export function findActions(file: SourceFile): object {
  return file
    .getVariableDeclarations()
    .filter(isNgRxTypedAction)
    .map(declaration => ({
      filePath: file.getFilePath(),
      declaredName: declaration.getName(),
      actionType: extractNgRxActionType(declaration),
      actionPayloadType: extractNgRxActionPayload(declaration),
      ...identifyReferences(declaration)
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
  private rulePipeline: {
    type: 'dispatchers' | 'reducers' | 'effects'
    rule: ActionUsageContext
  }[]

  constructor(usageIdentificationRules: ActionUsageIdentificationRules) {
    this.rulePipeline = [
      ...usageIdentificationRules.dispatchers.map(rule => ({
        type: 'dispatchers' as const,
        rule
      })),
      ...usageIdentificationRules.reducers.map(rule => ({
        type: 'reducers' as const,
        rule
      })),
      ...usageIdentificationRules.effects.map(rule => ({
        type: 'effects' as const,
        rule
      }))
    ]
  }

  run(
    actionReferences: ReferenceEntry[]
  ): {
    dispatchers: ActionUsageInfo[]
    effects: ActionUsageInfo[]
    reducers: ActionUsageInfo[]
  } {
    return actionReferences.reduce(
      (result, actionReference) => {
        const usageInfo = this.runSingle(actionReference)
        return !usageInfo
          ? result
          : {
              ...result,
              [usageInfo.type]: [
                ...result[usageInfo.type],
                usageInfo.actionUsageInfo
              ]
            }
      },
      {
        dispatchers: [],
        effects: [],
        reducers: []
      }
    )
  }

  runSingle(
    actionReference: ReferenceEntry
  ): {
    type: 'dispatchers' | 'reducers' | 'effects'
    actionUsageInfo: ActionUsageInfo
  } | null {
    for (let rule of this.rulePipeline) {
      if (rule.rule.isMatch(actionReference)) {
        return {
          type: rule.type,
          actionUsageInfo: rule.rule.getInfo(actionReference)
        }
      }
    }

    return null
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

    return !caller
      ? false
      : caller
          ?.getType()
          .getText()
          .includes(extractNgRxActionType(actionReference.getNode()))
  }

  getInfo(actionReference: ReferenceEntry): ActionUsageInfo {
    return {
      declaredName: actionReference.getNode().getText(),
      filePath: actionReference.getSourceFile().getFilePath()
    }
  }
}

function extractNgRxActionType(actionReference: Node<ts.Node>): string {
  const fullQualifiedImport = actionReference.getType().getText()

  const [, typedAction] =
    /.+(TypedAction<".+">).+/.exec(fullQualifiedImport) || []

  return typedAction
}

function extractNgRxActionPayload(
  actionReference: Node<ts.Node>
): string | null {
  const fullQualifiedImport = actionReference.getType().getText()

  const [, payloadDefinedByProps] =
    /.+\(props: ({.+})\).+/.exec(fullQualifiedImport) || []

  const [, payloadDefinedByFunctionWithParameters] =
    /.+FunctionWithParametersType<\[.+\], ({.+}).+/.exec(fullQualifiedImport) ||
    []

  return payloadDefinedByProps || payloadDefinedByFunctionWithParameters || null
}

function isNgRxTypedAction(declaration: Node<ts.Node>): boolean {
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
