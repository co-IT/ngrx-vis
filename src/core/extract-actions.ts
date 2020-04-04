import { ActionContext } from './action-context'

export function extractActions(
  actionContexts: ActionContext[]
): {
  id: string
  typeScope: string
  typeDescription: string
}[] {
  return actionContexts.map(context => ({
    id: context.id,
    typeFull: context.actionMeta.typeFull || 'not set',
    typeScope: context.actionMeta.typeScope || 'not set',
    typeDescription: context.actionMeta.typeDescription || 'not set'
  }))
}
