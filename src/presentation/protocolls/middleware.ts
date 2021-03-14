import { HttpResponse } from './http'

export interface Middleware <T = any>{
  execute (data: T): Promise<HttpResponse>
}
