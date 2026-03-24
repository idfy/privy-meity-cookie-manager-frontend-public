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

import { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { DomainInfoContext } from 'contexts/DomainInfoContext'
import { useAlert } from 'contexts/AlertContext'
import CustomTable from 'components/Common/CustomTable'
import ArchivalModal from 'components/CustomModals/ArchivalModal'
import TableOptionsDropdown from 'components/Common/TableOptionsDropdown'
import { archiveScan, getScanHistory, initiateScan, unArchiveScan } from 'services/scan'
import { isSuccessfulResponse } from 'utils/helperUtils'
import SearchIcon from 'assets/search-icon-white.svg'

const ScanHistory = () => {
  const navigate = useNavigate()
  const { showAlertMessage } = useAlert()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [archivalModalState, setArchivalModalState] = useState({
    isOpen: false,
    actionType: null,
    itemId: null,
    itemName: null,
    itemType: 'scan'
  })
  const { allScans, setAllScans, showingArchived, setShowingArchived } = useContext(DomainInfoContext)
  const { domainId } = useParams()

  const getScans = async (archived = false) => {
    if (!domainId) return
    try {
      const response = await getScanHistory({
        domainId,
        currentPage,
        pageSize,
        archived: archived ? 'true' : 'false'
      })
      const data = response.data
      if (isSuccessfulResponse(response)) {
        setAllScans((prev) => ({
          ...prev,
          [domainId]: {
            pageSize,
            currentPage,
            scans: data.scans,
            totalCount: data.total
          }
        }))
      } else {
        showAlertMessage(response.data.message || 'Failed to fetch the scan history ', 'error')
      }
    } catch (error) {
      showAlertMessage('Failed to fetch the scan history ', 'error')
    }
  }

  const handleViewDeleted = () => {
    setShowingArchived(prev => ({ ...prev, scans: true }))
    setCurrentPage(1) // Reset to first page
    getScans(true)
  }

  const handleViewAll = () => {
    setShowingArchived(prev => ({ ...prev, scans: false }))
    setCurrentPage(1) // Reset to first page
    getScans(false)
  }

  useEffect(() => {
    const domainData = allScans?.[domainId]
    if (!domainData || domainData.pageSize !== pageSize || domainData.currentPage !== currentPage) {
      getScans(showingArchived.scans)
    }
  }, [domainId, currentPage, pageSize, showingArchived.scans])

  const showArchivalModal = (actionType, scanId, scanName) => {
    setArchivalModalState({
      isOpen: true,
      actionType,
      itemId: scanId,
      itemName: scanName,
      itemType: 'scan'
    })
  }

  const closeArchivalModal = () => {
    setArchivalModalState(prev => ({ ...prev, isOpen: false }))
  }

  const handleScanArchival = async (scanId) => {
    try {
      const response = await archiveScan(scanId, domainId)
      if (isSuccessfulResponse(response)) {
        showAlertMessage('Scan deleted successfully', 'success')
        await getScans(showingArchived.scans)
      } else {
        showAlertMessage(response.data.message || 'Failed to delete scan', 'error')
      }
    } catch (error) {
      showAlertMessage('Error while deleting the scan', 'error')
    }
  }

  const handleScanRestoration = async (scanId) => {
    try {
      const response = await unArchiveScan(scanId, domainId)
      if (isSuccessfulResponse(response)) {
        showAlertMessage('Scan restored successfully', 'success')
        await getScans(showingArchived.scans)
      } else {
        showAlertMessage(response.data.message || 'Failed to restore scan', 'error')
      }
    } catch (error) {
      showAlertMessage('Error while restoring the scan', 'error')
    }
  }

  const handleArchivalConfirm = async (scanId) => {
    await handleScanArchival(scanId)
    closeArchivalModal()
  }

  const handleRowClick = async (actionType, scanInfo) => {
    if (actionType === 'archiveScan') {
      showArchivalModal('archive', scanInfo.scan_id, `${scanInfo.scan_id}`)
      return
    }
    if (actionType === 'unArchiveScan') {
      await handleScanRestoration(scanInfo.scan_id)
      return
    }
    // Navigate to scan result page only if the scan is completed
    actionType === 'viewScan' && scanInfo.status === 'completed'
      ? navigate(`/cms/cookie-manager/dashboard/scan-result/${domainId}/${scanInfo.scan_id}`)
      : showAlertMessage('Scan is not completed yet', 'notice')
  }

  const handleScanInitiate = async () => {
    try {
      const response = await initiateScan(domainId)
      if (isSuccessfulResponse(response)) {
        showAlertMessage('Scan initiated successfully', 'success')
        await getScans()
      } else {
        showAlertMessage(response.data.message || 'Failed to initiate the scan', 'error')
      }
    } catch (error) {
      showAlertMessage('Failed to initiate the scan', 'error')
    }
  }

  return (
    <div className='scan-history-container bg-white p-3' id='scans-tab'>
      <div className='flex justify-between mb-3'>
        <h3 className='text-lg font-bold ml-2'>{showingArchived.scans ? 'Recently Deleted Scans' : 'Scan Results'}</h3>
        <div className='text-right flex items-center gap-3'>
          {!showingArchived.scans && (
            <button className='scan-btn flex items-center' id='btn-scan-now' onClick={handleScanInitiate}>
              <img src={SearchIcon} alt='search-icon' className='mr-1' />
              Scan Now
            </button>
          )}
          <TableOptionsDropdown
            id='btn-scan-options'
            onViewDeleted={handleViewDeleted}
            onViewAll={handleViewAll}
            showingArchived={showingArchived.scans}
          />
        </div>
      </div>
      <CustomTable
        id='scan-history-table'
        type='scanHistory'
        data={allScans[domainId]?.scans}
        onRowClick={handleRowClick}
        pageSize={pageSize}
        setPageSize={setPageSize}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalCount={allScans[domainId]?.totalCount || 0}
        showingArchived={showingArchived.scans}
      />
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
  )
}

export default ScanHistory
