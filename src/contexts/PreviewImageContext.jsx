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

import { createContext, useState } from 'react'

export const PreviewImageContext = createContext({
  storeDomainScreenshots: () => { },
  getDomainScreenshots: () => ({
    desktop: '',
    mobile: '',
    tablet: ''
  })
})

const PreviewImageProvider = ({ children }) => {
  const [screenshotUrls, setScreenshotUrls] = useState({})

  const storeDomainScreenshots = (domainId, urls) => {
    setScreenshotUrls((prev) => ({
      ...prev,
      [domainId]: urls
    }))
  }

  const getDomainScreenshots = (domainId) => {
    return (
      screenshotUrls[domainId] || {
        desktop: '',
        mobile: '',
        tablet: ''
      }
    )
  }

  return (
    <PreviewImageContext.Provider
      value={{
        storeDomainScreenshots,
        getDomainScreenshots
      }}
    >
      {children}
    </PreviewImageContext.Provider>
  )
}

export default PreviewImageProvider
