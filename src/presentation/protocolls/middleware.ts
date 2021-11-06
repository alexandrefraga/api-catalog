import { HttpRequest } from './http'
import { HttpResponse } from '@/presentation/controllers/controller'

export interface Middleware{
  execute (request: HttpRequest): Promise<HttpResponse>
}
