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
import InputBox from 'components/Common/InputBox'
import CustomTable from 'components/Common/CustomTable'
import { getConsentlogs } from 'services/consentLogs'
import { escapeCSV, exportDataToCsv, formatDate, getConsentInfo, isSuccessfulResponse } from 'utils/helperUtils'
import 'styles/ConsentLogs.css'

const ConsentLogs = () => {
  const { showAlertMessage } = useAlert()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [startTime, setStartTime] = useState()
  const [endTime, setEndTime] = useState()
  const [clearTime, setClearTime] = useState(false)
  const { consentLogs, setConsentLogs } = useContext(DomainInfoContext)
  const { domainId } = useParams()

  const fetchConsentLogs = async () => {
    if (!domainId) return
    try {
      const response = await getConsentlogs({ domainId, currentPage, pageSize, startTime, endTime })
      const data = response.data
      if (isSuccessfulResponse(response)) {
        setConsentLogs((prev) => ({
          ...prev,
          [domainId]: {
            pageSize,
            currentPage,
            consents: data.data,
            totalCount: data.total
          }
        }))
      } else {
        showAlertMessage(response.data.message || 'Error while fetching the tags', 'error')
      }
    } catch (error) {
      showAlertMessage('Failed to fetch the consent logs ', 'error')
    }
  }

  useEffect(() => {
    const domainData = consentLogs?.[domainId]
    if (!domainData || domainData.pageSize !== pageSize || domainData.currentPage !== currentPage) {
      fetchConsentLogs()
    }
  }, [domainId, currentPage, pageSize])

  async function applyDateFilter() {
    if (!startTime || !endTime) {
      showAlertMessage('Please select both start and end dates', 'error')
      return
    }
    await fetchConsentLogs()
  }

  async function clearDateFilter() {
    setStartTime('')
    setEndTime('')
    setClearTime(true)
  }

  useEffect(() => {
    fetchConsentLogs()
  }, [clearTime])

  async function changeStartDate(event) {
    setStartTime(event.target.value)
  }

  async function changeEndDate(event) {
    setEndTime(event.target.value)
  }

  const formatCookieCategories = (submittedData) => {
    if (!submittedData) return ''
    const { update, ...cookieCategories } = submittedData
    return JSON.stringify(escapeCSV(cookieCategories))
  }

  const formatConsentLogRow = (row) => {
    if (!row) return null

    const consentStatus = getConsentInfo(row.submitted_data)
    const escapedCookieCategories = formatCookieCategories(row.submitted_data)

    return {
      'Data Principal Id': row.data_principal_id || 'N/A',
      'IP Address': row.metadata?.ip || 'N/A',
      'Consent Status': consentStatus?.displayName || '',
      'Cookie Categories': escapedCookieCategories || '',
      'Created On': formatDate(row.created_at) || ''
    }
  }

  async function handleExport(data) {
    if (!data || data.length === 0) {
      showAlertMessage('No consent logs available to export', 'notice')
      return
    }
    try {
      const csvData = data.map(formatConsentLogRow)

      const fileName = `consent_logs_${new Date().toISOString().split('T')[0]}.csv`
      const exportResult = exportDataToCsv(csvData, fileName)
      showAlertMessage(
        exportResult ? 'Consent logs exported successfully' : 'Failed to export consent logs',
        exportResult ? 'success' : 'error'
      )
    } catch (error) {
      showAlertMessage('Failed to prepare data for export', 'error')
    }
  }

  return (
    <div className='h-screen' id='consent-logs-tab'>
      <div className='consent-logs-container'>
        <div className='consent-header'>
          <h3>Consent Overview</h3>
          <button
            className='faint-scan-btn' id='btn-export-consent-logs'
            onClick={() => handleExport(consentLogs[domainId]?.consents || [])}
          >
            Export
          </button>
        </div>
        <div className='logs-container'>
          <div className='date-filter-zone'>
            <InputBox
              type='datetime-local'
              id='consent-tab-start-date'
              name='start-date'
              placeholder='DD/MM/YYYY'
              label='Start Date'
              value={startTime}
              onChange={changeStartDate}
            />
            <InputBox
              type='datetime-local'
              id='consent-tab-end-date'
              name='end-date'
              placeholder='DD/MM/YYYY'
              label='End Date'
              value={endTime}
              onChange={changeEndDate}
            />
            <div className='flex'>
              <button className='scan-btn' id='btn-consent-log-search' onClick={applyDateFilter}>
                Search
              </button>
              <button className='faint-scan-btn' id='btn-consent-clear-search' onClick={clearDateFilter}>
                Clear Search
              </button>
            </div>
          </div>
          <div className='table-section' id='consent-container'>
            <CustomTable
              type='consentLogs'
              data={consentLogs[domainId]?.consents}
              pageSize={pageSize}
              setPageSize={setPageSize}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalCount={consentLogs[domainId]?.totalCount || 0}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConsentLogs
