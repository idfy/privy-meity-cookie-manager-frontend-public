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

import { useNavigate } from 'react-router-dom'
import { useErrorCode } from 'contexts/ErrorContext'
import { ERROR_DICT } from 'static/staticVariables'

const ErrorComponent = () => {
  const { errorCode, clearErrorCode } = useErrorCode()
  const errorData = ERROR_DICT[errorCode] || ERROR_DICT[500]
  const navigate = useNavigate()

  const handleRedirect = () => {
    clearErrorCode()
    navigate(errorData.redirectUrl)
  }

  return (
    <div className='error-screen'>
      <div className='error-img'>
        <img src={errorData.imageSource} alt={errorData.alt} />
      </div>
      <h1 className='error-name'>{errorData.message}</h1>
      <div className='error-desc'>
        <p>{errorData.description}</p>
      </div>
      <div className='error-redirect'>
        <button onClick={handleRedirect}>{errorData.redirectButtonText}</button>
      </div>
    </div>
  )
}

export default ErrorComponent
