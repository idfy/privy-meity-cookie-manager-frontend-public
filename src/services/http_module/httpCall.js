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

import axios from 'axios'
import { customSleep } from './utils.js'
import { UnexpectedError, INTERNAL_SERVER_ERROR } from 'services/errors.js'
import get from 'lodash/get.js'
/**
 * Makes an HTTP request with exponential backoff retry capability.
 *
 * @param {Object} httpDetails - The details of the HTTP request.
 * @param {string} httpDetails.method - The HTTP method (e.g., 'get', 'post', 'put', 'delete').
 * @param {string} httpDetails.url - The URL for the HTTP request.
 * @param {Object} [httpDetails.headers] - The headers to include in the request.
 * @param {Object} [httpDetails.params] - The parameters to include in the request body for POST/PUT requests. - Optional for get types
 * @param {string} [httpDetails.response_type] - Optional. The response type (e.g., 'json', 'arraybuffer'). If mentioned defaults to json according to axios
 * @param {number[]} [httpDetails.noRetryStatusCodes=[400, 401, 403, 404, 405, 413, 414]] - Optional. Status codes that should not trigger a retry.
 * @param {number} [httpDetails.base_value_of_exponential_wait_time=2] - Optional. Base value for exponential backoff wait time.
 * @param {number} [httpDetails.max_power_of_exponential_wait_time=2] - Optional. Maximum power for exponential backoff wait time.
 * @param {number} [maxRetries=3] - Optional. The maximum number of retry attempts in case of failure.
 * @param {number} [currentRetry=0] - Optional. The current retry attempt number. Don't pass it while calling function
 * @returns {Promise<Object>} The response from the HTTP request.
 * @throws {HTTPError} Throws a custom HTTPError on failure with a message and optional data.
 */
async function httpCall(httpDetails, maxRetries = 3, currentRetry = 0) {
  const method = get(httpDetails, 'method')
  const url = get(httpDetails, 'url')

  const headers = get(httpDetails, 'headers', {})
  const params = get(httpDetails, 'params', {}) // JSON body
  const data = get(httpDetails, 'data', null) // FormData for CSV

  const responseType = get(httpDetails, 'response_type', '')
  const noRetryStatusCodes = get(httpDetails, 'noRetryStatusCodes', [400, 401, 403, 404, 405, 413, 414])
  const baseValueOfExponentialWaitTime = get(httpDetails, 'base_value_of_exponential_wait_time', 2)
  const maxPowerOfExponentialWaitTime = get(httpDetails, 'max_power_of_exponential_wait_time', 2)

  const config = {
    method,
    url,
    ...(headers && { headers }),
    ...(responseType && { responseType }),

    // GET → use query params
    ...(method === 'get' && { params }),
    ...(['post', 'put', 'patch'].includes(method) &&
      (data !== null && data !== undefined
        ? { data } // CSV upload (FormData)
        : { data: params }) // JSON body for other APIs
    )
  }

  try {
    const response = await axios(config)
    const statusCode = response?.status
    if (statusCode >= 200 && statusCode < 300) {
      return response
    }
    if (currentRetry < maxRetries && !noRetryStatusCodes.includes(statusCode)) {
      console.log(`currentRetrying ${currentRetry} attempts left...`)
      const waitTimeMs =
        baseValueOfExponentialWaitTime ** Math.min(currentRetry, maxPowerOfExponentialWaitTime) * 1000
      await customSleep(waitTimeMs)
      return await httpCall(httpDetails, maxRetries, currentRetry + 1)
    } else {
      redirectLogin(response)
      console.log('Max retries reached or statusCode in noRetryStatusCodes', response)
      return response
    }
  } catch (error) {
    redirectLogin(error.response)
    console.error('Error making HTTP request:', error)
    console.error(error?.response?.status)
    if (error.response && error.response.data) {
      return error.response
    }
    throw UnexpectedError(INTERNAL_SERVER_ERROR, 500, { message: INTERNAL_SERVER_ERROR, data: error })
  }
}

function redirectLogin(response) {
  const statusCode = response?.status
  const responseData = response?.data || {}

  const shouldRedirect = responseData.redirection === true

  if ((statusCode === 401 || statusCode === 403) && shouldRedirect) {
    const redirectUrl = responseData.data?.redirect_url
    if (redirectUrl) {
      window.location.href = redirectUrl
    }
  }
}

export { httpCall }
