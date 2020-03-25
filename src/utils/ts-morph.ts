import { CallExpression, Node, SyntaxKind, ts } from 'ts-morph'

export function getCaller(
  node: Node<ts.Node>
): CallExpression<ts.CallExpression> | undefined {
  return node.getFirstAncestorByKind(SyntaxKind.CallExpression)
}
