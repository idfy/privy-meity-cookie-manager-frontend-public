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

import { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CustomizationContext } from 'contexts/CustomizationContext'
import { TranslationContext } from 'contexts/TranslationContext'
import { UserInfoContext } from 'contexts/UserInfoContext'
import { PreviewImageContext } from 'contexts/PreviewImageContext'
import { getBannerStyles } from 'utils/styleUtils'
import { PRIVY_WEBSITE_URL, TRANSLATION_ENABLED } from 'static/staticVariables'
import { CATEGORIZED_COOKIES } from 'static/dummyCookieData'
import { DropdownIcon, LanguageIcon } from 'components/Common/SvgComponents'
import { getAllLanguages } from 'static/languageGroups'
import { STATIC_BANNER_TEXT_TRANSLATIONS } from 'static/translatedStaticText'
import 'styles/Preview.css'

const PreferenceManager = ({ classes }) => {
  const { designSettings, activeBanner, activeDevice, setActiveBanner } = useContext(CustomizationContext)
  const { templateTexts, isTranslationAvailable } = useContext(TranslationContext)
  const { selectedTemplate, setSelectedTemplate } = useContext(UserInfoContext)
  const { getDomainScreenshots } = useContext(PreviewImageContext)
  const [dropdownVisible, setDropdownVisible] = useState({})
  const [viewCookies, setViewCookies] = useState({})
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)
  const { domainId } = useParams()

  const currentLangCode = selectedTemplate.languageCode || 'en'
  const textContent = templateTexts[currentLangCode] || templateTexts.en || {}
  const template = { ...designSettings, ...textContent }

  // Added safety checks for required data
  if (!template.contentDesktop || !template.buttonsText || !template.preferenceNoticeHeader) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        Loading template data...
      </div>
    )
  }

  const styles = getBannerStyles(template)
  const screenshotUrls = getDomainScreenshots(domainId)
  const currentDeviceScreenshot = screenshotUrls[activeDevice]

  const toggleDropdown = (category) => {
    setDropdownVisible((prev) => ({
      ...prev,
      [category]: viewCookies[category] === true ? false : !prev[category]
    }))
    setViewCookies((prev) => ({
      ...prev,
      [category]: false
    }))
  }

  const toggleViewCookies = (category) => {
    setViewCookies((prev) => ({
      ...prev,
      [category]: !prev[category]
    }))
    setDropdownVisible((prev) => ({
      ...prev,
      [category]: false
    }))
  }

  const closeBanner = () => {
    setActiveBanner('cookie-banner')
  }

  const toggleLanguageDropdown = () => {
    setLanguageDropdownOpen(!languageDropdownOpen)
  }

  const changeLanguage = (languageCode) => {
    setSelectedTemplate({
      ...selectedTemplate,
      languageCode
    })
    setLanguageDropdownOpen(false)
  }

  const availableLanguages = getAllLanguages().filter(language => isTranslationAvailable(language.id))

  return (
    <div
      className={`main-container ${activeDevice === 'mobile' ? 'mobile-banner' : ''} ${classes || ''}`}
    >
      {currentDeviceScreenshot && (
        <img
          src={currentDeviceScreenshot}
          alt='Website preview background'
          className='preview-background-image'
        />
      )}
      <div
        className={`preference-manager ${activeBanner === 'preference-banner' ? '' : 'invisible'
          } ${activeDevice === 'mobile' ? 'mobile-preference' : template.preferenceManagerHorizontalPosition}`}
      >
        <div className='close-btn'>
          <h2 className='box-heading' style={styles.bannerHeading}>{template.preferenceNoticeHeader}</h2>
          {TRANSLATION_ENABLED === 'true' && availableLanguages.length > 1 && (
            <div className='language-dropdown-wrapper-privy-cmp-AE1VSVI8T5'>
              <button className='language-dropdown-button-privy-cmp-AE1VSVI8T5' onClick={toggleLanguageDropdown}>
                <LanguageIcon height={16} width={16} />
                <span className='language-text-privy-cmp-AE1VSVI8T5'>{currentLangCode}</span>
                <DropdownIcon className={`dropdown-arrow-privy-cmp-AE1VSVI8T5 ${languageDropdownOpen ? 'rotate-icon' : ''}`} />
              </button>
              {languageDropdownOpen && (
                <div id='language-dropdown-menu-privy-cmp-AE1VSVI8T5' className='language-dropdown-menu-privy-cmp-AE1VSVI8T5'>
                  {availableLanguages.map((language) => (
                    <div
                      key={language.id}
                      data-language={language.id}
                      className={`language-option-privy-cmp-AE1VSVI8T5 ${language.id === currentLangCode ? 'selected-privy-cmp-AE1VSVI8T5' : ''}`}
                      onClick={() => changeLanguage(language.id)}
                    >
                      {language.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <button className='close-button' id='btn-close-banner' onClick={closeBanner}>
            ×
          </button>
        </div>
        <div className='content-container'>
          <div className='content'>
            <p className='box-description'>
              {template.contentDesktop.preferenceManagerNotice}
            </p>
            <div className='categories' id='categories-container'>
              {Object.keys(CATEGORIZED_COOKIES).map((category) => {
                const cookieData = CATEGORIZED_COOKIES[category]
                const isNecessary = category === 'NECESSARY'
                const isDropdownVisible = !!dropdownVisible[category]
                const isViewCookiesVisible = !!viewCookies[category]
                return (
                  <div className='category' key={category}>
                    <div className='category-header'>
                      <div className='name' onClick={() => toggleDropdown(category)}>
                        <DropdownIcon
                          height={24}
                          width={24}
                          className={`${isDropdownVisible || isViewCookiesVisible ? 'rotate-icon' : ''}`}
                        />
                        <label style={styles.dropdownHeading}>
                          {STATIC_BANNER_TEXT_TRANSLATIONS[currentLangCode][category]} {STATIC_BANNER_TEXT_TRANSLATIONS[currentLangCode].Cookies}
                        </label>
                      </div>
                      <input
                        type='checkbox'
                        id={`${category}-toggle`}
                        className='toggle-switch'
                        defaultChecked={isNecessary}
                        disabled={isNecessary}
                      />
                      <label
                        htmlFor={`${category}-toggle`}
                        className={`toggle-label ${category === 'necessary' ? 'disabled' : ''}`}
                        style={{
                          '--toggle-color': template.buttonColor
                        }}
                      />
                    </div>
                    <div
                      id={`dropdown-${category}`}
                      className={`dropdown-content-preview ${isDropdownVisible ? '' : 'invisible'
                        }`}
                    >
                      <div className='category-description' style={styles.dropdownContent}>
                        {template.cookieCategoryDescriptions[category.toLowerCase()]}
                      </div>
                      <div onClick={() => toggleViewCookies(category)} className='view-cookies' style={styles.link}>
                        {STATIC_BANNER_TEXT_TRANSLATIONS[currentLangCode]['View Cookies']}
                      </div>
                    </div>
                    <div className={`show-cookies ${isViewCookiesVisible ? '' : 'invisible'}`}>
                      <div className='all-cookies'>
                        {cookieData.map((cookie) => (
                          <div className='cookie' key={cookie.id}>
                            <p className='cookie-name'>
                              <span>&nbsp;{STATIC_BANNER_TEXT_TRANSLATIONS[currentLangCode].Name}&nbsp;</span>
                              :&nbsp;
                              {cookie.cookie_master_name}
                            </p>
                            <p className='platform'>
                              <span>&nbsp;{STATIC_BANNER_TEXT_TRANSLATIONS[currentLangCode].Host}&nbsp;</span>
                              :&nbsp;
                              {cookie.meta_data.domain}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <div className='bottom-panel'>
            <div className='preference-button'>
              <button className=' banner-button flex-btn' id='btn-save-preferences' style={styles.acceptButtonStyle}>
                {template.buttonsText.savePreferences}
              </button>
              <button className=' banner-button flex-btn' id='btn-allow-necessary' style={styles.buttonStyle}>
                {template.buttonsText.allowNecessary}
              </button>
            </div>
            <div className='powered'>
              Powered by&nbsp;
              <span>
                <a href={`${PRIVY_WEBSITE_URL}`} target='_blank' rel='noreferrer'>
                  PRIVY
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PreferenceManager
