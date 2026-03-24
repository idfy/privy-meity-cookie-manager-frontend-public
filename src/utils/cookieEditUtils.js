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

import { isValidUrl, isValidSource } from 'utils/addCookieUtils'

export const parseDurationString = (str) => {
  if (!str || typeof str !== 'string') {
    return { years: 0, months: 0, days: 0 }
  }

  return {
    years: Number(str.match(/(\d+)\s*year/i)?.[1] ?? 0),
    months: Number(str.match(/(\d+)\s*month/i)?.[1] ?? 0),
    days: Number(str.match(/(\d+)\s*day/i)?.[1] ?? 0)
  }
}

export const buildNormalizedCookie = (cookieData) => {
  const isManual = cookieData.addedBySource?.toUpperCase() === 'MANUAL'
  const expiryObj = parseDurationString(cookieData?.expiry)
  const sourceType = cookieData?.metaData?.requestChain?.type

  return {
    ...cookieData,
    name: cookieData.name || '',
    domain: cookieData.domain || cookieData.host || '',
    sources: Array.isArray(cookieData.sources) ? cookieData.sources : [],
    expiry: {
      years: expiryObj.years,
      months: expiryObj.months,
      days: expiryObj.days
    },
    sourceType: typeof sourceType === 'string' ? sourceType.toLowerCase() : '',
    isManual
  }
}

export const validateEditedCookie = (data) => {
  if (!data.isManual) return null

  const name = data.name?.trim()

  if (!name) {
    return 'Please enter cookie name'
  } else if (name.length < 3) {
    return 'Cookie name must be at least 3 characters.'
  } else if (name.length > 50) {
    return 'Cookie name cannot be more than 50 characters.'
  }

  if (!data.description?.trim()) {
    return 'Description cannot be empty.'
  } else if (data.description.trim().length > 500) {
    return 'Description cannot be more than 500 characters.'
  }

  if (!data.domain?.trim() || !isValidUrl(data.domain.trim())) {
    return 'Enter a valid Host, e.g. example.com'
  }

  const invalidSources = Array.isArray(data.sources)
    ? data.sources.filter((src) => !isValidSource(src))
    : []
  if (invalidSources.length > 0) {
    return `Invalid source: ${invalidSources[0]}`
  }

  return null
}
