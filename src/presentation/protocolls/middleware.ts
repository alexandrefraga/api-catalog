import { HttpResponse } from './http'

export interface Middleware <T = any>{
  execute (request: T): Promise<HttpResponse>
}
