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

export const buildCookieUpdatePayload = (domainId, cookieData) => {
  const descriptions = []
  const categories = []

  if (!Array.isArray(cookieData)) {
    return { domainId, descriptions, categories }
  }

  for (const cookie of cookieData) {
    if (!cookie || typeof cookie !== 'object') continue
    if (cookie.languageId && cookie.description) {
      descriptions.push({
        // eslint-disable-next-line camelcase
        language_id: cookie.languageId,
        description: cookie.description
      })
    }

    if (cookie.cookieMasterId && cookie.category) {
      categories.push({
        // eslint-disable-next-line camelcase
        cookie_master_id: cookie.cookieMasterId,
        category: cookie.category
      })
    }
  }

  return { domainId, descriptions, categories }
}

export function buildManualCookieUpdatePayload(original, edited) {
  const expiry = {
    years: Number(edited.expiry?.years) || 0,
    months: Number(edited.expiry?.months) || 0,
    days: Number(edited.expiry?.days) || 0
  }
  const isSession =
    edited.is_session === true ||
    (
      expiry.years === 0 &&
      expiry.months === 0 &&
      expiry.days === 0
    )

  return {
    name: edited.name?.trim(),
    category: edited.category,
    domain: edited.domain?.trim(),
    // eslint-disable-next-line camelcase
    domain_id: original.domainId,
    // eslint-disable-next-line camelcase
    cookie_id: original.cookieId,
    // eslint-disable-next-line camelcase
    cookie_master_id: original.cookieMasterId,
    // eslint-disable-next-line camelcase
    language_id: original.languageId,
    description: edited.description?.trim(),
    // eslint-disable-next-line camelcase
    meta_data: {
      duration: {
        // eslint-disable-next-line camelcase
        is_session: isSession,
        expiry
      },

      sources: Array.isArray(edited.sources) && edited.sources.length > 0
        ? edited.sources
        : [],
      // eslint-disable-next-line camelcase
      source_type: edited.sourceType?.toLowerCase()
    }
  }
}
