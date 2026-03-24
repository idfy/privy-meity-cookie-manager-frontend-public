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
import { BANNER_ENDPOINTS } from './http_module/endpoints'
import { httpCall } from './http_module/httpCall'

export async function createBannerLink(templateId, domainId, scanId, bannerName, bannerType) {
  try {
    const httpDetails = { ...BANNER_ENDPOINTS.createBannerLink }
    httpDetails.params = {
      // eslint-disable-next-line camelcase
      template_id: templateId,
      // eslint-disable-next-line camelcase
      domain_id: domainId,
      // eslint-disable-next-line camelcase
      scan_id: scanId,
      // eslint-disable-next-line camelcase
      banner_name: bannerName,
      // eslint-disable-next-line camelcase
      banner_type: bannerType
    }
    const response = await httpCall(httpDetails)
    return response
  } catch (error) {
    logMessage('Error while creating banner', error, 'error')
  }
}

export async function getAllBanners({ domainId, currentPage, pageSize, archived = 'all' }) {
  try {
    const httpDetails = { ...BANNER_ENDPOINTS.getAllBanners }
    // eslint-disable-next-line camelcase
    httpDetails.params = { page: currentPage, page_size: pageSize, archived }
    httpDetails.url = `${httpDetails.url}/${domainId}`
    const response = await httpCall(httpDetails)
    logMessage('all banners:', response)
    return response
  } catch (error) {
    logMessage('error fetching templates', error, 'error')
  }
}

export async function changeBannerStatus(domainId, bannerId, status) {
  try {
    const httpDetails = { ...BANNER_ENDPOINTS.changeBannerStatus }
    // eslint-disable-next-line camelcase
    httpDetails.params = { domain_id: domainId, banner_id: bannerId, status }
    const response = await httpCall(httpDetails)
    logMessage('banner status change response', response)
    return response
  } catch (error) {
    logMessage('error changing banner status', error, 'error')
  }
}

export async function archiveBanner(bannerId) {
  try {
    const httpDetails = { ...BANNER_ENDPOINTS.archiveBanner }
    httpDetails.url = `${httpDetails.url}/${bannerId}`
    const response = await httpCall(httpDetails)
    logMessage('banner archival response', response)
    return response
  } catch (error) {
    logMessage('error archiving banner', error, 'error')
  }
}

export async function unArchiveBanner(bannerId) {
  try {
    const httpDetails = { ...BANNER_ENDPOINTS.unArchiveBanner }
    httpDetails.url = `${httpDetails.url}/${bannerId}`
    const response = await httpCall(httpDetails)
    logMessage('banner unarchival response', response)
    return response
  } catch (error) {
    logMessage('error unarchiving banner', error, 'error')
  }
}
