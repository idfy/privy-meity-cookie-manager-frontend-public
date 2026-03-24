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

/**
 * Language Groups Configuration
 * Defines available language groups for translation
 */

export const LANGUAGE_GROUPS = [
  {
    id: 'indian',
    name: 'All Indian Languages',
    description: '22 according to the DPDPA',
    languages: {
      'en': 'English',
      'as': 'Assamese',
      'bn': 'Bengali',
      'br': 'Bodo',
      'doi': 'Dogri',
      'gom': 'Konkani',
      'gu': 'Gujarati',
      'hi': 'Hindi',
      'kn': 'Kannada',
      'ks': 'Kashmiri',
      'mai': 'Maithili',
      'ml': 'Malayalam',
      'mni-Mtei': 'Manipuri',
      'mr': 'Marathi',
      'ne': 'Nepali',
      'or': 'Oriya',
      'pa': 'Punjabi',
      'sa': 'Sanskrit',
      'sd': 'Sindhi',
      'st': 'Santhali',
      'ta': 'Tamil',
      'te': 'Telugu',
      'ur': 'Urdu'
    }
  }
]

export const getLanguageCodesFromGroups = (selectedGroups) => {
  const languageCodes = []

  selectedGroups.forEach(groupId => {
    const group = LANGUAGE_GROUPS.find(group => group.id === groupId) || null
    if (group && group.languages) {
      languageCodes.push(...Object.keys(group.languages))
    }
  })

  // Remove duplicates
  return [...new Set(languageCodes)]
}

/**
 * Get all available languages for the language selector
 * Returns an array of objects with id and name properties
 */
export const getAllLanguages = () => {
  const allLanguages = []

  LANGUAGE_GROUPS.forEach(group => {
    if (group.languages) {
      Object.entries(group.languages).forEach(([code, name]) => {
        allLanguages.push({ id: code, name: name })
      })
    }
  })

  return allLanguages
}

const allLanguagesMap = new Map(
  LANGUAGE_GROUPS.flatMap(group =>
    Object.entries(group.languages || {})
  )
)


export const getLanguageNameByCode = (code) => {
  return allLanguagesMap.get(code) || code
}