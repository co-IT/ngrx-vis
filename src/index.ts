import { promises as fs } from 'fs'
import { Project, SourceFile, VariableDeclaration } from 'ts-morph'
import { inspect } from 'util'
import {
  ActionReferenceMap,
  ActionResolverRunner
} from './core/action-rule-runner'
import { ActionUsageInfo } from './core/action-usage-info'
import {
  EffectDispatcherRule,
  EffectProcessingResolver,
  ReducerProcessingResolver,
  StoreDispatcherResolver
} from './resolvers'
import {
  extractActionPayload,
  extractActionType,
  isTypedAction
} from './utils/ngrx'

export function identifyReferences(
  declaration: VariableDeclaration
): ActionReferenceMap {
  const parser = new ActionResolverRunner({
    dispatchers: [new StoreDispatcherResolver(), new EffectDispatcherRule()],
    handlers: [new ReducerProcessingResolver(), new EffectProcessingResolver()]
  })

  const references = declaration
    .findReferences()
    .flatMap(referenceSymbol => referenceSymbol.getReferences())

  return parser.run(references)
}

export interface ActionContext {
  filePath: string
  declaredName: string
  actionType: string
  actionPayloadType: string | null
  dispatchers: ActionUsageInfo[]
  handlers: ActionUsageInfo[]
}

export interface VisJsDataSet {
  nodes: any[]
  edges: any[]
}
export type VisJsNodeId = string

export interface VisJsNode {
  id: VisJsNodeId
  level: number
  label: string
  group: string
}

export interface VisJsEdge {
  from: VisJsNodeId
  to: VisJsNodeId
  arrows: 'to'
}

export function findActions(file: SourceFile): ActionContext[] {
  return file
    .getVariableDeclarations()
    .filter(isTypedAction)
    .map(declaration => ({
      filePath: file.getFilePath(),
      declaredName: declaration.getName(),
      actionType: extractActionType(declaration),
      actionPayloadType: extractActionPayload(declaration),
      ...identifyReferences(declaration)
    }))
}

function createEmptyVisJsDataSet(): VisJsDataSet {
  return { nodes: [], edges: [] }
}

function toVisJsNetwork(actionContexts: ActionContext[]): VisJsDataSet {
  console.log(inspect(actionContexts, false, 6))

  return actionContexts.reduce((dataSet, actionContext) => {
    const actionNode = createVisJsNode(
      createId(),
      actionContext.actionType,
      0,
      'action'
    )

    const dispatcherNodes = actionContext.dispatchers.map(actionDispatcher =>
      createVisJsNode(createId(), actionDispatcher.filePath, 1, 'component')
    )

    const actionNodeToDispatcherNodesEdges = dispatcherNodes.map(
      dispatcherNode => createVisJsEdge(actionNode, dispatcherNode)
    )

    const dispatchNode = createVisJsNode(createId(), 'triggers', 2, 'dispatch')

    const dispatcherNodesToDispatchNodeEdges = dispatcherNodes.map(
      dispatcherNode => createVisJsEdge(dispatcherNode, dispatchNode)
    )

    const followUpActionNodes: VisJsNode[] = []
    const actionHandlerToFollowUpActionEdges: VisJsEdge[] = []

    const handlerNodes = actionContext.handlers.map(actionHandler => {
      const actionHandlerNode = createVisJsNode(
        createId(),
        actionHandler.filePath,
        3,
        'effect'
      )

      if (actionHandler.followUpActions) {
        const effectFollowUpActionNodes = actionHandler.followUpActions.map(
          followUpAction =>
            createVisJsNode(createId(), followUpAction, 4, 'action')
        )
        followUpActionNodes.push(...effectFollowUpActionNodes)
        actionHandlerToFollowUpActionEdges.push(
          ...effectFollowUpActionNodes.map(effectFollowUpActionNode =>
            createVisJsEdge(actionHandlerNode, effectFollowUpActionNode)
          )
        )
      }

      return actionHandlerNode
    })

    const dispatchNodeToHandlerNodesEdges = handlerNodes.map(handlerNode =>
      createVisJsEdge(dispatchNode, handlerNode)
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
  }, createEmptyVisJsDataSet())
}
function createWebView(dataSet: VisJsDataSet) {
  fs.copyFile('./src/web-view/index.html', './ngrx-vis/index.html')
    .then(() => fs.readFile('./ngrx-vis/index.html', { encoding: 'utf-8' }))
    .then(indexHtml =>
      indexHtml
        .replace('/* __NETWORK_NODES__ */', JSON.stringify(dataSet.nodes))
        .replace('/* __NETWORK_EDGES__ */', JSON.stringify(dataSet.edges))
    )
    .then(filledIndexHtml =>
      fs.writeFile('./ngrx-vis/index.html', filledIndexHtml)
    )
}

function createVisJsNode(
  id: VisJsNodeId,
  label: string,
  level: number,
  group: string
): VisJsNode {
  return { id, label, level, group }
}

function createVisJsEdge(from: VisJsNode, to: VisJsNode): VisJsEdge {
  return {
    from: from.id,
    to: to.id,
    arrows: 'to'
  }
}

function createId(): string {
  return (
    Math.random()
      .toString(36)
      .substring(2) + Date.now().toString(36)
  )
}

const project = new Project({ tsConfigFilePath: `./ngrx-app/tsconfig.json` })
const files = project.getSourceFiles('**/*.actions.ts')
const actionContexts = files.flatMap(file => findActions(file))
const dataSet = toVisJsNetwork(actionContexts)

createWebView(dataSet)
