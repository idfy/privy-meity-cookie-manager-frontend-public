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

import { useState, useContext, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
// contexts
import { CustomizationContext } from 'contexts/CustomizationContext'
import { useAlert } from 'contexts/AlertContext'
import { useErrorCode } from 'contexts/ErrorContext'
import { DomainInfoContext } from 'contexts/DomainInfoContext'
import { useTranslation } from 'contexts/TranslationContext'
import { UserInfoContext } from 'contexts/UserInfoContext'
// components
import Device from '../components/Customization/Device'
import CookieBanner from '../components/Preview/CookieBanner'
import PreferenceManager from '../components/Preview/PreferenceManager'
import CustomizationPanel from 'components/Customization/CustomizationPanel'
import ErrorComponent from 'components/Common/ErrorComponent'
import CustomizationHeader from 'components/Customization/CustomizationHeader'
// hooks
import useScreenshotFetcher from 'hooks/useScreenshotFetcher'
import useTemplateData from 'hooks/useTemplateData'
// services and Utils
import { executeSave, getUnsavedChanges, resetModifiedState } from 'utils/templateUtils'
// assets
import 'styles/Customization.css'

const PATHS = {
  templatesList: (domainId) => `/cms/cookie-manager/dashboard/templates/${domainId}`
}

const CustomizationPage = () => {
  const { errorCode } = useErrorCode()
  if (errorCode) return <ErrorComponent />

  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false)
  const {
    designSettings,
    templateName,
    setTemplateName,
    activeBanner,
    setActiveBanner,
    setActiveDevice,
    setExpandedSections,
    setCurrentCustomization,
    clearDesignEdits,
    getModifiedDesignValues
  } = useContext(CustomizationContext)
  const { setAllTemplates } = useContext(DomainInfoContext)
  const { setSelectedTemplate } = useContext(UserInfoContext)
  const { showAlertMessage } = useAlert()
  const { getModifiedTemplates, templateTexts, clearTextEdits } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { domainId, templateId } = useParams()

  const isEditMode = location.pathname.includes('edit')

  useEffect(() => {
    if (isEditMode) {
      setSelectedTemplate({ id: templateId, languageCode: 'en' })
    } else {
      setSelectedTemplate({ id: null, languageCode: 'en' })
    }
    setActiveBanner('cookie-banner')
    setActiveDevice('desktop')
    setExpandedSections({})
    setCurrentCustomization('Layout')
    resetModifiedState(clearTextEdits, clearDesignEdits)
  }, [])

  const { loading, templateStatus } = useTemplateData()
  useScreenshotFetcher()

  if (loading) {
    return <div className='h-screen mt-5'>Loading Template...</div> // Show loading indicator until data is fetched
  }

  if (!designSettings) {
    return <div className='h-screen mt-5'>No template data available</div>
  }

  const handleSubmitTemplate = async () => {
    try {
      const name = templateName.trim()
      if (!name) {
        showAlertMessage('Template name is required to create template', 'notice')
        return
      }

      const unsaved = getUnsavedChanges(getModifiedTemplates, getModifiedDesignValues, designSettings)
      const isDraft = templateStatus === 'draft'
      // if template is in draft stage and user hits save button without changes, saved the template as published
      if (isEditMode && !isDraft && !unsaved) {
        showAlertMessage('No changes to save', 'notice')
        return
      }

      setIsSubmitButtonDisabled(true)
      const { success } = await executeSave({
        name,
        textChanges: unsaved ? unsaved.textChanges : templateTexts,
        isPublished: true,
        isEditMode,
        templateId,
        designSettings,
        templateTexts,
        showAlertMessage
      })
      if (!success) return

      resetModifiedState(clearTextEdits, clearDesignEdits)
      showAlertMessage('Template saved successfully', 'success')
      setAllTemplates((prev) => ({ ...prev, refetchTemplates: true }))
      navigate(PATHS.templatesList(domainId))
    } catch (error) {
      showAlertMessage('Failed to save template', 'error')
    } finally {
      setIsSubmitButtonDisabled(false)
    }
  }

  const handleBack = async () => {
    const unsaved = getUnsavedChanges(getModifiedTemplates, getModifiedDesignValues, designSettings)
    if (!unsaved) {
      navigate(PATHS.templatesList(domainId))
      return
    }

    try {
      const name = (templateName || '').trim() || 'Untitled'
      const { success } = await executeSave({
        name,
        textChanges: unsaved.textChanges,
        isPublished: false,
        isEditMode,
        templateId,
        designSettings,
        templateTexts,
        showAlertMessage
      })
      if (!success) return

      resetModifiedState(clearTextEdits, clearDesignEdits)
      showAlertMessage('Changes Saved as Draft', 'success')
      setAllTemplates((prev) => ({ ...prev, refetchTemplates: true }))
      navigate(PATHS.templatesList(domainId))
    } catch (error) {
      showAlertMessage('Failed to auto-save draft while leaving. Changes may be lost.', 'error')
    }
  }

  return (
    <div className='user-activity-container flex flex-col' id='customization-tab'>
      <CustomizationHeader
        templateName={templateName}
        setTemplateName={setTemplateName}
        handleBack={handleBack}
        handleSubmitTemplate={handleSubmitTemplate}
        isSubmitButtonDisabled={isSubmitButtonDisabled}
      />
      <div className='customisation-screen flex'>
        <div className='customization-options'>
          <CustomizationPanel />
          <div className='device-container'>
            <Device />
          </div>
        </div>
        <div className='preview-area'>
          {activeBanner === 'preference-banner' ? <PreferenceManager /> : <CookieBanner />}
        </div>
      </div>
    </div>
  )
}

export default CustomizationPage
