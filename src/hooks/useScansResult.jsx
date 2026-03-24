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

import { useState, useEffect, useContext, useMemo, useCallback } from 'react'
import { useAlert } from 'contexts/AlertContext'
import { useErrorCode } from 'contexts/ErrorContext'
import { UserInfoContext } from 'contexts/UserInfoContext'
import {
  formatCookieData,
  exportDataToCsv,
  filterScanDataForExport,
  logMessage,
  isSuccessfulResponse
} from 'utils/helperUtils'
import { applyCookieFilters } from 'utils/filterUtils'

import { getIndividualScanResult, updateCookieData } from 'services/scan'
import { buildCookieUpdatePayload } from 'utils/cookieUtils'

/**
 * Custom hook to manage scan results state, filtering, updates & actions.
 *
 * @param {string} scanId - The scan ID for fetching results
 * @param {string} domainId - The domain ID for updating cookies
 * @returns {object} - All state & handlers for scan results
 */

export const useScanResult = (scanId, domainId) => {
  const { selectedLanguage } = useContext(UserInfoContext)
  const { showAlertMessage } = useAlert()
  const { setErrorCode } = useErrorCode()

  const [isFilterVisible, setIsFilterVisible] = useState(false)
  const [dataState, setDataState] = useState({
    cookieData: {},
    filteredData: {},
    scanDetails: null
  })

  const [loadingState, setLoadingState] = useState({
    isLoading: true,
    isUpdating: false
  })

  const [selectionState, setSelectionState] = useState({
    selectedRows: [],
    bulkCategory: null,
    selectedCategories: [],
    selectedHosts: []
  })

  const updateDataState = useCallback((updates) => {
    setDataState(prev => ({ ...prev, ...updates }))
  }, [])

  const updateLoadingState = useCallback((updates) => {
    setLoadingState(prev => ({ ...prev, ...updates }))
  }, [])

  const updateSelectionState = useCallback((updates) => {
    setSelectionState(prev => ({ ...prev, ...updates }))
  }, [])

  const fetchScanResult = async (id, shouldReapplyFilters = false) => {
    try {
      const response = await getIndividualScanResult(id)
      if (isSuccessfulResponse(response)) {
        // eslint-disable-next-line camelcase
        const { scan_details, ...otherData } = response.data.data

        updateDataState({
          cookieData: otherData,
          // eslint-disable-next-line camelcase
          scanDetails: scan_details
        })

        shouldReapplyFilters
          ? handleApplyFilters(otherData)
          : updateDataState({ filteredData: otherData })
      } else if (response.status === 500) {
        setErrorCode(500)
      } else {
        showAlertMessage(response.data.message || 'No results found', 'notice')
      }
    } catch (error) {
      showAlertMessage('Failed to fetch scan result', 'error')
    } finally {
      updateLoadingState({ isLoading: false })
    }
  }

  useEffect(() => {
    fetchScanResult(scanId)
  }, [scanId])

  const handleApplyFilters = (data = dataState.cookieData) => {
    try {
      setIsFilterVisible(false)
      const filtered = applyCookieFilters(
        data,
        selectionState.selectedCategories,
        selectionState.selectedHosts
      )
      updateDataState({ filteredData: filtered })
    } catch (error) {
      logMessage('error in filter', error)
      showAlertMessage('Failed to apply filters', 'error')
    }
  }

  const updateCookiesAndRefresh = async (cookies, successMessage) => {
    updateLoadingState({ isUpdating: true })
    const payload = buildCookieUpdatePayload(domainId, cookies)

    try {
      const response = await updateCookieData(payload, scanId)

      if (isSuccessfulResponse(response)) {
        showAlertMessage(successMessage || 'Cookies updated successfully', 'success')
        await fetchScanResult(scanId, true)
      } else {
        showAlertMessage(
          response.data.details || response.data.message || 'Failed to update cookies',
          'error'
        )
      }
      return response
    } catch (error) {
      logMessage('error while updating cookies', error, 'error')
      showAlertMessage('Something went wrong while updating cookies', 'error')

      return error
    } finally {
      updateLoadingState({ isUpdating: false })
    }
  }

  const handleSaveChanges = async (updatedData) => {
    logMessage('updatedInfo', updatedData)

    const response = await updateCookiesAndRefresh(
      [updatedData],
      'Cookie updated successfully'
    )
    return response
  }

  const handleBulkCategoryChange = async (option, flatCookieList) => {
    updateSelectionState({ bulkCategory: option })
    if (!selectionState.selectedRows.length) return
    if (selectionState.selectedRows.length > 20) {
      showAlertMessage(
        'You can update only 20 cookies at once. Please select fewer cookies',
        'notice'
      )
      updateSelectionState({ bulkCategory: null })
      return
    }

    const selectedRowsSet = new Set(selectionState.selectedRows)
    const selectedCookies = flatCookieList
      .filter(cookie => selectedRowsSet.has(cookie.id))
      .map(cookie => ({ ...cookie, category: option.value }))

    await updateCookiesAndRefresh(selectedCookies, 'Category updated')
    updateSelectionState({ selectedRows: [], bulkCategory: null })
  }

  const handleRowCategoryChange = async (cookie, option) => {
    await updateCookiesAndRefresh(
      [{ ...cookie, category: option.value }],
      'Category updated'
    )
  }

  const handleExportScan = (csvData) => {
    if (!csvData?.length) {
      showAlertMessage('No data available to export', 'notice')
      return
    }
    try {
      const fileName = `Cookie_Data_${scanId}.csv`
      const selectedColumnsData = filterScanDataForExport(csvData, [
        'name',
        'category',
        'description',
        'host',
        'expiry'
      ])
      const exportResult = exportDataToCsv(selectedColumnsData, fileName)
      showAlertMessage(
        exportResult ? 'Data exported successfully' : 'Failed to export data',
        exportResult ? 'success' : 'error'
      )
    } catch (error) {
      showAlertMessage('Failed to prepare data for export', 'error')
    }
  }

  const flatCookieList = useMemo(() => {
    return formatCookieData(
      dataState.filteredData,
      selectedLanguage,
      domainId
    )
  }, [dataState.filteredData, selectedLanguage, domainId])

  const handleSelectRow = useCallback((id) => {
    setSelectionState(prev => ({
      ...prev,
      selectedRows: prev.selectedRows.includes(id)
        ? prev.selectedRows.filter(rowId => rowId !== id)
        : [...prev.selectedRows, id]
    }))
  }, [])

  const handleSelectAll = useCallback(() => {
    setSelectionState(prev => ({
      ...prev,
      selectedRows:
        prev.selectedRows.length === flatCookieList.length
          ? []
          : flatCookieList.map(row => row.id)
    }))
  }, [flatCookieList])

  return {
    loading: loadingState.isLoading,
    isUpdating: loadingState.isUpdating,
    cookieData: dataState.cookieData,
    filteredData: dataState.filteredData,
    scanDetails: dataState.scanDetails,
    selectedCategories: selectionState.selectedCategories,
    selectedHosts: selectionState.selectedHosts,
    selectedRows: selectionState.selectedRows,
    bulkCategory: selectionState.bulkCategory,
    isFilterVisible,
    flatCookieList,

    setSelectedCategories: (categories) => {
      if (typeof categories === 'function') {
        setSelectionState(prev => ({
          ...prev,
          selectedCategories: categories(prev.selectedCategories)
        }))
      } else {
        updateSelectionState({ selectedCategories: categories })
      }
    },

    setSelectedHosts: (hosts) => {
      if (typeof hosts === 'function') {
        setSelectionState(prev => ({
          ...prev,
          selectedHosts: hosts(prev.selectedHosts)
        }))
      } else {
        updateSelectionState({ selectedHosts: hosts })
      }
    },

    setSelectedRows: (rows) => updateSelectionState({ selectedRows: rows }),
    setBulkCategory: (category) => updateSelectionState({ bulkCategory: category }),
    setIsFilterVisible,

    fetchScanResult,
    handleApplyFilters,
    handleSaveChanges,
    handleBulkCategoryChange,
    handleRowCategoryChange,
    handleExportScan,
    handleSelectRow,
    handleSelectAll
  }
}
