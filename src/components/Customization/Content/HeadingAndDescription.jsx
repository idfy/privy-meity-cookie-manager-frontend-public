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
import { bannerContentConfig } from 'configs/BannerContentConfig'
import { getCharCount, hasCharLimitExceeded, getCharLimit } from 'utils/helperUtils'

const HeadingAndDescription = ({ configKey }) => {
  const { setActiveBanner, expandedSections, toggleExpansion } = useContext(CustomizationContext)
  const { selectedTemplate } = useContext(UserInfoContext)
  const { templateTexts, setTemplateText, recordTextFieldEdits } = useContext(TranslationContext)

  const currentLangCode = selectedTemplate.languageCode || 'en'
  const currentText = templateTexts[currentLangCode] || templateTexts.en || {}

  const {
    title,
    heading,
    description
  } = bannerContentConfig[configKey]

  const expansionKey = configKey === 'initial' ? 'cookieBannerContent' : 'preferencePanelContent'
  const headingMaxChars = getCharLimit(currentLangCode, 'bannerHeading')
  const descriptionMaxChars = configKey === 'initial' ? getCharLimit(currentLangCode, 'initialBannerDescription') : getCharLimit(currentLangCode, 'preferenceBannerDescription')

  const handleDescriptionChange = (field, value) => {
    // Allow deletion even when limit is exceeded, but prevent adding new characters
    const currentLength = currentText.contentDesktop[field].length || 0
    const isDeleting = value.length < currentLength

    if (!isDeleting && value.length > descriptionMaxChars) return

    configKey === 'initial' ? setActiveBanner('cookie-banner') : setActiveBanner('preference-banner')
    recordTextFieldEdits(currentLangCode, {
      [`contentDesktop.${field}`]: true
    })
    setTemplateText(currentLangCode, {
      ...currentText,
      contentDesktop: {
        ...currentText.contentDesktop,
        [field]: value
      }
    })
  }

  const handleHeadingChange = (field, value) => {
    // Allow deletion even when limit is exceeded, but prevent adding new characters
    const currentLength = currentText[field].length || 0
    const isDeleting = value.length < currentLength

    if (!isDeleting && value.length > headingMaxChars) return

    configKey === 'initial' ? setActiveBanner('cookie-banner') : setActiveBanner('preference-banner')
    recordTextFieldEdits(currentLangCode, { [field]: true })
    setTemplateText(currentLangCode, {
      ...currentText,
      [field]: value
    })
  }

  return (
    <div className='content-section p-3'>
      <div className='section-header' onClick={() => toggleExpansion(expansionKey)}>
        <h3 className='section-title'>{title}</h3>
        <DropdownIcon height={26} width={26} className={expandedSections[expansionKey] ? 'rotate-icon' : ''} />
      </div>

      <div className={`section-content ${expandedSections[expansionKey] ? 'expanded' : ''}`}>
        <InputBox
          label={heading.label}
          name='heading'
          value={currentText[heading.field] || ''}
          onChange={(e) => handleHeadingChange(heading.field, e.target.value)}
          placeholder={heading.placeholder}
          className='!py-1'
          labelClassName='!text-xs !font-bold'
        />
        <div className={`mb-2 word-count ${hasCharLimitExceeded(currentText[heading.field] || '', headingMaxChars) ? 'word-count-error' : ''}`}>
          {getCharCount(currentText[heading.field] || '')}/{headingMaxChars}
        </div>

        <InputBox
          label={description.label}
          type='textarea'
          name='description'
          value={currentText.contentDesktop[description.field]}
          onChange={(e) => handleDescriptionChange(description.field, e.target.value)}
          placeholder={description.placeholder}
          className='!py-1'
          labelClassName='!text-xs !font-bold'
          rows={6}
        />
        <div className={`word-count ${hasCharLimitExceeded(currentText.contentDesktop[description.field], descriptionMaxChars) ? 'word-count-error' : ''}`}>
          {getCharCount(currentText.contentDesktop[description.field])}/{descriptionMaxChars}
        </div>
      </div>
    </div>
  )
}

export default HeadingAndDescription
