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
import { useParams } from 'react-router-dom'
import { CustomizationContext } from 'contexts/CustomizationContext'
import { TranslationContext } from 'contexts/TranslationContext'
import { UserInfoContext } from 'contexts/UserInfoContext'
import { PreviewImageContext } from 'contexts/PreviewImageContext'
import { LanguageIcon } from 'components/Common/SvgComponents'
import { getBannerStyles } from 'utils/styleUtils'
import { PRIVY_WEBSITE_URL, TRANSLATION_ENABLED } from 'static/staticVariables'
import { getAllLanguages } from 'static/languageGroups'
import 'styles/Preview.css'

const CookieBanner = ({ classes }) => {
  const { designSettings, activeBanner, activeDevice, setActiveBanner } = useContext(CustomizationContext)
  const { templateTexts, isTranslationAvailable } = useContext(TranslationContext)
  const { selectedTemplate } = useContext(UserInfoContext)
  const { getDomainScreenshots } = useContext(PreviewImageContext)

  const currentLangCode = selectedTemplate.languageCode || 'en'
  const textContent = templateTexts[currentLangCode] || templateTexts.en || {}
  const template = { ...designSettings, ...textContent }

  // Added safety checks for required data
  if (!template.contentDesktop || !template.buttonsText) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        Loading template data...
      </div>
    )
  }

  const {
    bannerType,
    positionDesktop,
    positionMobile,
    buttonsText,
    contentDesktop
  } = template
  const { domainId } = useParams()

  // Get comprehensive styles from template
  const styles = getBannerStyles(template)
  const screenshotUrls = getDomainScreenshots(domainId)
  const currentDeviceScreenshot = screenshotUrls[activeDevice]

  const handleActiveBanner = () => {
    setActiveBanner('preference-banner')
  }

  const isDesktop = activeDevice === 'desktop'
  const bannerVisibilityClass = activeBanner === 'cookie-banner' ? '' : 'invisible'
  const availableLanguages = getAllLanguages().filter(language => isTranslationAvailable(language.id))

  return (
    <>
      <div
        className={`main-container ${bannerVisibilityClass} ${isDesktop ? '' : 'mobile-banner'} ${classes || ''}`}
      >
        {currentDeviceScreenshot && (
          <img
            src={currentDeviceScreenshot}
            alt='Website preview background'
            className='preview-background-image'
          />
        )}
        <div
          className={
            isDesktop ? `${bannerType}-container ${positionDesktop}` : `mobile-container ${positionMobile}`
          }
        >
          <div className='banner-content'>
            <div className='banner-header-container'>
              <h2 className='banner-heading' style={styles.bannerHeading}>{template.initialNoticeHeader}</h2>
              {TRANSLATION_ENABLED === 'true' && availableLanguages.length > 1 && (
                <LanguageIcon height={16} width={16} className='language-logo-privy-cmp-AE1VSVI8T5' onClick={handleActiveBanner} />
              )}
            </div>
            <div className={isDesktop ? `${bannerType}-inner` : 'mobile-inner'}>
              <p className={`notice ${bannerType}-desc`}>
                {contentDesktop.cookieBannerNotice}
              </p>
              <div className='button-container'>
                <button
                  id='allow-btn'
                  className={`banner-button ${isDesktop ? '' : 'mobile-btn'}`}
                  style={styles.acceptButtonStyle}
                >
                  {buttonsText.acceptAll}
                </button>
                <button
                  className={`banner-button ${isDesktop ? '' : 'mobile-btn'}`}
                  style={styles.buttonStyle}
                >
                  {buttonsText.allowNecessary}
                </button>
                <button
                  id='customize-btn'
                  className={`banner-button ${isDesktop ? '' : 'mobile-btn'}`}
                  style={styles.buttonStyle}
                  onClick={handleActiveBanner}
                >
                  {buttonsText.moreSettings}
                </button>
              </div>
            </div>
          </div>
          <div className='powered'>
            Powered by &nbsp;
            <span>
              <a href={`${PRIVY_WEBSITE_URL}`} target='_blank' rel='noreferrer'>
                PRIVY
              </a>
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export default CookieBanner
