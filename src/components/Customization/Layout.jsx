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
import { CustomizationContext } from 'contexts/CustomizationContext'
import {
  DESKTOP_COOKIE_NOTICE_POSITIONS,
  MOBILE_COOKIE_NOTICE_POSITIONS,
  PREFERENCE_NOTICE_POSITIONS
} from 'static/staticVariables'
import NoticePositions from './NoticePositions'

import CookieNoticeBanner from 'assets/banner-type.svg'
import CookieNoticeBox from 'assets/box-type.svg'
import PreferenceManagerLeft from 'assets/left-side-position.svg'
import PreferenceManagerRight from 'assets/right-side-position.svg'
import PreferenceManagerCentre from 'assets/large-banner.svg'
import MobileBannerTop from 'assets/mobile-banner-top.svg'
import MobileBannerBottom from 'assets/mobile-banner-bottom.svg'
import ImageSelector from './ImageSelector'

const COOKIE_NOTICE_IMAGES = {
  desktopBox: CookieNoticeBox,
  desktopBanner: CookieNoticeBanner,
  mobileBannerTop: MobileBannerTop,
  mobileBannerBottom: MobileBannerBottom,
  PreferenceManagerLeft,
  PreferenceManagerRight,
  PreferenceManagerCentre
}

const COOKIE_BANNER = 'cookie-banner'
const PREFERENCE_MANAGER = 'preference-banner'

const Layout = () => {
  const { designSettings, setDesignSettings, setActiveBanner, activeDevice, recordDesignFieldEdits } = useContext(CustomizationContext)
  const { bannerType, positionDesktop, positionMobile, preferenceManagerHorizontalPosition } = designSettings

  const handleChange = (changes, activeBanner) => {
    setDesignSettings((prev) => ({
      ...prev,
      ...changes
    }))
    const modifiedFlags = Object.fromEntries(
      Object.keys(changes).map(key => [key, true])
    )

    recordDesignFieldEdits(modifiedFlags)
    setActiveBanner(activeBanner)
  }

  return (
    <div className='layout-section p-3'>
      <h3 className='section-head'>Cookie Notice</h3>
      {/* if active device is mobile then show only banner type else show banner type,banner position and preference banner position */}
      {activeDevice === 'mobile'
        ? (
          <div className='grid-elements mt-4 mb-2'>
            {Object.values(MOBILE_COOKIE_NOTICE_POSITIONS)
              .flat()
              .map(({ position, label, icon }) => (
                <ImageSelector
                  key={position}
                  id={`mobile-banner-${position}`}
                  name='mobile-type'
                  value={position}
                  label={label}
                  checked={positionMobile === position}
                  onChange={() => handleChange({ positionMobile: position }, COOKIE_BANNER)}
                  imgSrc={COOKIE_NOTICE_IMAGES[icon]}
                  isMobile
                />
              ))}
          </div>
        )
        : (
          <>
            <div className='grid-elements mt-4 mb-2'>
              {Object.keys(DESKTOP_COOKIE_NOTICE_POSITIONS).map((mappingType) => {
                const firstPosition = DESKTOP_COOKIE_NOTICE_POSITIONS[mappingType][0]
                return (
                  <ImageSelector
                    key={mappingType}
                    id={mappingType}
                    name='type'
                    value={mappingType}
                    label={mappingType}
                    checked={bannerType === mappingType}
                    onChange={() =>
                      handleChange(
                        {
                          bannerType: mappingType,
                          positionDesktop: firstPosition.position
                        },
                        COOKIE_BANNER
                      )}
                    imgSrc={COOKIE_NOTICE_IMAGES[firstPosition.icon]}
                  />
                )
              })}
            </div>

            <div className='position'>
              <NoticePositions
                bannerType={bannerType}
                positionDesktop={positionDesktop}
                handleChange={handleChange}
              />
            </div>

            <h3 className='section-head'>Notice Preferences</h3>
            <div className='grid-elements mt-4 mb-2'>
              {PREFERENCE_NOTICE_POSITIONS.box.map(({ position, label, icon }) => (
                <ImageSelector
                  key={position}
                  id={position}
                  name='preference'
                  value={position}
                  label={label}
                  checked={preferenceManagerHorizontalPosition === position}
                  onChange={() =>
                    handleChange({ preferenceManagerHorizontalPosition: position }, PREFERENCE_MANAGER)}
                  imgSrc={COOKIE_NOTICE_IMAGES[icon]}
                />
              ))}
            </div>
          </>
        )}
    </div>
  )
}

export default Layout
