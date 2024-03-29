import { HttpResponse } from '@/presentation/controllers/controller'
import { ServerError, UnauthorizedError } from '@/presentation/errors'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const forbidden = (error: Error): HttpResponse => ({
  statusCode: 403,
  body: error
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack)
})

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError()
})

export const success = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})

export const created = (msg: string): HttpResponse => ({
  statusCode: 201,
  body: msg
})
