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

import { useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { PreviewImageContext } from 'contexts/PreviewImageContext'
import desktopBackground from 'assets/desktop.png'
import mobileBackground from 'assets/mobile.png'

const useScreenshotFetcher = () => {
  const { getDomainScreenshots, storeDomainScreenshots } = useContext(PreviewImageContext)
  const { domainId } = useParams()

  useEffect(() => {
    if (!domainId) return

    const existing = getDomainScreenshots(domainId).desktop
    if (existing) return

    storeDomainScreenshots(domainId, {
      desktop: desktopBackground,
      tablet: desktopBackground,
      mobile: mobileBackground
    })
  }, [domainId])
}

export default useScreenshotFetcher
