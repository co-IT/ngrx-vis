import { ActionContext } from '../core/action-context'
import { createEdge } from './create-edge'
import { createEmptyDataSet } from './create-empty-data-set'
import { createNode } from './create-node'
import { DataSet, Edge, Node } from './index'

export function createNetwork(actionContexts: ActionContext[]): DataSet {
  return actionContexts.reduce((dataSet, actionContext) => {
    const actionNode = createNode(
      `${actionContext.actionMeta.typeScope}\\n${actionContext.actionMeta.typeDescription}`,
      0,
      'action',
      actionContext.id
    )

    const dispatcherNodes = actionContext.dispatchers.map(actionDispatcher =>
      createNode(
        actionDispatcher.caption || actionDispatcher.fileName,
        1,
        actionDispatcher.category
      )
    )

    const actionNodeToDispatcherNodesEdges = dispatcherNodes.map(
      dispatcherNode =>
        createEdge(actionNode, dispatcherNode, {
          dashes: true
        })
    )

    const dispatchNode = createNode('trigger', 2, 'dispatch')

    const dispatcherNodesToDispatchNodeEdges = dispatcherNodes.map(
      dispatcherNode => createEdge(dispatcherNode, dispatchNode)
    )

    const followUpActionNodes: Node[] = []
    const actionHandlerToFollowUpActionEdges: Edge[] = []

    const handlerNodes = actionContext.handlers.map(actionHandler => {
      const actionHandlerNode = createNode(
        actionHandler.caption || actionHandler.fileName,
        3,
        actionHandler.category
      )

      if (
        actionHandler.followUpActions &&
        actionHandler.followUpActions.length > 0
      ) {
        const followUpDispatchNode = createNode('dispatch', 4, 'dispatch')
        actionHandlerToFollowUpActionEdges.push(
          createEdge(actionHandlerNode, followUpDispatchNode)
        )
        const effectFollowUpActionNodes = actionHandler.followUpActions.map(
          followUpAction => createNode(followUpAction, 5, 'effect-action')
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
