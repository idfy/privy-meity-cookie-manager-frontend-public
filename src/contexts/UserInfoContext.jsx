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

export const UserInfoContext = createContext()

const UserInfoProvider = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [selectedTemplate, setSelectedTemplate] = useState({
    id: null,
    languageCode: 'en'
  })

  return (
    <UserInfoContext.Provider
      value={{
        selectedLanguage,
        setSelectedLanguage,
        selectedTemplate,
        setSelectedTemplate
      }}
    >
      {children}
    </UserInfoContext.Provider>
  )
}

export default UserInfoProvider
