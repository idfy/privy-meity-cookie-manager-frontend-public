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

import { useContext } from 'react'
import { DomainInfoContext } from 'contexts/DomainInfoContext'
import { useAlert } from 'contexts/AlertContext'
import { getAllBanners } from 'services/banner'
import { isSuccessfulResponse } from 'utils/helperUtils'

export const useBanners = () => {
  const { setAllBanners } = useContext(DomainInfoContext)
  const { showAlertMessage } = useAlert()

  const fetchBanners = async ({ domainId, currentPage, pageSize, archived = false }) => {
    if (!domainId) return
    try {
      const response = await getAllBanners({
        domainId,
        currentPage,
        pageSize,
        archived: archived ? 'true' : 'false'
      })
      if (isSuccessfulResponse(response)) {
        setAllBanners((prev) => ({
          ...prev,
          [domainId]: {
            pageSize,
            currentPage,
            banners: response.data.banners,
            totalCount: response.data.total
          }
        }))
        return { success: true, data: response.data }
      } else {
        showAlertMessage(response.data.message || 'Error while fetching the tags', 'error')
      }
    } catch (error) {
      showAlertMessage('Error while fetching the tags', 'error')
    }
  }
  return { fetchBanners }
}

export default useBanners
