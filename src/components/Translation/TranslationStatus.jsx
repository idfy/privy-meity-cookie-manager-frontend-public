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

import { TickIconRounded, FailureIconRounded } from 'components/Common/SvgComponents'

const renderSuccessMessage = (message) => (
  <div className='flex items-center gap-2 justify-center mt-3'>
    <TickIconRounded />
    <p className='m-0 text-[#1A7A1E] text-sm text-center'>{message}</p>
  </div>
)

const renderErrorMessage = (message) => (
  <div className='mt-3'>
    <div className='flex items-center gap-2 justify-center'>
      <FailureIconRounded />
      <p className='m-0 text-[#AA5800] text-sm text-center'>{message}</p>
    </div>
    <p className='m-0 text-sm text-center mt-2'>
      Please try again after some time.
    </p>
  </div>
)

const TranslationStatus = ({ translationResult }) => {
  if (!translationResult) return null
  const { type, message } = translationResult

  return type === 'success' ? renderSuccessMessage(message) : renderErrorMessage(message)
}

export default TranslationStatus
