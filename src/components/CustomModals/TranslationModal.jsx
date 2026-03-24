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

import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
// Components
import ModalContainer from 'components/Common/ModalContainer'
import LanguageGroup from 'components/Translation/LanguageGroup'
import { LanguageIcon } from 'components/Common/SvgComponents'
// Contexts
import { useAlert } from 'contexts/AlertContext'
import { useTranslation } from 'contexts/TranslationContext'
// Services & Utils
import { initiateTemplateTranslation } from 'services/translation'
import { isSuccessfulResponse } from 'utils/helperUtils'
import { analyzeTranslationResults } from 'utils/translationUtils'
import { LANGUAGE_GROUPS, getLanguageCodesFromGroups } from 'static/languageGroups'
import TranslationStatus from 'components/Translation/TranslationStatus'
import 'styles/Modal.css'

const TranslationModal = ({ show, handleClose, cookieCount }) => {
  const [selectedLanguageGroups, setSelectedLanguageGroups] = useState([])
  const [expandedGroups, setExpandedGroups] = useState({})
  const [translationResult, setTranslationResult] = useState(null) // 'success' | 'error' | null
  const { templateId } = useParams()
  const { showAlertMessage } = useAlert()
  const {
    templateTexts,
    updateTranslationStatus,
    getModifiedTemplates,
    getTranslationStatus,
    isTranslating,
    setIsTranslating,
    clearTemplateTexts,
    setTemplateText
  } = useTranslation()

  const onStartTranslationClick = () => {
    setIsTranslating(true)
    setTranslationResult(null) // Reset previous results

    const languageCodes = getLanguageCodesFromGroups(selectedLanguageGroups)
    languageCodes.forEach(langCode => {
      const currentStatus = getTranslationStatus(langCode)

      if (currentStatus === 'initial') {
        updateTranslationStatus(langCode, 'loading')
      }
    })

    initiateTranslationRequest(selectedLanguageGroups)
  }

  const initiateTranslationRequest = async (selectedLanguageGroups) => {
    try {
      const languageCodes = getLanguageCodesFromGroups(selectedLanguageGroups || [])
      const modifiedValues = getModifiedTemplates()

      // Get only languages that have failed translation status
      const failedLanguages = languageCodes.filter(langCode => {
        const status = getTranslationStatus(langCode)
        return status !== 'success' // Include if status is NOT 'success'
      })

      const requestParams = {
        templateId
      }

      // Only add modified_values if English language has been modified
      if (modifiedValues.en && Object.keys(modifiedValues.en).length > 0) {
        requestParams.modifiedValues = {
          en: modifiedValues.en // Only include English data
        }
      }

      // Only add languages parameter if there are failed languages
      if (failedLanguages.length > 0) {
        requestParams.languages = failedLanguages
      }

      const response = await initiateTemplateTranslation(requestParams)

      if (!isSuccessfulResponse(response)) {
        showAlertMessage(
          response.data?.message || 'Failed to initiate translation',
          'error'
        )
        return
      }

      const data = response.data.data
      data.languages_inserted?.forEach(langCode => {
        updateTranslationStatus(langCode, 'success')
      })

      data.languages_failed?.forEach(langCode => {
        updateTranslationStatus(langCode, 'error')
      })

      // Keep only English in memory, clear other languages
      const englishText = templateTexts?.en
      clearTemplateTexts()
      if (englishText) setTemplateText('en', englishText)

      // Show message for Translation status(failed count)
      const result = analyzeTranslationResults(response.data.data)
      setTranslationResult(result)
    } catch (error) {
      setTranslationResult({
        type: 'error',
        message: 'Sorry, we could not translate in the above languages'
      })
      showAlertMessage('Failed to initiate translation', 'error')
    } finally {
      setIsTranslating(false)
    }
  }

  const hasSelectedGroups = selectedLanguageGroups.length > 0

  const toggleGroupSelection = (groupId) => {
    setSelectedLanguageGroups(prev => {
      if (prev.includes(groupId)) {
        return prev.filter(id => id !== groupId)
      } else {
        return [...prev, groupId]
      }
    })
  }

  const toggleDropdown = (groupId) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }))
  }

  // Reset translation result when modal is opened
  useEffect(() => {
    if (show) {
      setTranslationResult(null)
    }
  }, [show])

  useEffect(() => {
    const languageCodes = getLanguageCodesFromGroups(selectedLanguageGroups)
    languageCodes.forEach(langCode => {
      const currentStatus = getTranslationStatus(langCode)

      if (currentStatus === 'error') {
        updateTranslationStatus(langCode, 'initial')
      }
    })
  }, [selectedLanguageGroups])

  return (
    <ModalContainer
      show={show}
      handleClose={isTranslating ? undefined : handleClose}
      title={
        <div className='flex items-center gap-3 text-base font-bold'>
          <LanguageIcon height={18} width={18} />
          <span>Translate</span>
        </div>
      }
      closeId='Translate'
      dialogClass='min-w-[600px]'
      titleClass='!py-[10px] px-3 !border-none'
      disableClose={isTranslating}
    >
      <div className='translate-modal'>
        {/* Description */}
        <div>
          <p className='text-sm font-medium'>
            Choose your languages below.
          </p>
        </div>

        {/* Language Groups Selection */}
        <div className='mt-1'>
          {LANGUAGE_GROUPS.map(group => (
            <LanguageGroup
              key={group.id}
              group={group}
              selectedLanguageGroups={selectedLanguageGroups}
              expandedGroups={expandedGroups}
              onGroupSelection={toggleGroupSelection}
              onToggleDropdown={toggleDropdown}
              isTranslating={isTranslating}
            />
          ))}
        </div>

        {/* Translation Result Message */}
        <TranslationStatus translationResult={translationResult} />

        {/* Translate Button - Hide when translation result is shown */}
        {!translationResult && (
          <div className='flex justify-end mt-3'>
            <button
              id='btn-start-translation'
              className={`py-2 px-3 rounded-[8px] text-sm ${hasSelectedGroups && !isTranslating
                  ? 'blue-button'
                  : 'disabled-translate-btn'
                }`}
              onClick={onStartTranslationClick}
              disabled={!hasSelectedGroups}
            >
              {isTranslating ? 'Translating ...' : 'Start Translation'}
            </button>
          </div>
        )}
      </div>

    </ModalContainer>
  )
}

export default TranslationModal
