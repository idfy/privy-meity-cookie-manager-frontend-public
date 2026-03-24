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

export const applyCookieFilters = (data, selectedCategories, selectedHosts) => {
  // No filters → return original data
  if (!selectedCategories.length && !selectedHosts.length) {
    return data
  }

  const filteredData = {}
  const hostSet = new Set(selectedHosts)

  if (selectedCategories.length) {
    selectedCategories.forEach((category) => {
      const filteredCookies = selectedHosts.length
        ? data[category].filter((cookie) => hostSet.has(cookie.cookie_domain))
        : data[category]

      if (filteredCookies?.length) {
        filteredData[category] = filteredCookies
      }
    })
  } else if (selectedHosts.length) {
    Object.keys(data).forEach((category) => {
      const filteredCookies = data[category].filter((cookie) =>
        hostSet.has(cookie.cookie_domain)
      )
      if (filteredCookies?.length) {
        filteredData[category] = filteredCookies
      }
    })
  }

  return filteredData
}
