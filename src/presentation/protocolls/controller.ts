import { HttpResponse } from './http'

export interface Controller <T = any>{
  execute (data: T): Promise<HttpResponse>
}
