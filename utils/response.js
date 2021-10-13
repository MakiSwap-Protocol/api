export function createResponse(statusCode, body) {
  return {
    body: JSON.stringify(body),
    statusCode,
    headers: {
      'content-type': 'application/json'
    }
  }
}

export function createSuccessResponse(body) {
  return createResponse(200, body)
}

export function createErrorResponse(code, message) {
  return createResponse(code, { errorCode: code, message })
}

export function createBadRequestResponse(message = 'Bad request') {
  return createErrorResponse(400, message)
}

export function createServerErrorResponse(error) {
  return createErrorResponse(500, error.message)
}
