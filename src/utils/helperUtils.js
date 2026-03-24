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

import { useEffect } from 'react'
import { IS_DEBUG_MODE, STATUS_STYLES, CONSENT_STATUSES, COOKIE_MANAGER_ASSETS_URL } from 'static/staticVariables'

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

/**
 * Formats a given timestamp into a human-readable date and time string in the format `YYYY-MM-DD HH:mm:ss`.
 * @param {number|string|Date} timeStamp - The input timestamp to be formatted.
 * It can be a number (milliseconds since Unix epoch), a string (ISO date format), or a Date object.
 *
 * @returns {string} The formatted date and time as a string in the format `YYYY-MM-DD HH:mm:ss`.
 *
 * @example
 * // Format a timestamp (milliseconds since Unix epoch)
 * const formattedDate = formatDate(1672531199000);
 * console.log(formattedDate); // "2023-01-01 00:59:59"
 *
 * @example
 * // Format an ISO date string
 * const formattedDate = formatDate("2023-01-01T00:59:59Z");
 * console.log(formattedDate); // "2023-01-01 00:59:59"
 *
 * @example
 * // Format a Date object
 * const formattedDate = formatDate(new Date());
 * console.log(formattedDate); // Current date and time
 */
export const formatDate = (timeStamp) => {
  const date = new Date(timeStamp)

  // Extract the year, month, and day
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0')

  // Extract the hours, minutes, and seconds
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  // Return the formatted date and time string
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export const getStatusStyle = (status) => {
  return STATUS_STYLES[status] || ''
}

/**
 * Formats categorized cookies into a flat array of cookie objects with specific fields.
 *
 * @param {Object} categorizedCookies - An object containing categories of cookies, where each category is an array of cookie objects.
 *
 * @returns {Array<Object>} An array of formatted cookie objects containing the id, name, category, description, host, and expiry.
 */
export const formatCookieData = (categorizedCookies, selectedLanguage, selectedDomain) => {
  if (!categorizedCookies) return []

  return Object.keys(categorizedCookies).flatMap((category) =>
    categorizedCookies[category].map((cookie) => ({

      id: cookie.cookie_id,
      cookieId: cookie.cookie_id,
      cookieMasterId: cookie.cookie_master_id || cookie.master_id,
      domainId: cookie.domain_id || selectedDomain,

      name: cookie.languages[selectedLanguage].name,
      category: cookie.category,
      description: cookie.languages[selectedLanguage].description,
      languageId: cookie.languages[selectedLanguage].language_id,

      host: cookie.cookie_domain || 'N/A',

      sources: Array.isArray(cookie.meta_data?.requestChain?.sourceUrls)
        ? cookie.meta_data.requestChain.sourceUrls
        : [],

      expiry: cookie.meta_data?.duration || '0 year(s), 0 month(s), 0 day(s)',

      addedBySource: cookie.added_by_source?.toUpperCase() || 'SCAN',

      metaData: cookie.meta_data

    }))
  )
}

export const filterScanDataForExport = (formattedData, columnNames) => {
  if (!Array.isArray(formattedData) || !Array.isArray(columnNames)) return formattedData

  const columnHeadersMap = {
    id: 'ID',
    cookieMasterId: 'Cookie Master ID',
    name: 'Name',
    category: 'Category',
    description: 'Description',
    languageId: 'Language ID',
    host: 'Hostname',
    expiry: 'Expiry'
  }

  return formattedData.map((row) => {
    return columnNames.reduce((filtered, columnName) => {
      const header = columnHeadersMap[columnName] || columnName
      filtered[header] = row[columnName]
      return filtered
    }, {})
  })
}

export function generateScriptTag(url) {
  try {
    if (!url) {
      throw new Error('URL is required.')
    }
    return `<script type="text/javascript" src="${url}"></script>`
  } catch (error) {
    logMessage('Error generating script tag:', error, 'error')
    return ''
  }
}

export function logMessage(statement, variable, logType = 'log') {
  if (!IS_DEBUG_MODE) {
    return
  }
  if (logType === 'error') {
    console.error(statement, variable)
  } else if (logType === 'warn') {
    console.warn(statement, variable)
  } else {
    console.log(statement, variable)
  }
}

export function frameUrlFromBannerId(bannerId, dataFiduciaryId) {
  try {
    if (!bannerId) {
      throw new Error('Banner Id is required.')
    }
    return `${COOKIE_MANAGER_ASSETS_URL}/${dataFiduciaryId}/${bannerId}`
  } catch (error) {
    logMessage('Error generating script tag:', error, 'error')
    return ''
  }
}

export function dropDownFormatData(cookieData) {
  const categories = cookieData.map((category) => ({
    label: category,
    value: category
  }))
  return categories
}

/**
 * Custom hook to handle clicks outside of a specified element.
 * @param {Object} ref - The ref of the element to monitor.
 * @param {Function} onOutsideClick - The callback function to execute when a click occurs outside the element.
 */
export function handleOutsideClick(ref, onOutsideClick) {
  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onOutsideClick()
      }
    }

    // Add event listener
    document.addEventListener('click', handleClick)

    return () => {
      // Cleanup event listener
      document.removeEventListener('click', handleClick)
    }
  }, [ref, onOutsideClick])
}

export const handleCopy = (data) => {
  navigator.clipboard.writeText(data)
}

