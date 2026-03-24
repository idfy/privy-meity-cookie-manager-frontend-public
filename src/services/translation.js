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

import { TRANSLATION_ENDPOINTS } from './http_module/endpoints'
import { httpCall } from './http_module/httpCall'
import { logMessage } from 'utils/helperUtils'

export async function initiateScanTranslation({
  domainId,
  scanId,
  languages
}) {
  try {
    // eslint-disable-next-line camelcase
    const httpDetails = { ...TRANSLATION_ENDPOINTS.initiateScanTranslation, params: { scan_id: scanId, domain_id: domainId, languages } }

    const response = await httpCall(httpDetails)
    logMessage('translation initiation response:', response)
    return response
  } catch (error) {
    logMessage('error initiating translation:', error, 'error')
    throw error
  }
}

export async function initiateTemplateTranslation({ templateId, modifiedValues, languages }) {
  try {
    // eslint-disable-next-line camelcase
    const params = { template_id: templateId }
    if (modifiedValues && Object.keys(modifiedValues).length > 0) {
      // eslint-disable-next-line camelcase
      params.modified_values = modifiedValues
    }
    if (languages && languages.length > 0) {
      params.languages = languages
    }

    const httpDetails = { ...TRANSLATION_ENDPOINTS.initiateTemplateTranslation, params }
    console.log('httpDetails', httpDetails, templateId)
    const response = await httpCall(httpDetails)
    console.log('translation response', response)
    return response
  } catch (error) {
    logMessage('error initiating template translation', error, 'error')
    throw error
  }
}
