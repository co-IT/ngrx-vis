import { ActionContext } from '../core/action-context'
import { DataSet, Edge, Node } from './index'
import { createNode } from './create-node'
import { createEdge } from './create-edge'
import { createEmptyDataSet } from './create-empty-data-set'

export function createNetwork(actionContexts: ActionContext[]): DataSet {
  return actionContexts.reduce((dataSet, actionContext) => {
    const actionNode = createNode(actionContext.actionType, 0, 'action')

    const dispatcherNodes = actionContext.dispatchers.map(actionDispatcher =>
      createNode(actionDispatcher.fileName, 1, 'component')
    )

    const actionNodeToDispatcherNodesEdges = dispatcherNodes.map(
      dispatcherNode => createEdge(actionNode, dispatcherNode)
    )

    const dispatchNode = createNode('triggers', 2, 'dispatch')

    const dispatcherNodesToDispatchNodeEdges = dispatcherNodes.map(
      dispatcherNode => createEdge(dispatcherNode, dispatchNode)
    )

    const followUpActionNodes: Node[] = []
    const actionHandlerToFollowUpActionEdges: Edge[] = []

    const handlerNodes = actionContext.handlers.map(actionHandler => {
      const actionHandlerNode = createNode(actionHandler.fileName, 3, 'effect')

      if (actionHandler.followUpActions) {
        const followUpDispatchNode = createNode('dispatches', 4, 'dispatch')
        actionHandlerToFollowUpActionEdges.push(
          createEdge(actionHandlerNode, followUpDispatchNode)
        )
        const effectFollowUpActionNodes = actionHandler.followUpActions.map(
          followUpAction => createNode(followUpAction, 5, 'action')
        )
        followUpActionNodes.push(
          followUpDispatchNode,
          ...effectFollowUpActionNodes
        )
        actionHandlerToFollowUpActionEdges.push(
          ...effectFollowUpActionNodes.map(effectFollowUpActionNode =>
            createEdge(followUpDispatchNode, effectFollowUpActionNode)
          )
        )
      }

      return actionHandlerNode
    })

    const dispatchNodeToHandlerNodesEdges = handlerNodes.map(handlerNode =>
      createEdge(dispatchNode, handlerNode)
    )

    return {
      nodes: [
        ...dataSet.nodes,
        actionNode,
        ...dispatcherNodes,
        dispatchNode,
        ...handlerNodes,
        ...followUpActionNodes
      ],
      edges: [
        ...dataSet.edges,
        ...actionNodeToDispatcherNodesEdges,
        ...dispatcherNodesToDispatchNodeEdges,
        ...dispatchNodeToHandlerNodesEdges,
        ...actionHandlerToFollowUpActionEdges
      ]
    }
  }, createEmptyDataSet())
}
