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

import { useContext, useEffect, useRef, useState } from 'react'
import { CustomizationContext } from 'contexts/CustomizationContext'
import { TranslationContext } from 'contexts/TranslationContext'
import { useAlert } from 'contexts/AlertContext'
import { fetchTemplate, fetchBaseTemplate } from 'services/template'
import { isSuccessfulResponse } from 'utils/helperUtils'
import { applyTranslationStatuses } from 'utils/translationUtils'
import { UserInfoContext } from 'contexts/UserInfoContext'
import { useLocation } from 'react-router-dom'

// Keys that belong to textual content; everything else goes to design settings
const TEXT_KEYS = new Set([
  'buttonsText',
  'contentDesktop',
  'initialNoticeHeader',
  'preferenceNoticeHeader',
  'cookieCategoryDescriptions'
])

const ERROR_MESSAGES = {
  BASE_TEMPLATE: 'Error loading base template',
  TEMPLATE: 'Error loading template',
  INVALID_RESPONSE: 'Invalid template response received'
}

const DEFAULT_LANGUAGE = 'en'
const DEFAULT_TEMPLATE_NAME = 'Untitled'

function splitTemplate(rawTemplate) {
  const design = {}
  const textContent = {}
  if (!rawTemplate || typeof rawTemplate !== 'object') return { design, textContent }

  Object.entries(rawTemplate).forEach(([key, value]) => {
    TEXT_KEYS.has(key) ? textContent[key] = value : design[key] = value
  })

  return { design, textContent }
}

function validateAndExtractTemplateData(response) {
  if (!isSuccessfulResponse(response) || !response.data?.data) {
    throw new Error(ERROR_MESSAGES.INVALID_RESPONSE)
  }

  const templateData = response.data.data
  const rawTemplate = templateData?.value

  if (!rawTemplate || typeof rawTemplate !== 'object') {
    throw new Error(ERROR_MESSAGES.INVALID_RESPONSE)
  }
  const status = templateData?.status === false ? 'draft' : 'saved'

  return {
    rawTemplate,
    name: templateData?.name || DEFAULT_TEMPLATE_NAME,
    translatedLanguages: templateData?.languages || [],
    status
  }
}

function updateTemplateState({
  design,
  textContent,
  templateName,
  translatedLanguages,
  languageCode,
  setDesignSettings,
  setTemplateName,
  setTemplateText,
  updateTranslationStatus
}) {
  setDesignSettings(design)
  setTemplateName(templateName)
  setTemplateText(languageCode, textContent)
  applyTranslationStatuses(translatedLanguages, updateTranslationStatus)
}

export default function useTemplateData() {
  const { setDesignSettings, setTemplateName } = useContext(CustomizationContext)
  const { templateTexts, setTemplateText, updateTranslationStatus, clearTemplateTexts } = useContext(TranslationContext)
  const { selectedTemplate } = useContext(UserInfoContext)
  const { showAlertMessage } = useAlert()
  const [loading, setLoading] = useState(false)
  const [templateStatus, setTemplateStatus] = useState(null)
  // Track previous values
  const prevTemplateIdRef = useRef(null)
  const location = useLocation()
  const isCreatePage = location.pathname.includes('/create-template/')

  const clearContext = () => {
    clearTemplateTexts()
    setDesignSettings({})
    setTemplateName(DEFAULT_TEMPLATE_NAME)
  }

  // This function is called when template id changes, clear old data and add new data
  const loadNewTemplate = async (templateId) => {
    setLoading(true)

    try {
      const response = await fetchTemplate(templateId, DEFAULT_LANGUAGE)
      if (!isSuccessfulResponse(response)) throw new Error('Invalid response')

      const { rawTemplate, name, translatedLanguages, status } = validateAndExtractTemplateData(response)
      const { design, textContent } = splitTemplate(rawTemplate)

      updateTemplateState({
        design,
        textContent,
        templateName: name,
        translatedLanguages,
        languageCode: DEFAULT_LANGUAGE,
        setDesignSettings,
        setTemplateName,
        setTemplateText,
        updateTranslationStatus
      })
      setTemplateStatus(status)
    } catch (error) {
      console.error('Template loading failed:', error)
      showAlertMessage(ERROR_MESSAGES.TEMPLATE, 'error')
    } finally {
      setLoading(false)
    }
  }

  const loadBaseTemplate = async () => {
    setLoading(true)
    try {
      const response = await fetchBaseTemplate()
      if (!isSuccessfulResponse(response)) throw new Error('Invalid response')

      const { rawTemplate, name, translatedLanguages, status } = validateAndExtractTemplateData(response)
      const { design, textContent } = splitTemplate(rawTemplate)

      updateTemplateState({
        design,
        textContent,
        templateName: name,
        translatedLanguages,
        languageCode: DEFAULT_LANGUAGE,
        setDesignSettings,
        setTemplateName,
        setTemplateText,
        updateTranslationStatus
      })
      setTemplateStatus(status)
    } catch (error) {
      showAlertMessage(ERROR_MESSAGES.TEMPLATE, 'error')
    } finally {
      setLoading(false)
    }
  }

  const loadSpecificLanguage = async (templateId, languageCode) => {
    // Skip if language already exists
    const existing = templateTexts[languageCode]
    if (existing && Object.keys(existing).length > 0) return

    setLoading(true)
    try {
      const response = await fetchTemplate(templateId, languageCode)
      if (!isSuccessfulResponse(response)) throw new Error('Invalid response')

      const { rawTemplate } = validateAndExtractTemplateData(response)
      const { textContent } = splitTemplate(rawTemplate)

      // Only update the text content for this language, preserve existing Design Settings, TemplateName and Translation Statuses
      setTemplateText(languageCode, textContent)
    } catch (error) {
      console.error('Language loading failed:', error)
      showAlertMessage(ERROR_MESSAGES.TEMPLATE, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const { id, languageCode } = selectedTemplate || {}

    if (id === null) {
      // Case 1: Create Template Page → fetch base template
      if (!isCreatePage) {
        return
      }
      clearContext()
      loadBaseTemplate()
      prevTemplateIdRef.current = null
      return
    }

    if (id && id !== prevTemplateIdRef.current) {
      // Case 2: Switching templates
      clearContext()
      loadNewTemplate(id)
      prevTemplateIdRef.current = id
      return
    }

    if (id && languageCode) {
      // Case 3: Only language changes
      loadSpecificLanguage(id, languageCode)
    }
  }, [selectedTemplate?.id, selectedTemplate?.languageCode, isCreatePage])

  return {
    loadBaseTemplate,
    loadNewTemplate,
    loadSpecificLanguage,
    loading,
    templateStatus
  }
}
