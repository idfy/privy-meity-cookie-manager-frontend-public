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

import { createContext, useContext, useState } from 'react'

const ErrorContext = createContext()

export const ErrorProvider = ({ children }) => {
  const [errorCode, setErrorCode] = useState(null)

  const clearErrorCode = () => setErrorCode(null)

  return (
    <ErrorContext.Provider
      value={{
        errorCode,
        setErrorCode,
        clearErrorCode
      }}
    >
      {children}
    </ErrorContext.Provider>
  )
}

export const useErrorCode = () => useContext(ErrorContext)
