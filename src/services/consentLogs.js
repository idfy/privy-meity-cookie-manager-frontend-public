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

/* eslint-disable camelcase */
import { logMessage } from 'utils/helperUtils'
import { CONSENT_LOGS_ENDPOINTS } from './http_module/endpoints'
import { httpCall } from './http_module/httpCall'

export async function getConsentlogs({ domainId, bannerId, currentPage, pageSize, startTime, endTime }) {
  try {
    const params = {
      domain_id: domainId,
      banner_id: bannerId,
      page: currentPage,
      page_size: pageSize
    }
    if (startTime) {
      params.start_time = new Date(startTime).toISOString()
    }
    if (endTime) {
      params.end_time = new Date(endTime).toISOString()
    }

    const httpDetails = { ...CONSENT_LOGS_ENDPOINTS.getConsentlogs, params }
    const response = await httpCall(httpDetails)
    logMessage('response for consent logs', response)
    return response
  } catch (error) {
    logMessage('error fetching consent logs :', error, 'error')
  }
}
