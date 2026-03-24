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

export const resetAddCookieForm = () => ({
  cookieId: '',
  cookieType: '',
  domain: '',
  sources: [],
  description: '',
  untilSession: false,
  sourceType: '',
  years: '',
  months: '',
  days: ''
})

export const toggleDurationSession = (form, checked) => ({
  ...form,
  untilSession: checked,
  years: checked ? '' : form.years,
  months: checked ? '' : form.months,
  days: checked ? '' : form.days
})

export const handleNumericDurationChange = (form, field, value) => {
  const numericValue = value.replace(/\D/g, '')

  const updatedForm = {
    ...form,
    [field]: numericValue
  }

  const values = [
    updatedForm.years,
    updatedForm.months,
    updatedForm.days
  ]

  const allZero =
    values.every(v => v !== '' && Number(v) === 0)

  return {
    ...updatedForm,
    untilSession: allZero
  }
}

export const formatDuration = ({ untilSession, years = 0, months = 0, days = 0 }) =>
  untilSession
    ? 'session'
    : `${years} year(s), ${months} month(s), ${days} day(s)`

export const isValidUrl = (value) => {
  if (!value) return false

  const cleaned = value.trim()

  return /^\.?[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/.test(cleaned)
}

export const isValidSource = (url) =>
  /^(https?:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d{1,5})?(\/.*)?$/.test(url.trim())

export const validateAddCookieForm = (form, finalSources, existingCookies) => {
  const errors = {}

  if (!form.cookieId.trim()) {
    errors.cookieId = 'Cookie name is required'
  } else if (form.cookieId.trim().length < 3) {
    errors.cookieId = 'Cookie name must be at least 3 characters long'
  } else if (form.cookieId.trim().length > 50) {
    errors.cookieId = 'Cookie name must be at most 50 characters long'
  }

  const desc = form.description.trim()

  if (!desc) {
    errors.description = 'Description is required'
  } else if (desc.length < 10) {
    errors.description = 'Description must be at least 10 characters long'
  } else if (desc.length > 500) {
    errors.description = 'Description must be at most 500 characters long'
  } else if (!/^[A-Za-z0-9\-.,()'"/ ]+$/.test(desc)) {
    errors.description =
      'Description can only contain letters, numbers, spaces, or - . , \' " / () characters'
  }

  if (!form.cookieType) {
    errors.cookieType = 'Please select a category'
  }
  if (!form.sourceType) {
    errors.sourceType = 'Please select a script tag'
  }

  if (!form.domain.trim()) {
    errors.domain = 'Domain is required'
  } else if (!isValidUrl(form.domain.trim())) {
    errors.domain = 'Enter a valid domain (e.g., example.com)'
  }

  const formatValue = (d) => d?.trim()?.toLowerCase()

  const isDuplicate = existingCookies?.some((c) => {
    const sameName = formatValue(c.name) === formatValue(form.cookieId)
    const sameDomain = formatValue(c.host) === formatValue(form.domain)
    return sameName && sameDomain
  })

  if (isDuplicate) {
    errors.cookieId = 'A cookie with this name already exists for this domain'
  }

  const noDuration =
    !form.untilSession &&
    [form.years, form.months, form.days].every(
      (v) => v === '' || Number(v) === 0
    )

  if (noDuration) errors.duration = 'Duration is required'

  if (finalSources.length === 0) errors.sources = 'At least one source URL is required'

  return errors
}

export const buildAddCookiePayload = (form, finalSources, domainId) => {
  const durationObj = {
    // eslint-disable-next-line camelcase
    is_session: form.untilSession,
    expiry: {
      years: Number(form.years || 0),
      months: Number(form.months || 0),
      days: Number(form.days || 0)
    }
  }

  return {
    domainId,
    cookies: [
      {
        // eslint-disable-next-line camelcase
        cookie_name: form.cookieId.trim(),
        description: form.description.trim(),
        category: form.cookieType.toUpperCase(),
        // eslint-disable-next-line camelcase
        source_type: form.sourceType?.toLowerCase(),
        // eslint-disable-next-line camelcase
        cookie_domain: form.domain.trim(),
        duration: durationObj,
        sources: finalSources
      }
    ]
  }
}

export const buildCSVUploadPayload = (file, domainId) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('domain_id', domainId)
  return formData
}

export const validateCSVFile = (file) => {
  if (!file) return 'Please select a CSV file.'
  if (!file.name.toLowerCase().endsWith('.csv')) return 'Please upload a valid .csv file.'
  if (file.size > 10 * 1024 * 1024) return 'File size exceeds 10MB limit.'
  return null
}

export const extractCSVFromDrop = async (event) => {
  event.preventDefault()

  const droppedFile = event.dataTransfer.files[0]
  if (!droppedFile) return null

  if (droppedFile.size === 0) {
    try {
      const text = await droppedFile.text()
      if (text && text.length > 0) {
        return new File([text], droppedFile.name, {
          type: droppedFile.type || 'text/csv'
        })
      }
    } catch { }
  }

  return droppedFile
}

export const getCSVTemplate = () =>
  `cookie_name,category,description,cookie_domain,sources,source_type,is_session,years,months,days
CookieConsent,NECESSARY,Used for consent tracking,example.com,https://example.com/script1.js,script,false,1,4,5
AnalyticsCookie,ANALYTICS,Tracks user behavior,.abc.in,https://example.com/analytics.js,embed,false,0,12,0
MarketingPixel,MARKETING,Used for marketing and ads,www.example.com,https://example.com/pixel.js,iframe,true,0,0,0
`

export const downloadCSVTemplate = () => {
  if (typeof document === 'undefined') return

  const csv = getCSVTemplate()

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = 'cookie_template.csv'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}
