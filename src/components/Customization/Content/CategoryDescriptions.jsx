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
import InputBox from 'components/Common/InputBox'
import { DropdownIcon } from 'components/Common/SvgComponents'
import { CustomizationContext } from 'contexts/CustomizationContext'
import { TranslationContext } from 'contexts/TranslationContext'
import { UserInfoContext } from 'contexts/UserInfoContext'
import { getCharCount, hasCharLimitExceeded, getCharLimit } from 'utils/helperUtils'

const CategoryDescriptions = () => {
  const { setActiveBanner, expandedSections, toggleExpansion } = useContext(CustomizationContext)
  const { selectedTemplate } = useContext(UserInfoContext)
  const { templateTexts, setTemplateText, recordTextFieldEdits } = useContext(TranslationContext)

  const currentLangCode = selectedTemplate.languageCode || 'en'
  const currentText = templateTexts[currentLangCode] || templateTexts.en || {}
  const currentCategoryDescriptions = currentText.cookieCategoryDescriptions || {}

  const maxCharsDescription = getCharLimit(currentLangCode, 'cookieCategoryDescription')

  const handleInputChange = (field, value) => {
    // Allow deletion even when limit is exceeded, but prevent adding new characters
    const currentLength = currentCategoryDescriptions[field].length || 0
    const isDeleting = value.length < currentLength

    if (!isDeleting && value.length > maxCharsDescription) return

    setActiveBanner('preference-banner')
    recordTextFieldEdits(currentLangCode, { [`cookieCategoryDescriptions.${field}`]: true })
    setTemplateText(currentLangCode, {
      ...currentText,
      cookieCategoryDescriptions: {
        ...currentCategoryDescriptions,
        [field]: value
      }
    })
  }

  return (
    <div className='content-section p-3'>
      <div className='section-header' onClick={() => toggleExpansion('categoryDescriptions')}>
        <h3 className='section-title'>Cookie Category Descriptions</h3>
        <DropdownIcon height={26} width={26} className={expandedSections.categoryDescriptions ? 'rotate-icon' : ''} />
      </div>

      <div className={`section-content ${expandedSections.categoryDescriptions ? 'expanded' : ''}`}>
        {Object.keys(currentCategoryDescriptions).map((category, index) => (
          <div key={index}>
            <InputBox
              label={`'${category}' Category`}
              type='textarea'
              name={category}
              value={currentCategoryDescriptions[category] || ''}
              onChange={(e) => handleInputChange(category, e.target.value)}
              placeholder='Enter Category Description'
              className='!py-1'
              labelClassName='!text-xs !font-bold capitalize'
              rows={6}
            />
            <div className={`mb-1 word-count ${hasCharLimitExceeded(currentCategoryDescriptions[category] || '', maxCharsDescription) ? 'word-count-error' : ''}`}>
              {getCharCount(currentCategoryDescriptions[category] || '')}/{maxCharsDescription}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryDescriptions
