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

import { useEffect } from 'react'
import 'styles/Common.css'

const DismissibleAlert = ({ message, handleCloseAlert, type, timeout }) => {
  useEffect(() => {
    setTimeout(() => {
      handleCloseAlert(true)
    }, timeout)
  })

  return (
    <div className={`alert-container alert-${type}`}>
      <p className='m-0'> {message}</p>
    </div>
  )
}

export default DismissibleAlert
