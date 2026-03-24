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

import { createContext, useState, useContext } from 'react'

export const TranslationContext = createContext()

const TranslationProvider = ({ children }) => {
  // Status can be: 'initial', 'loading', 'success', 'error'
  const [translationStatuses, setTranslationStatuses] = useState({})
  const [templateTexts, setTemplateTexts] = useState({}) // Store template for each language
  const [modifiedTextFields, setModifiedTextFields] = useState({}) // Track which fields were modified for each language
  const [showTranslationModal, setShowTranslationModal] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)

  // Update translation status for specific languages
  const updateTranslationStatus = (languageCode, status) => {
    setTranslationStatuses(prev => ({
      ...prev,
      [languageCode]: status
    }))
  }

  // Store template for a specific language
  const setTemplateText = (languageCode, template) => {
    setTemplateTexts(prev => ({
      ...prev,
      [languageCode]: template
    }))
  }

  // Track specific text fields edited for a language
  const recordTextFieldEdits = (languageCode, fields) => {
    setModifiedTextFields(prev => ({
      ...prev,
      [languageCode]: {
        ...(prev[languageCode] || {}),
        ...fields
      }
    }))
  }

  // Get all templates that need to be saved (only modified fields)
  const getModifiedTemplates = () => {
    const modifiedTemplates = {}
    const languageCodes = Object.keys(modifiedTextFields)

    languageCodes.forEach(langCode => {
      if (templateTexts[langCode] && modifiedTextFields[langCode]) {
        const modifiedTemplate = {}
        Object.keys(modifiedTextFields[langCode]).forEach(fieldPath => {
          const fieldValue = getNestedValue(templateTexts[langCode], fieldPath)
          if (fieldValue !== undefined) {
            setNestedValue(modifiedTemplate, fieldPath, fieldValue)
          }
        })
        modifiedTemplates[langCode] = modifiedTemplate
      }
    })
    return modifiedTemplates
  }

  // Helper function to get nested object value
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  // Helper function to set nested object value
  const setNestedValue = (obj, path, value) => {
    const keys = path.split('.')
    const lastKey = keys.pop()
    const target = keys.reduce((current, key) => {
      if (!current[key]) current[key] = {}
      return current[key]
    }, obj)
    target[lastKey] = value
  }

  const getTranslationStatus = (languageCode) => {
    return translationStatuses[languageCode] || 'initial'
  }

  const isTranslationAvailable = (languageCode) => {
    const status = getTranslationStatus(languageCode)
    return status === 'success'
  }

  const resetTranslationStatuses = () => {
    setTranslationStatuses({})
  }

  const clearTextEdits = () => {
    setModifiedTextFields({})
  }

  const clearTemplateTexts = () => {
    setTemplateTexts({})
  }

  return (
    <TranslationContext.Provider
      value={{
        translationStatuses,
        templateTexts,
        modifiedTextFields,
        updateTranslationStatus,
        setTemplateText,
        recordTextFieldEdits,
        getModifiedTemplates,
        getTranslationStatus,
        isTranslationAvailable,
        resetTranslationStatuses,
        clearTextEdits,
        clearTemplateTexts,
        showTranslationModal,
        setShowTranslationModal,
        isTranslating,
        setIsTranslating
      }}
    >
      {children}
    </TranslationContext.Provider>
  )
}

export const useTranslation = () => useContext(TranslationContext)

export default TranslationProvider
