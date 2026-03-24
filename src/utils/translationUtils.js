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

import CustomSpinner from 'components/Common/CustomSpinner'
import { TranslateStatusError, TranslateStatusInitial, TranslateStatusSuccess } from 'components/Common/SvgComponents'
import { trimObjectValues } from './helperUtils'
import { getAllLanguages } from 'static/languageGroups'

export const getStatusIcon = (status) => {
  const statusIcons = {
    success: <TranslateStatusSuccess />,
    error: <TranslateStatusError />,
    loading: <CustomSpinner size='w-3 h-3' colorClass='border-[#214698]' />,
    initial: <TranslateStatusInitial />
  }
  return statusIcons[status] || statusIcons.initial
}

// Helper function to analyze translation results based on API response shape
export const analyzeTranslationResults = (responseData) => {
  const failedCount = responseData?.languages_failed?.length || 0
  return failedCount === 0
    ? {
      type: 'success',
      message: 'Successfully translated in all languages'
    }
    : {
      type: 'error',
      message: `Failed to translate in ${failedCount} languages`
    }
}

export const prepareAddData = (designSettings, templateTexts) => {
  const englishTextContent = templateTexts.en || {}
  return {
    ...trimObjectValues(designSettings),
    ...englishTextContent
  }
}

export const applyTranslationStatuses = (translatedLanguages, updateTranslationStatus) => {
  const allLanguageCodes = getAllLanguages().map(lang => lang.id)
  allLanguageCodes.forEach((langCode) => {
    const status = translatedLanguages.includes(langCode) ? 'success' : 'error'
    updateTranslationStatus(langCode, status)
  })
}
