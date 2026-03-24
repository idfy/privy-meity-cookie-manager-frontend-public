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
import { useAlert } from 'contexts/AlertContext'
import InputBox from 'components/Common/InputBox'
import ModalContainer from 'components/Common/ModalContainer'
import { toSentenceCase } from 'utils/helperUtils'

export const ARCHIVAL_ACTION_CONFIG = {
  archive: { actionVerb: 'archive', actionText: 'Delete' },
  unarchive: { actionVerb: 'restore', actionText: 'Restore' },
  delete: { actionVerb: 'delete', actionText: 'Delete' }
}

const ArchivalModal = ({
  isOpen,
  handleClose,
  onConfirm,
  actionType,
  itemType,
  itemId,
  itemName,
  skipTextConfirmation = false
}) => {
  const [confirmationText, setConfirmationText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { showAlertMessage } = useAlert()

  const actionConfig = ARCHIVAL_ACTION_CONFIG[actionType] || { actionText: 'Delete', actionVerb: 'delete' }
  const requiredText = actionConfig.actionText
  const isTextCorrect = confirmationText.toLowerCase() === requiredText.toLowerCase()

  const handleConfirm = async () => {
    if (!skipTextConfirmation && !isTextCorrect) {
      showAlertMessage('Please type the confirmation text correctly', 'error')
      return
    }

    setIsLoading(true)
    try {
      await onConfirm(itemId)
      handleModalClose()
    } catch (error) {
      showAlertMessage(`Failed to ${actionConfig.actionVerb} ${itemType}`, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleModalClose = () => {
    setConfirmationText('')
    setIsLoading(false)
    handleClose()
  }

  return (
    <ModalContainer
      show={isOpen}
      handleClose={handleModalClose}
      title={`${actionConfig.actionText} ${toSentenceCase(itemType)}`}
    >
      <div className='p-3'>
        <div className='mb-4'>
          <p className='text-sm text-gray-600 mt-2'>
            This action will {actionConfig.actionText.toLowerCase()} the {itemType}: <strong>&quot;{itemName}&quot;</strong>
          </p>
        </div>
        {!skipTextConfirmation && (
          <div className='mb-6'>
            <InputBox
              type='text'
              label={`Type "${requiredText}" to confirm :`}
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder={`Type "${requiredText}" here`}
              disabled={isLoading}
            />
          </div>
        )}

        <div className='flex gap-3 justify-end'>
          <button
            type='button'
            onClick={handleModalClose}
            disabled={isLoading}
            className='btn-cancel'
          >
            Cancel
          </button>
          <button
            type='button'
            onClick={handleConfirm}
            disabled={(!skipTextConfirmation && !isTextCorrect) || isLoading}
            className='btn-activate'
          >
            {isLoading ? 'Processing...' : actionConfig.actionText}
          </button>
        </div>
      </div>
    </ModalContainer>
  )
}

export default ArchivalModal
