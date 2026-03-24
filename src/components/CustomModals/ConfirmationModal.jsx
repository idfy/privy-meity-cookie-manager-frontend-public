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

import { useState } from 'react'
import ModalContainer from 'components/Common/ModalContainer'
import InputBox from 'components/Common/InputBox'
import { useAlert } from 'contexts/AlertContext'

const CONFIRMATION_TEXTS = {
  activate: 'activate',
  deactivate: 'deactivate'
}

const ALERT_MESSAGES = {
  incorrectText: 'Please type the confirmation text correctly',
  failureText: 'Failed to change status of banner'
}

const ConfirmationModal = ({
  isOpen,
  toggleConfirmationModal,
  onConfirm,
  actionType,
  bannerId,
  bannerName,
  activeBannerInDomain
}) => {
  const [confirmationText, setConfirmationText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { showAlertMessage } = useAlert()

  const isActivate = actionType === 'activate'
  const requiredText = isActivate ? CONFIRMATION_TEXTS.activate : CONFIRMATION_TEXTS.deactivate
  const isTextCorrect = confirmationText.toLowerCase() === requiredText

  const handleConfirm = async () => {
    if (!isTextCorrect) {
      showAlertMessage(ALERT_MESSAGES.incorrectText, 'error')
      return
    }

    setIsLoading(true)
    try {
      await onConfirm(bannerId)
      handleClose()
    } catch (error) {
      showAlertMessage(ALERT_MESSAGES.failureText, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setConfirmationText('')
    setIsLoading(false)
    toggleConfirmationModal({ isOpen: false, actionType: null, bannerId: null, bannerName: null })
  }

  return (
    <ModalContainer show={isOpen} handleClose={handleClose} title={`Confirm Banner ${isActivate ? 'Activation' : 'Deactivation'}`} closeId='confirmation'>
      <div className='p-3'>
        <div className='mb-4'>
          {isActivate && activeBannerInDomain && (
            <div>
              <p className='text-sm text-gray-600 mt-2'>
                This action will activate the banner: <strong>&quot;{bannerName}&quot;</strong>
              </p>
              <p className='error-line'>
                Warning: <br />The currently active banner <strong>&quot;{activeBannerInDomain}&quot;</strong> will be automatically deactivated
              </p>
            </div>
          )}
          {(!isActivate || !activeBannerInDomain) && (
            <p className='text-sm text-gray-600 mt-2'>
              This action will {isActivate ? 'activate' : 'deactivate'} the banner: <strong>&quot;{bannerName}&quot;</strong>.
            </p>
          )}
        </div>

        <div className='mb-6'>
          <InputBox
            type='text'
            label={`Type ${requiredText} to confirm:`}
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            placeholder={`Type "${requiredText}" here`}
            disabled={isLoading}
          />
        </div>

        <div className=' flex gap-3 justify-end'>
          <button
            type='button'
            onClick={handleClose}
            disabled={isLoading}
            className='btn-cancel'
          >
            Cancel
          </button>
          <button
            type='button'
            onClick={handleConfirm}
            disabled={!isTextCorrect || isLoading}
            className='btn-activate'
          >
            {isLoading ? 'Processing...' : `${isActivate ? 'Activate' : 'Deactivate'} Banner`}
          </button>
        </div>
      </div>
    </ModalContainer>
  )
}

export default ConfirmationModal
