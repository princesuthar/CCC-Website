import type {
  ErrorRequestHandler,
  RequestHandler,
} from 'express'

export class ApiError extends Error {
  statusCode: number

  constructor(
    statusCode: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
  }
}

export const notFoundHandler: RequestHandler = (
  req,
  _res,
  next,
) => {
  next(
    new ApiError(
      404,
      `Route not found: ${req.method} ${req.path}`,
    ),
  )
}

export const errorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next,
) => {
  const statusCode =
    error instanceof ApiError
      ? error.statusCode
      : 500

  if (statusCode >= 500) {
    console.error('Unhandled server error:', error)
  }

  res.status(statusCode).json({
    success: false,
    message:
      statusCode >= 500
        ? 'An unexpected server error occurred'
        : error instanceof Error
          ? error.message
          : 'Request failed',
  })
}
