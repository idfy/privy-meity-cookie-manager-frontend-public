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
import { TEMPLATE_ENDPOINTS } from './http_module/endpoints'
import { logMessage } from 'utils/helperUtils'

export async function getAllTemplates({ currentPage, pageSize, show, archived = 'all' }) {
  try {
    const httpDetails = { ...TEMPLATE_ENDPOINTS.getAllTemplates }
    // eslint-disable-next-line camelcase
    httpDetails.params = { page: currentPage, page_size: pageSize, archived }
    if (show) {
      httpDetails.params.show = show
    }
    const response = await httpCall(httpDetails)
    logMessage('get template res', response)
    return response
  } catch (error) {
    logMessage('error fetching templates', error, 'error')
  }
}

export async function addTemplate(template, templateName, isPublished) {
  try {
    const httpDetails = { ...TEMPLATE_ENDPOINTS.addTemplate }
    httpDetails.params = { template, name: templateName }

    if (isPublished === false) {
      httpDetails.params.status = isPublished
    }

    const response = await httpCall(httpDetails)
    logMessage('add template res', response)
    return response
  } catch (error) {
    logMessage('error adding template', error, 'error')
  }
}

export async function editTemplate(themeValues, languages, templateName, templateId, isPublished) {
  try {
    const httpDetails = { ...TEMPLATE_ENDPOINTS.editTemplate }
    httpDetails.url = `${httpDetails.url}/${templateId}`
    // eslint-disable-next-line camelcase
    httpDetails.params = { theme_values: themeValues, languages, name: templateName }
    if (isPublished === false) {
      httpDetails.params.status = isPublished
    }
    console.log('httpDetails', httpDetails)
    const response = await httpCall(httpDetails)
    logMessage('edit template res', response)
    return response
  } catch (error) {
    logMessage('error editing template', error, 'error')
  }
}

export async function fetchTemplate(templateId, languageCode = 'en') {
  try {
    const httpDetails = { ...TEMPLATE_ENDPOINTS.getTemplate }
    httpDetails.url = `${httpDetails.url}/${templateId}`
    httpDetails.params = { language: languageCode }
    const response = await httpCall(httpDetails)
    logMessage('fetch template res', response)
    return response
  } catch (error) {
    logMessage('error fetching template', error, 'error')
  }
}

export async function fetchBaseTemplate() {
  try {
    const httpDetails = { ...TEMPLATE_ENDPOINTS.getBaseTemplate }
    const response = await httpCall(httpDetails)
    logMessage('base template ', response)
    return response
  } catch (error) {
    logMessage('error fetching base template', error, 'error')
  }
}

export async function archiveTemplate(templateId) {
  try {
    const httpDetails = { ...TEMPLATE_ENDPOINTS.archiveTemplate }
    httpDetails.url = `${httpDetails.url}/${templateId}`
    const response = await httpCall(httpDetails)
    logMessage('template archival response', response)
    return response
  } catch (error) {
    logMessage('error archiving template', error, 'error')
  }
}

export async function unArchiveTemplate(templateId) {
  try {
    const httpDetails = { ...TEMPLATE_ENDPOINTS.unArchiveTemplate }
    httpDetails.url = `${httpDetails.url}/${templateId}`
    const response = await httpCall(httpDetails)
    logMessage('template unarchival response', response)
    return response
  } catch (error) {
    logMessage('error unarchiving template', error, 'error')
  }
}
