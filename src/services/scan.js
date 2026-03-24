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
import { SCANNER_ENDPOINTS } from './http_module/endpoints'
import { logMessage } from 'utils/helperUtils'

export async function initiateScan(domainId) {
  try {
    const httpDetails = { ...SCANNER_ENDPOINTS.initiateScan }
    // eslint-disable-next-line camelcase
    httpDetails.params = { domain_id: domainId }
    const response = await httpCall(httpDetails)
    return response
  } catch (error) {
    logMessage('Error initiating scan:', error, 'error')
  }
}

export async function getScanHistory({ domainId, currentPage, pageSize, status, archived = 'all' }) {
  try {
    const httpDetails = { ...SCANNER_ENDPOINTS.getScanHistory }
    httpDetails.url = `${httpDetails.url}/${domainId}`
    // eslint-disable-next-line camelcase
    httpDetails.params = { page: currentPage, page_size: pageSize, status, archived }
    const response = await httpCall(httpDetails)
    logMessage('all scans res:', response)
    return response
  } catch (error) {
    logMessage('error getting all scan results', error, 'error')
  }
}

export async function getIndividualScanResult(scanId) {
  try {
    const httpDetails = { ...SCANNER_ENDPOINTS.getIndividualScanResult }
    httpDetails.url = `${httpDetails.url}/${scanId}`
    const response = await httpCall(httpDetails)
    logMessage('individual scan res:', response)
    return response
  } catch (error) {
    logMessage('error getting individual scan result', error, 'error')
  }
}

export async function updateCookieData(payload, scanId) {
  try {
    const httpDetails = { ...SCANNER_ENDPOINTS.updateScanResult }
    httpDetails.url = `${httpDetails.url}/${scanId}`
    httpDetails.params = {
      // eslint-disable-next-line camelcase
      domain_id: payload.domainId,
      descriptions: payload.descriptions,
      categories: payload.categories
    }
    const response = await httpCall(httpDetails)
    return response
  } catch (error) {
    logMessage('error getting individual scan result', error, 'error')
  }
}

export async function archiveScan(scanId, domainId) {
  try {
    const httpDetails = { ...SCANNER_ENDPOINTS.archiveScan }
    httpDetails.url = `${httpDetails.url}/${scanId}`
    httpDetails.params = { domainId }
    const response = await httpCall(httpDetails)
    return response
  } catch (error) {
    logMessage('error archiving scan', error, 'error')
  }
}

export async function unArchiveScan(scanId, domainId) {
  try {
    const httpDetails = { ...SCANNER_ENDPOINTS.unArchiveScan }
    httpDetails.url = `${httpDetails.url}/${scanId}`
    httpDetails.params = { domainId }
    const response = await httpCall(httpDetails)
    logMessage('scan unarchival response', response)
    return response
  } catch (error) {
    logMessage('error unarchiving scan', error, 'error')
  }
}
