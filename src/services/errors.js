/**
 * Open Bharat Digital Consent by IDfy
 * Copyright (c) 2025 Baldor Technologies Private Limited (IDfy)
 *
 * This software is licensed under the Privy Public License.
 * See LICENSE.md for the full terms of use.
 *
 * Unauthorized copying, modification, distribution, or commercial use
 * is strictly prohibited without prior written permission from IDfy.
 */

import { logMessage } from 'utils/helperUtils'

// Base function for creating custom exceptions
function createException(statusCode = 500, message = '', data = {}) {
  const error = new Error(message)
  error.name = 'BaseException'
  error.statusCode = statusCode
  error.data = data || {}
  return error
}

function UnexpectedError(message, statusCode = 500, data = {}) {
  const error = createException(statusCode, message, data)
  error.name = 'UnexpectedError'
  return error
}

function HTTPError(message, statusCode = 500, data = {}) {
  const error = createException(statusCode, message, data)
  error.name = 'HTTPError'
  logMessage(error)
  return error
}

const INTERNAL_SERVER_ERROR = 'Internal Server Error'

// const ERROR_TYPE_SET = new Set(["HTTPError", "UnexpectedError"]);

export { UnexpectedError, HTTPError, INTERNAL_SERVER_ERROR }
