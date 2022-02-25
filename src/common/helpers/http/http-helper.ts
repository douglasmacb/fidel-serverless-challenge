import { ServerError, UnauthorizedError } from '../../../common/errors'
import { HttpResponse } from '../../../common/protocols/http'

export const formatJSONResponse = (response: Record<string, unknown>): HttpResponse => ({
  statusCode: 200,
  body: JSON.stringify(response)
})

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: JSON.stringify({
    status: 400,
    error: {
      date: new Date(),
      message: error.message
    }
  })
})

export const conflict = (error: Error): HttpResponse => ({
  statusCode: 409,
  body: JSON.stringify({
    status: 409,
    error: {
      date: new Date(),
      message: error.message
    }
  })
})

export const notFound = (error: Error): HttpResponse => ({
  statusCode: 404,
  body: JSON.stringify({
    status: 404,
    error: {
      date: new Date(),
      message: error.message
    }
  })
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: JSON.stringify({
    status: 500,
    error: {
      date: new Date(),
      message: new ServerError(error.stack)
    }
  })
})

export const ok = (data: Record<string, unknown>): HttpResponse => ({
  statusCode: 200,
  body: JSON.stringify({
    ...data,
    status: 200
  })
})

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: JSON.stringify({
    error: {
      date: new Date(),
      message: new UnauthorizedError()
    }
  })
})
