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

import { httpCall } from './http_module/httpCall'
import { COOKIE_ENDPOINTS } from './http_module/endpoints'
import { logMessage } from 'utils/helperUtils'

export async function addCookie(scanId, cookieData) {
  try {
    const httpDetails = { ...COOKIE_ENDPOINTS.addCookie }

    httpDetails.params = {
      // eslint-disable-next-line camelcase
      domain_id: cookieData.domainId,
      cookies: cookieData.cookies
    }

    httpDetails.url = `${httpDetails.url}/${scanId}`
    return await httpCall(httpDetails)
  } catch (error) {
    logMessage('Error while adding manual cookie:', error, 'error')
    throw error
  }
}

export async function deleteCookie({ cookieId, domainId }) {
  try {
    const httpDetails = { ...COOKIE_ENDPOINTS.deleteCookie }

    httpDetails.params = {
      // eslint-disable-next-line camelcase
      cookie_id: cookieId,
      // eslint-disable-next-line camelcase
      domain_id: domainId
    }

    return await httpCall(httpDetails)
  } catch (error) {
    logMessage('Error deleting manual cookie:', error, 'error')
    throw error
  }
}

export async function updateManualCookie(scanId, cookieData) {
  try {
    const httpDetails = { ...COOKIE_ENDPOINTS.updateManualCookie }

    httpDetails.url = `${httpDetails.url}/${scanId}`
    httpDetails.params = cookieData

    return await httpCall(httpDetails)
  } catch (error) {
    logMessage('Error updating manual cookie:', error, 'error')
    throw error
  }
}

export async function uploadCSV(scanId, formData) {
  try {
    const httpDetails = {
      method: 'post',
      url: `${COOKIE_ENDPOINTS.uploadCSV.url}/${scanId}`,
      data: formData
    }
    return await httpCall(httpDetails)
  } catch (error) {
    logMessage('Error uploading CSV:', error, 'error')
    throw error
  }
}
