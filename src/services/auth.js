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
import { AUTH_ENDPOINTS } from './http_module/endpoints'
import { httpCall } from './http_module/httpCall'

export async function logout() {
  try {
    const httpDetails = { ...AUTH_ENDPOINTS.logout }
    const response = await httpCall(httpDetails)
    return response
  } catch (error) {
    logMessage('Error while logging out', error, 'error')
    throw error
  }
}
