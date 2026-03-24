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

import { useState, useEffect, useMemo } from 'react'
import {
  buildNormalizedCookie,
  parseDurationString
} from 'utils/cookieEditUtils'

export const useCookieEdit = (cookieData) => {
  const [editedData, setEditedData] = useState({})
  const [sourceInput, setSourceInput] = useState('')

  useEffect(() => {
    if (!cookieData) return

    const normalized = buildNormalizedCookie(cookieData)
    setEditedData(normalized)
    setSourceInput(
      normalized.isManual && Array.isArray(normalized.sources)
        ? normalized.sources.join(', ')
        : ''
    )
  }, [cookieData])

  const isManual = editedData.isManual

  const hasChanges = useMemo(() => {
    if (!cookieData || !editedData) return false

    if (!isManual) {
      return (
        editedData.category !== cookieData.category ||
        editedData.description !== cookieData.description
      )
    }

    const originalExpiry = parseDurationString(cookieData.expiry)

    const original = {
      name: cookieData.name,
      category: cookieData.category,
      description: cookieData.description,
      domain: cookieData.host,
      sources: Array.isArray(cookieData.sources) ? cookieData.sources : [],
      expiry: originalExpiry,
      sourceType:
        typeof cookieData?.metaData?.requestChain?.type === 'string'
          ? cookieData.metaData.requestChain.type.toLowerCase()
          : ''
    }

    const edited = {
      name: editedData.name,
      category: editedData.category,
      description: editedData.description,
      domain: editedData.domain,
      sources: Array.isArray(editedData.sources) ? editedData.sources : [],
      expiry: editedData.expiry,
      sourceType: editedData.sourceType
    }

    return JSON.stringify(original) !== JSON.stringify(edited)
  }, [editedData, cookieData, isManual])

  return {
    editedData,
    setEditedData,
    sourceInput,
    setSourceInput,
    isManual,
    hasChanges
  }
}
