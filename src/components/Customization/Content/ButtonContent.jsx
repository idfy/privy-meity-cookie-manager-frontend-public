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
import { buttonFieldsConfig } from 'configs/ButtonFieldsConfig'

const ButtonContent = () => {
  const { expandedSections, toggleExpansion } = useContext(CustomizationContext)
  const { selectedTemplate } = useContext(UserInfoContext)
  const { templateTexts, setTemplateText, recordTextFieldEdits } = useContext(TranslationContext)
  const { setActiveBanner } = useContext(CustomizationContext)

  const currentLangCode = selectedTemplate.languageCode || 'en'
  const currentText = templateTexts[currentLangCode] || templateTexts.en || {}
  const currentButtonsText = currentText.buttonsText || {}

  const buttonMaxChars = getCharLimit(currentLangCode, 'buttonText')

  const handleInputChange = (field, value) => {
    // Allow deletion even when limit is exceeded, but prevent adding new characters
    const currentLength = currentButtonsText[field].length || 0
    const isDeleting = value.length < currentLength

    if (!isDeleting && value.length > buttonMaxChars) return

    recordTextFieldEdits(currentLangCode, { [`buttonsText.${field}`]: true })

    // Switch active banner based on which button is being edited
    if (field === 'savePreferences') {
      setActiveBanner('preference-banner')
    } else if (['acceptAll', 'moreSettings'].includes(field)) {
      setActiveBanner('cookie-banner')
    }

    setTemplateText(currentLangCode, {
      ...currentText,
      buttonsText: {
        ...currentButtonsText,
        [field]: value
      }
    })
  }

  return (
    <div className='content-section p-3'>
      <div className='section-header' onClick={() => toggleExpansion('buttonContent')}>
        <h3 className='section-title'> Banner Button</h3>
        <DropdownIcon height={26} width={26} className={expandedSections.buttonContent ? 'rotate-icon' : ''} />
      </div>

      <div className={`section-content ${expandedSections.buttonContent ? 'expanded' : ''}`}>
        {buttonFieldsConfig.map(({ label, field, placeholder }) => {
          const value = currentButtonsText[field] || ''
          return (
            <div key={field}>
              <InputBox
                label={label}
                name={field}
                value={value}
                onChange={(e) => handleInputChange(field, e.target.value)}
                placeholder={placeholder}
                className='!py-1'
                labelClassName='!text-xs !font-bold'
              />
              <div className={`mb-1 word-count ${hasCharLimitExceeded(value, buttonMaxChars) ? 'word-count-error' : ''}`}>
                {getCharCount(value)}/{buttonMaxChars}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ButtonContent
