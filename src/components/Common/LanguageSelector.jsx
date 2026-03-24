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

import { useState, useRef, useContext } from 'react'
import { UserInfoContext } from 'contexts/UserInfoContext'
import { useTranslation } from 'contexts/TranslationContext'
import { getAllLanguages, getLanguageNameByCode } from 'static/languageGroups'
import { DropdownIcon, WarningIcon } from './SvgComponents'
import { handleOutsideClick } from 'utils/helperUtils'

const LanguageSelector = ({ disabled = false, optionsClassName = '' }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { selectedTemplate, setSelectedTemplate } = useContext(UserInfoContext)
  const { isTranslationAvailable } = useTranslation()
  const dropDownRef = useRef(null)

  const toggleDropdown = () => {
    if (!disabled) {
      setIsDropdownOpen(!isDropdownOpen)
    }
  }

  const closeDropdown = () => setIsDropdownOpen(false)

  const changeSelectedLanguage = (languageCode) => {
    setSelectedTemplate({
      ...selectedTemplate,
      languageCode
    })
    setIsDropdownOpen(false)
  }

  // Handle outside click to close dropdown
  handleOutsideClick(dropDownRef, closeDropdown)

  const availableLanguages = getAllLanguages()

  return (
    <div className='language-selector relative'>
      <div
        className='language-wrap relative'
        onClick={toggleDropdown}
        ref={dropDownRef}
        role='button'
        tabIndex={0}
        aria-haspopup='listbox'
        aria-expanded={isDropdownOpen}
        aria-label='Select language'
      >
        <div className='flex items-center justify-between'>
          <div className='flex items-center min-w-0'>
            <span className='active-language'>
              {getLanguageNameByCode(selectedTemplate.languageCode)}
            </span>
          </div>

          <DropdownIcon
            height={24} width={24}
            className={`ml-1 ${isDropdownOpen ? 'rotate-icon' : ''} ${disabled ? 'opacity-50' : ''}`}
            fillColor='#214698'
          />
        </div>
      </div>

      {/* Dropdown Options */}
      {isDropdownOpen && (
        <div className={`language-options ${optionsClassName}`}>
          {availableLanguages.map((language) => {
            const isAvailable = isTranslationAvailable(language.id)
            return (
              <div
                key={language.id}
                className={`
                  language-option
                  ${selectedTemplate.languageCode === language.id ? 'lang-option-selected' : ''}
                  ${!isAvailable ? '!cursor-not-allowed' : ''}
                `}
                onClick={() => isAvailable && changeSelectedLanguage(language.id)}
              >
                <p className='p-0 m-0'>{language.name}</p>
                {!isAvailable && (
                  <div className='unavailable-translation'>
                    <WarningIcon />
                    <p className='m-0 p-0'>Translation unavailable</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default LanguageSelector
