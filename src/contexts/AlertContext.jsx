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

import { createContext, useState, useContext } from 'react'
import DismissibleAlert from 'components/Common/DismissibleAlert'
import { DISMISSIBLE_ALERT_TIMEOUT } from 'static/staticVariables'

const AlertContext = createContext()

export const AlertProvider = ({ children }) => {
  const [alertMessage, setAlertMessage] = useState('')
  const [alertType, setAlertType] = useState('notice')
  const [showAlert, setShowAlert] = useState(false)
  const [alertTimeout, setAlertTimeout] = useState(DISMISSIBLE_ALERT_TIMEOUT)

  const showAlertMessage = (message, type = 'notice', timeout = DISMISSIBLE_ALERT_TIMEOUT) => {
    setAlertMessage(message)
    setShowAlert(true)
    setAlertType(type)
    setAlertTimeout(timeout)
  }

  const handleCloseAlert = () => {
    setShowAlert(false)
  }

  return (
    <AlertContext.Provider value={{ showAlertMessage }}>
      {showAlert && (
        <DismissibleAlert
          message={alertMessage}
          handleCloseAlert={handleCloseAlert}
          type={alertType}
          timeout={alertTimeout}
        />
      )}
      {children}
    </AlertContext.Provider>
  )
}

export const useAlert = () => useContext(AlertContext)
