import { HttpResponse } from '@/presentation/protocolls'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})
