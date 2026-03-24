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
import { DOMAIN_ENDPOINTS } from './http_module/endpoints'
import { logMessage } from 'utils/helperUtils'

export async function addDomain(inputUrl) {
  try {
    const httpDetails = DOMAIN_ENDPOINTS.addDomain
    httpDetails.params = { url: inputUrl }
    const response = await httpCall(httpDetails)
    logMessage('add domain res: ', response)
    return response
  } catch (error) {
    logMessage('error adding domain :', error, 'error')
    return {
      ok: false,
      message: 'There was an error fetching the data!',
      responseStatus: 500
    }
  }
}

export async function fetchAllDomains({ currentPage, pageSize }) {
  try {
    const httpDetails = DOMAIN_ENDPOINTS.showAllDomains
    // eslint-disable-next-line camelcase
    httpDetails.params = { page: currentPage, page_size: pageSize }
    const response = await httpCall(httpDetails)
    logMessage('get all domains res : ', response)
    return response
  } catch (error) {
    logMessage('Error Fetching Domains', error, 'error')
  }
}
