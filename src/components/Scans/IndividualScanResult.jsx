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

import { useContext, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { DomainInfoContext } from 'contexts/DomainInfoContext'
import { useErrorCode } from 'contexts/ErrorContext'
import { useAlert } from 'contexts/AlertContext'
import CustomTable from 'components/Common/CustomTable'
import CookieEditDrawer from 'components/CustomDrawers/CookieEditDrawer'
import FilterBox from 'components/Common/FilterBox'
import ErrorComponent from 'components/Common/ErrorComponent'
import ScanActions from './ScanActions'
import StatCards from './StatCards'
import AddCookieModal from 'components/CustomModals/AddCookie/AddCookieModal'
import ArchivalModal from 'components/CustomModals/ArchivalModal'
import { useScanResult } from 'hooks/useScansResult'
import { dropDownFormatData, getHosts, isSuccessfulResponse } from 'utils/helperUtils'
import { COOKIE_CATEGORIES } from 'static/staticVariables'
import BackArrow from 'assets/back-arrow.svg'
import { addCookie, deleteCookie, updateManualCookie, uploadCSV } from 'services/cookie.js'
import { buildCSVUploadPayload } from 'utils/addCookieUtils'

const IndividualScanResult = () => {
  const { errorCode } = useErrorCode()
  if (errorCode) return <ErrorComponent />

  const navigate = useNavigate()
  const { scanId, domainId } = useParams()
  const { showAlertMessage } = useAlert()
  const { selectedDomain: contextDomain } = useContext(DomainInfoContext)

  const selectedDomain = contextDomain?.domain_id || domainId

  const [showAddCookie, setShowAddCookie] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [cookieDataToEdit, setCookieDataToEdit] = useState(null)
  const [archivalModalState, setArchivalModalState] = useState({
    isOpen: false,
    itemId: null,
    itemName: null
  })

  const {
    loading,
    isUpdating,
    scanDetails,
    cookieData,
    selectedCategories,
    setSelectedCategories,
    selectedHosts,
    setSelectedHosts,
    selectedRows,
    bulkCategory,
    isFilterVisible,
    setIsFilterVisible,
    flatCookieList,
    handleApplyFilters,
    handleSaveChanges,
    handleBulkCategoryChange,
    handleExportScan,
    handleSelectRow,
    handleSelectAll,
    fetchScanResult
  } = useScanResult(scanId, selectedDomain)

  const handleCSVAddCookie = async (file) => {
    try {
      const formData = buildCSVUploadPayload(file, domainId)
      const response = await uploadCSV(scanId, formData)

      if (!isSuccessfulResponse(response)) {
        showAlertMessage(
          response?.data?.message || 'Failed to upload CSV',
          'error'
        )
        return
      }

      showAlertMessage('CSV uploaded successfully!', 'success')
      setShowAddCookie(false)
      await fetchScanResult(scanId, domainId)
    } catch (error) {
      showAlertMessage(
        error?.response?.data?.message ||
        error?.message ||
        'Something went wrong while uploading CSV',
        'error'
      )
    }
  }

  const handleManualAddCookie = async (cookiePayload) => {
    try {
      const response = await addCookie(scanId, cookiePayload)

      if (isSuccessfulResponse(response)) {
        showAlertMessage('Cookie added successfully!', 'success')
        setShowAddCookie(false)
        await fetchScanResult(scanId, domainId)
      } else {
        showAlertMessage(
          response?.data?.message || 'Failed to add cookie',
          'error'
        )
      }
    } catch (error) {
      showAlertMessage(
        error?.response?.data?.message ||
        error?.message ||
        'Something went wrong while adding cookie ',
        'error'
      )
    }
  }

  const handleAddCookie = (cookiePayload, type = 'manual') => {
    if (type === 'csv') {
      handleCSVAddCookie(cookiePayload)
    } else {
      handleManualAddCookie(cookiePayload)
    }
  }

  const showArchivalModal = (actionType, cookieId, cookieName) => {
    setArchivalModalState({
      isOpen: true,
      actionType,
      itemId: cookieId,
      itemName: cookieName
    })
  }

  const closeArchivalModal = () =>
    setArchivalModalState((prev) => ({ ...prev, isOpen: false }))

  const handleArchivalConfirm = async (cookieId) => {
    try {
      const cookieInfo = flatCookieList.find((c) => c.id === cookieId)

      if (!cookieInfo) {
        showAlertMessage('Cookie not found', 'error')
        return
      }

      const response = await deleteCookie({
        cookieId: cookieInfo.id,
        domainId: selectedDomain
      })

      if (isSuccessfulResponse(response)) {
        showAlertMessage('Cookie deleted Succesfully', 'success')
        await fetchScanResult(scanId, selectedDomain)
      } else {
        showAlertMessage('Failed to delete cookie', 'error')
      }
    } catch (error) {
      showAlertMessage('Error while deleting cookie', 'error')
    } finally {
      closeArchivalModal()
    }
  }

  const handleEditSave = async (payload, type) => {
    try {
      if (type === 'manual-update') {
        const response = await updateManualCookie(scanId, payload)

        if (isSuccessfulResponse(response)) {
          showAlertMessage('Cookie updated Succesfully', 'success')
          await fetchScanResult(scanId, selectedDomain)
        } else {
          showAlertMessage(
            response.data?.message || 'Something went wrong',
            'error'
          )
        }
        return
      }

      // SCAN UPDATE
      const response = await handleSaveChanges(payload)

      if (isSuccessfulResponse(response)) {
        showAlertMessage('Cookie updated Succesfully', 'success')
        await fetchScanResult(scanId, selectedDomain)
      } else {
        showAlertMessage(
          response.data?.message || 'Failed to update cookie',
          'error'
        )
      }
    } catch (error) {
      showAlertMessage('Something went wrong while updating cookie', 'error')
    }
  }

  const handleRowAction = (actionType, data) => {
    switch (actionType) {
      case 'edit':
        setCookieDataToEdit(data)
        setShowModal(true)
        break

      case 'archiveCookie': {
        const cookieId = data?.id

        if (!cookieId) {
          showAlertMessage('Cannot delete this cookie. Missing ID.', 'error')
          return
        }

        showArchivalModal('delete', cookieId, data.name)
        break
      }

      default:
        break
    }
  }

  const closeDropdown = () => setIsFilterVisible(false)

  if (loading || isUpdating) {
    return <div>Loading...</div>
  }

  return (
    <div className='h-screen'>
      <div className='scan-result-container'>
        <div className='scan-result-header mb-3 flex justify-between'>
          <div className='flex items-center'>
            <img
              src={BackArrow}
              alt='back-arrow'
              className='cursor-pointer'
              onClick={() =>
                navigate(`/cms/cookie-manager/dashboard/scans/${domainId}`)}
            />
            <h3 className='text-lg ml-2 font-bold mb-0'>Scan Results</h3>
          </div>

          <StatCards cookieData={cookieData} scanDetails={scanDetails} />
        </div>

        <div className='scan-history-container bg-white p-3'>
          <div className='flex justify-between mb-3'>
            <h3 className='text-lg font-bold ml-2'>Scan Cookies Results</h3>

            <div className='text-right flex items-center relative gap-2'>
              <ScanActions
                bulkCategory={{
                  options: dropDownFormatData(COOKIE_CATEGORIES),
                  selected: bulkCategory
                }}
                onBulkCategoryChange={(option) =>
                  handleBulkCategoryChange(option, flatCookieList)}
                selectedRows={selectedRows}
                onAddCookie={() => setShowAddCookie(true)}
                onExport={() => handleExportScan(flatCookieList)}
                onToggleFilter={() => setIsFilterVisible((prev) => !prev)}
              />

              {isFilterVisible && (
                <FilterBox
                  categories={dropDownFormatData(Object.keys(cookieData))}
                  hosts={dropDownFormatData(getHosts(cookieData))}
                  selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}
                  selectedHosts={selectedHosts}
                  setSelectedHosts={setSelectedHosts}
                  handleApplyFilters={() => handleApplyFilters(cookieData)}
                  closeDropdown={closeDropdown}
                />
              )}
            </div>
          </div>

          <CustomTable
            type='individualScanResult'
            data={flatCookieList}
            onRowClick={handleRowAction}
            selectedRows={selectedRows}
            onSelectRow={handleSelectRow}
            onSelectAll={handleSelectAll}
            onFieldChange={handleSaveChanges}
            categoryOptions={dropDownFormatData(COOKIE_CATEGORIES)}
          />
        </div>
      </div>

      {showModal && (
        <CookieEditDrawer
          show={showModal}
          handleClose={() => setShowModal(false)}
          cookieData={cookieDataToEdit}
          scanId={scanId}
          allCategories={dropDownFormatData(COOKIE_CATEGORIES)}
          onSave={handleEditSave}
        />
      )}

      {showAddCookie && (
        <AddCookieModal
          isOpen={showAddCookie}
          onClose={() => setShowAddCookie(false)}
          onAddCookie={handleAddCookie}
          existingCookies={flatCookieList}
          scanId={scanId}
          domainId={selectedDomain}
        />
      )}

      {archivalModalState.isOpen && (
        <ArchivalModal
          isOpen={archivalModalState.isOpen}
          handleClose={closeArchivalModal}
          onConfirm={handleArchivalConfirm}
          actionType='delete'
          itemType='cookie'
          itemId={archivalModalState.itemId}
          itemName={archivalModalState.itemName}
          skipTextConfirmation
        />
      )}
    </div>
  )
}

export default IndividualScanResult
