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
import { changeBannerStatus } from 'services/banner'

const useBannerToggleConfirmation = (domainId) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    actionType: null,
    bannerId: null,
    bannerName: null
  })

  const toggleConfirmationModal = ({
    isOpen = false,
    actionType = null,
    bannerId = null,
    bannerName = null
  }) => {
    setModalState({
      isOpen,
      actionType,
      bannerId,
      bannerName
    })
  }

  const handleBannerToggle = async (bannerId, actionType = null) => {
    try {
      const bannerAction = actionType || modalState.actionType
      const isActivate = bannerAction === 'activate'
      const response = isActivate
        ? await changeBannerStatus(domainId, bannerId, 'active')
        : await changeBannerStatus(domainId, bannerId, 'inactive')
      return response
    } catch (error) {
      console.log('error in activation', error)
    }
  }

  return {
    modalState,
    toggleConfirmationModal,
    handleBannerToggle
  }
}

export default useBannerToggleConfirmation
