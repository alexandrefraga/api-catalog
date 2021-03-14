import { HttpRequest, HttpResponse } from './http'

export interface Middleware{
  execute (request: HttpRequest): Promise<HttpResponse>
}
