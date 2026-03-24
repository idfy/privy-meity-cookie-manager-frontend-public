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

import { addTemplate, editTemplate } from 'services/template'
import { prepareAddData } from './translationUtils'
import { isSuccessfulResponse, trimObjectValues } from './helperUtils'

export const getUnsavedChanges = (getModifiedTemplates, getModifiedDesignValues, designSettings) => {
  const textChanges = getModifiedTemplates()
  const modifiedDesign = getModifiedDesignValues(designSettings)
  const hasTextChanges = Object.keys(textChanges || {}).length > 0
  const hasDesignChanges = Object.keys(modifiedDesign || {}).length > 0
  if (!hasTextChanges && !hasDesignChanges) return null
  return { textChanges, modifiedDesign }
}

export const resetModifiedState = (clearTextEdits, clearDesignEdits) => {
  clearTextEdits()
  clearDesignEdits()
}

export const executeSave = async ({ name, textChanges, isPublished, isEditMode, templateId, designSettings, templateTexts, showAlertMessage }) => {
  let response
  if (isEditMode && templateId) {
    const themeValues = trimObjectValues(designSettings)
    const languages = textChanges
    response = await editTemplate(themeValues, languages, name, templateId, isPublished)
  } else {
    const templateData = prepareAddData(designSettings, templateTexts)
    response = await addTemplate(templateData, name, isPublished)
  }
  const success = isSuccessfulResponse(response)
  if (!success) {
    showAlertMessage(response?.data?.details || response?.data?.message || 'Something went wrong while saving template', 'error')
  }
  return { success }
}
