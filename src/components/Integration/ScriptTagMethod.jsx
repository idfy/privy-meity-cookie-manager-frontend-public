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

import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAlert } from 'contexts/AlertContext'
import { DomainInfoContext } from 'contexts/DomainInfoContext'
import CustomTable from 'components/Common/CustomTable'
import GenerateScriptModal from 'components/CustomModals/GenerateScriptModal'
import ConfirmationModal from 'components/CustomModals/ConfirmationModal'
import ArchivalModal from 'components/CustomModals/ArchivalModal'
import TableOptionsDropdown from 'components/Common/TableOptionsDropdown'
import useBanners from 'hooks/useBanners'
import useBannerToggleConfirmation from 'hooks/useBannerToggleConfirmation'
import { archiveBanner, unArchiveBanner } from 'services/banner'
import {
  logMessage,
  frameUrlFromBannerId,
  generateScriptTag,
  handleCopy,
  isSuccessfulResponse
} from 'utils/helperUtils'

const ScriptTagMethod = () => {
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [dataFiduciaryId, setDataFiduciaryId] = useState(null)
  const { allBanners, showingArchived, setShowingArchived } = useContext(DomainInfoContext)
  const [activeBannerInDomain, setActiveBannerInDomain] = useState(null) // Track the currently active banner in the domainId
  const [archivalModalState, setArchivalModalState] = useState({
    isOpen: false,
    actionType: null,
    itemId: null,
    itemName: null,
    itemType: 'banner'
  })
  const { showAlertMessage } = useAlert()
  const { domainId } = useParams()
  const { fetchBanners } = useBanners()
  const { modalState, toggleConfirmationModal, handleBannerToggle } = useBannerToggleConfirmation(domainId)

  const loadBanners = async (archived = false) => {
    setLoading(true)
    const result = await fetchBanners({ domainId, currentPage, pageSize, archived })

    if (result?.data?.data_fiduciary_id) {
      setDataFiduciaryId(result.data.data_fiduciary_id)
    }
    setLoading(false)
  }

  useEffect(() => {
    const banners = allBanners[domainId]?.banners || []
    const activeBannerData = banners.find(banner => banner.status === 'active')
    setActiveBannerInDomain(activeBannerData?.name || null)
  }, [allBanners, domainId])

  const handleViewDeleted = () => {
    setShowingArchived(prev => ({ ...prev, banners: true }))
    setCurrentPage(1) // Reset to first page
    loadBanners(true)
  }

  const handleViewAllItems = () => {
    setShowingArchived(prev => ({ ...prev, banners: false }))
    setCurrentPage(1) // Reset to first page
    loadBanners(false)
  }

  useEffect(() => {
    if (!domainId) return
    const domainData = allBanners?.[domainId]
    if (!domainData || domainData.pageSize !== pageSize || domainData.currentPage !== currentPage) {
      loadBanners(showingArchived.banners)
    }
  }, [domainId, currentPage, pageSize, showingArchived.banners])

  const handleModalClose = () => setShowModal(false)

  const handleActivateBanner = async (bannerId, actionType = null) => {
    try {
      const response = await handleBannerToggle(bannerId, actionType)
      if (isSuccessfulResponse(response)) {
        await loadBanners(showingArchived.banners)
      } else {
        showAlertMessage(response.data.message || 'Error while activating the banner', 'error')
      }
    } catch (error) {
      showAlertMessage('Error while activating the banner', 'error')
    }
  }

  const handleCopyScriptTag = (bannerId) => {
    try {
      const url = frameUrlFromBannerId(bannerId, dataFiduciaryId)
      const scriptTag = generateScriptTag(url)
      handleCopy(scriptTag)
    } catch (error) {
      showAlertMessage('Failed to copy script tag', 'error')
    }
  }

  const handleBannerArchival = async (bannerId) => {
    try {
      const response = await archiveBanner(bannerId)
      if (isSuccessfulResponse(response)) {
        showAlertMessage('Banner deleted successfully', 'success')
        await loadBanners(showingArchived.banners)
      } else {
        showAlertMessage(response.data.message || 'Error while deleting the banner', 'error')
      }
    } catch (error) {
      showAlertMessage('Error while deleting the banner', 'error')
    }
  }

  const handleBannerRestoration = async (bannerId) => {
    try {
      const response = await unArchiveBanner(bannerId)
      if (isSuccessfulResponse(response)) {
        showAlertMessage('Banner restored successfully', 'success')
        await loadBanners(showingArchived.banners)
      } else {
        showAlertMessage(response.data.message || 'Error while restoring the banner', 'error')
      }
    } catch (error) {
      showAlertMessage('Error while restoring the banner', 'error')
    }
  }

  const showArchivalModal = (actionType, bannerId, bannerName) => {
    setArchivalModalState({
      isOpen: true,
      actionType,
      itemId: bannerId,
      itemName: bannerName,
      itemType: 'banner'
    })
  }

  const closeArchivalModal = () => {
    setArchivalModalState(prev => ({ ...prev, isOpen: false }))
  }

  const handleArchivalConfirm = async (bannerId) => {
    await handleBannerArchival(bannerId)
    closeArchivalModal()
  }

  const handleBannerStatusChange = async (bannerId, bannerName, bannerStatus) => {
    try {
      const bannerAction = bannerStatus === 'active' ? 'deactivate' : 'activate'

      // Show confirmation modal for deactivation and for activation only if there's already an active banner
      if (bannerAction === 'deactivate' || (bannerAction === 'activate' && activeBannerInDomain)) {
        toggleConfirmationModal({
          isOpen: true,
          actionType: bannerAction,
          bannerId,
          bannerName
        })
      } else {
        await handleActivateBanner(bannerId, 'activate')
      }
    } catch (error) {
      showAlertMessage('Error while changing the banner status', 'error')
    }
  }
  const handleRowClick = async (actionType, bannerId, bannerName = '', bannerStatus = '') => {
    try {
      if (actionType === 'toggleBannerStatus') await handleBannerStatusChange(bannerId, bannerName, bannerStatus)
      else if (actionType === 'archiveBanner') showArchivalModal('archive', bannerId, bannerName)
      else if (actionType === 'unArchiveBanner') await handleBannerRestoration(bannerId)
      else if (actionType === 'copyScriptTag') handleCopyScriptTag(bannerId)
    } catch (error) {
      logMessage('something went wrong', error, 'error')
    }
  }

  if (loading) {
    return <div className='h-screen'>Loading...</div> // Show loading indicator until data is fetched
  }

  return (
    <div className='h-screen'>
      <div className='table-container bg-white p-4' id='script-container'>
        <div className='flex justify-between mb-4'>
          <h3 className='m-0'>{showingArchived.banners ? 'Recently Deleted Script Tags' : 'List of Script Tags'}</h3>
          <div className='flex items-center gap-3'>
            {!showingArchived.banners && (
              <button className='scan-btn' id='btn-generate-script-tag' onClick={() => setShowModal(true)}>
                Generate Script Tag
              </button>
            )}
            <TableOptionsDropdown
              onViewDeleted={handleViewDeleted}
              onViewAll={handleViewAllItems}
              showingArchived={showingArchived.banners}
            />
          </div>
        </div>

        <CustomTable
          type='banners'
          data={allBanners[domainId]?.banners}
          onRowClick={handleRowClick}
          pageSize={pageSize}
          setPageSize={setPageSize}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalCount={allBanners[domainId]?.totalCount || 0}
          showingArchived={showingArchived.banners}
        />
        {showModal && <GenerateScriptModal show={showModal} handleClose={handleModalClose} />}
        {modalState.isOpen && (
          <ConfirmationModal
            isOpen={modalState.isOpen}
            toggleConfirmationModal={toggleConfirmationModal}
            onConfirm={handleActivateBanner}
            actionType={modalState.actionType}
            bannerId={modalState.bannerId}
            bannerName={modalState.bannerName}
            activeBannerInDomain={activeBannerInDomain}
          />
        )}
        {archivalModalState.isOpen && (
          <ArchivalModal
            isOpen={archivalModalState.isOpen}
            handleClose={closeArchivalModal}
            onConfirm={handleArchivalConfirm}
            actionType={archivalModalState.actionType}
            itemType={archivalModalState.itemType}
            itemId={archivalModalState.itemId}
            itemName={archivalModalState.itemName}
          />
        )}
      </div>
    </div>
  )
}

export default ScriptTagMethod
