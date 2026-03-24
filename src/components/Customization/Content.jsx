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

import { useContext } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import LanguageSelector from 'components/Common/LanguageSelector'
import ButtonContent from './Content/ButtonContent'
import CategoryDescriptions from './Content/CategoryDescriptions'
import HeadingAndDescription from './Content/HeadingAndDescription'
import { EyeIcon, LanguageIcon } from 'components/Common/SvgComponents'
import { UserInfoContext } from 'contexts/UserInfoContext'
import { CustomizationContext } from 'contexts/CustomizationContext'
import { useTranslation } from 'contexts/TranslationContext'
import { useAlert } from 'contexts/AlertContext'
import { DomainInfoContext } from 'contexts/DomainInfoContext'
import { addTemplate } from 'services/template'
import { isSuccessfulResponse } from 'utils/helperUtils'
import { prepareAddData } from 'utils/translationUtils'
import { TRANSLATION_ENABLED } from 'static/staticVariables'

const Content = () => {
  const { selectedTemplate, setSelectedTemplate } = useContext(UserInfoContext)
  const { designSettings, templateName } = useContext(CustomizationContext)
  const { setAllTemplates } = useContext(DomainInfoContext)
  const { templateTexts, setShowTranslationModal, isTranslating } = useTranslation()
  const { showAlertMessage } = useAlert()
  const navigate = useNavigate()
  const location = useLocation()
  const { domainId } = useParams()

  const isEditMode = location.pathname.includes('edit')

  const handleTranslateAllContent = async () => {
    try {
      // If we're in edit mode, just open the modal
      if (isEditMode) {
        setShowTranslationModal(true)
        return
      }
      // If we're in create mode, first save the template as draft to get template ID and navigate to edit page
      const trimmedName = templateName.trim()
      if (!trimmedName) {
        showAlertMessage('Template name is required to start translation', 'notice')
        return
      }
      const templateData = prepareAddData(designSettings, templateTexts)
      const isPublished = false
      const response = await addTemplate(templateData, trimmedName, isPublished)

      if (!isSuccessfulResponse(response)) {
        throw new Error('Failed to save template')
      }

      const newTemplateId = response.data.template_id
      setShowTranslationModal(true)
      setAllTemplates((prev) => ({ ...prev, refetchTemplates: true }))
      setSelectedTemplate({ id: newTemplateId, languageCode: 'en' })
      navigate(`/cms/cookie-manager/dashboard/edit-template/${domainId}/${newTemplateId}`)
    } catch (error) {
      showAlertMessage('Failed to prepare for translation', 'error')
    }
  }

  return (
    <div className='h-full flex flex-col'>
      <div className='flex-1 overflow-y-auto pb-4'>
        {TRANSLATION_ENABLED === 'true' && (
          <div className='language-selection-wrapper pl-2 rounded-tr-lg'>
            <EyeIcon />
            <p className='p-0 m-0 text-sm'>View data in:</p>
            <LanguageSelector optionsClassName='!right-[-104px]' />
          </div>
        )}
        <ButtonContent />
        <hr className='seperator' />
        <HeadingAndDescription configKey='initial' />
        <hr className='seperator' />
        <HeadingAndDescription configKey='preference' />
        <hr className='seperator' />
        <CategoryDescriptions />
      </div>
      {TRANSLATION_ENABLED === 'true' && selectedTemplate.languageCode === 'en' && (
        <div className='p-2 shadow-black bg-white'>
          <button
            className='justify-center black-btn gap-2 w-full'
            onClick={handleTranslateAllContent}
            disabled={isTranslating}
          >
            {isTranslating ? 'Translating...' : 'Translate'}
            <LanguageIcon />
          </button>
        </div>
      )}
    </div>
  )
}

export default Content
