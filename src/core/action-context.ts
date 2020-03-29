import { ActionUsageInfo } from './action-usage-info'

export interface ActionContext {

  filePath: string
  declaredName: string
  actionType: string
  actionPayloadType: string | null
  dispatchers: ActionUsageInfo[]
  handlers: ActionUsageInfo[]
}
