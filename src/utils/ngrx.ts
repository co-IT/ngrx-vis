import { Node, ts } from 'ts-morph'

export function extractActionType(actionReference: Node<ts.Node>): string {
  const fullQualifiedImport = actionReference.getType().getText()
  const [, typedAction = ''] =
    /.+TypedAction<"(.*?)">.+/.exec(fullQualifiedImport) || []

  return typedAction
}

export function extractAllActionTypes(
  actionReference?: Node<ts.Node>
): string[] {
  const fullQualifiedImport = actionReference?.getType().getText() || ''

  return Array.from(
    fullQualifiedImport.matchAll(/TypedAction<"(.*?)">/g),
    m => m[1]
  )
}

export function extractActionPayload(
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

export function segmentAction(
  actionType: string
): {
  typeFull: string
  typeScope?: string
  typeDescription?: string
} {
  if (/\[[\w ]+\][\w ]+/.test(actionType)) {
    const [typeScope, typeDescription] = actionType.split(']')
    return { typeFull: actionType, typeScope, typeDescription }
  } else {
    return { typeFull: actionType }
  }
}

export function isTypedAction(declaration: Node<ts.Node>): boolean {
  return declaration
    .getType()
    .getText()
    .includes('.TypedAction<')
}