export function getHosts(cookieData) {
  const hosts = new Set(
    Object.keys(cookieData).flatMap((category) =>
      cookieData[category].map((data) => data.cookie_domain)
    )
  )
  return Array.from(hosts)
}

/**
 * Converts a word to sentence case (capitalizes the first letter, lowercases the rest).
 * @param {string} word - The input word.
 * @returns {string} - The sentence-cased word.
 */
export function toSentenceCase(word) {
  if (!word) return ''
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}

/**
 * Determines the consent status based on submitted data.
 * @param {Object} submittedData - The consent categories and their acceptance status.
 * @returns {string} - The consent status.
 */
export const getConsentInfo = (submittedData) => {
  let totalCategories = 0
  let acceptedCategories = 0
  Object.entries(submittedData).forEach(([key, value]) => {
    if (key.toLowerCase() !== 'update' && key.toLowerCase() !== 'necessary') {
      totalCategories++
      if (value) {
        acceptedCategories++
      }
    }
  })

  if (acceptedCategories === totalCategories) return CONSENT_STATUSES.accepted
  if (acceptedCategories === 0) return CONSENT_STATUSES.rejected
  return CONSENT_STATUSES.partiallyAccepted
}

export const isSuccessfulResponse = (response) => {
  if (response.status >= 200 && response.status < 300) return true
  return false
}

/**
 * Exports data to a CSV file and triggers browser download.
 * Handles CSV formatting, data validation, and browser download functionality.
 *
 * @param {Array<Object>} csvData - Array of objects to be exported as CSV
 * @param {Object} csvData[].* - Any key-value pairs that should be included in the CSV
 *                               Keys will become column headers
 *                               Values will be converted to strings
 * @param {string} fileName - Name of the file to be downloaded (must end with .csv)
 *
 * @returns {boolean} Returns true if export succeeds, false if it fails
 *
 * @example
 * // Example with consent logs
 * const consentData = [{
 *   "Data Principal Id": "user123",
 *   "IP Address": "192.168.1.1",
 *   "Cookie Categories": "{\"ANALYTICS\":true,\"MARKETING\":true}"
 * }];
 */
export const exportDataToCsv = (csvData, fileName) => {
  try {
    if (!csvData || !csvData.length) {
      console.log('No data available to export')
      return false
    }

    const headers = Object.keys(csvData[0])
    const escapeValue = (val) => {
      const str = String(val ?? '')
      const needsEscaping = /[",\n\r]/.test(str)
      return needsEscaping ? `"${str.replace(/"/g, '""')}"` : str
    }

    const csvRows = [
      headers.join(','),
      ...csvData.map((row) => headers.map((header) => escapeValue(row[header])).join(','))
    ]
    const csvString = `\uFEFF${csvRows.join('\n')}` // BOM before string

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', fileName)
    link.style.visibility = 'hidden'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    return true
  } catch (error) {
    logMessage('Error exporting data:', error, 'error')
    return false
  }
}

/**
 * Escapes special characters in a string for CSV format.
 * Doubles up quotes to properly escape them in CSV fields.
 *
 * @param {any} value - The value to be escaped. If not a string, returns unchanged.
 * @returns {string|any} The escaped string, or the original value if not a string
 *
 * @example
 * // Non-string values are returned as-is
 * escapeCSV(123) // Returns 123
 *
 */
export const escapeCSV = (value) => {
  if (typeof value !== 'string') return value
  return value.replace(/"/g, '""')
}

export const getCharCount = (text) => {
  return text?.length || 0
}

export const hasCharLimitExceeded = (text, maxChars) => {
  const currentCharCount = getCharCount(text)
  return currentCharCount >= maxChars
}

/**
 * Recursively trims all string values in an object or array, removing leading and trailing whitespace.
 * This function traverses nested objects and arrays, applying trim() to all string values while
 * preserving the original structure and non-string values.
 *
 * @param {any} obj - The object, array, or primitive value to process
 * @returns {any} A new object/array with all string values trimmed, or the original value if not an object/array
 *
 * @example
 * // Basic object with string values
 * const obj = { name: '  John Doe  ', email: 'john@example.com  ', age: 30 };
 * trimObjectValues(obj);
 * // Returns: { name: 'John Doe', email: 'john@example.com', age: 30 }
 */
export const trimObjectValues = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(item => trimObjectValues(item))
  }

  const trimmedObj = {}
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      trimmedObj[key] = value.trim()
    } else if (typeof value === 'object' && value !== null) {
      trimmedObj[key] = trimObjectValues(value)
    } else {
      trimmedObj[key] = value
    }
  }
  return trimmedObj
}

/**
 * Get character limit for a specific language and attribute
 * @param {string} languageCode - The language code (e.g., 'en', 'es', 'fr')
 * @param {string} attribute - The attribute name (e.g., 'buttonText', 'bannerHeading')
 * @returns {number} - The character limit for the specified language and attribute
 */
export const getCharLimit = (languageCode, attribute) => {
  const { CHAR_LIMITS } = require('static/staticVariables')
  if (!languageCode || !attribute) return 0
  if (!CHAR_LIMITS.en[attribute] || !CHAR_LIMITS.others[attribute]) return 0

  const languageLimits = languageCode === 'en' ? CHAR_LIMITS.en[attribute] : CHAR_LIMITS.others[attribute]

  return Math.ceil(languageLimits)
}
