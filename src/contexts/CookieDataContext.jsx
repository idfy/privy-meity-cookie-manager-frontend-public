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

export const CookieDataContext = createContext()

const CookieDataProvider = ({ children }) => {
  const [cookieData, setCookieData] = useState({
    categorisedCookies: {},
    cookieCount: 0,
    scannedPages: 0
  })

  return <CookieDataContext.Provider value={{ cookieData, setCookieData }}>{children}</CookieDataContext.Provider>
}

export default CookieDataProvider
