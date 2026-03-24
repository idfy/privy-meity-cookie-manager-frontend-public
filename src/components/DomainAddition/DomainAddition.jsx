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
import { useNavigate } from 'react-router-dom'
import { DomainInfoContext } from 'contexts/DomainInfoContext'
import { useAlert } from 'contexts/AlertContext'
import InputBox from 'components/Common/InputBox'
import CustomTable from 'components/Common/CustomTable'
import { addDomain, fetchAllDomains } from 'services/domain'
import { isSuccessfulResponse } from 'utils/helperUtils'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'styles/Home.css'
import 'styles/UserActivity.css'

const DomainAddition = () => {
  const [url, setUrl] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalCount, setTotalCount] = useState(0)
  const [paginatedDomains, setPaginatedDomains] = useState([])
  const { setSelectedDomain } = useContext(DomainInfoContext)
  const { showAlertMessage } = useAlert()
  const navigate = useNavigate()

  // Fetch all domains on component load
  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const response = await fetchAllDomains({ currentPage, pageSize })
        const data = response.data
        if (isSuccessfulResponse(response)) {
          setPaginatedDomains(data.domains)
          setSelectedDomain(data.domains[0])
          setTotalCount(data.total)
        } else {
          showAlertMessage(response.data.message || 'Something went wrong', 'notice')
        }
      } catch (error) {
        showAlertMessage('Failed to fetch the domains ', 'error')
      }
    }
    fetchDomains()
  }, [currentPage, pageSize])

  const handleInputChange = (e) => {
    setUrl(e.target.value)
  }

  const handleFormSubmit = async () => {
    try {
      const response = await addDomain(url)
      if (isSuccessfulResponse(response)) {
        showAlertMessage('Domain added succesfully ', 'success')
        window.location.reload()
      } else {
        showAlertMessage(response.data.message || 'Failed to add domain ', 'notice')
      }
    } catch (error) {
      showAlertMessage('Failed to add domain ', 'error')
    }
  }

  const handleRowClick = (domain) => {
    setSelectedDomain(domain)
    navigate(`/cms/cookie-manager/dashboard/scans/${domain.domain_id}`)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleFormSubmit()
    }
  }

  return (
    <div className='h-screen'>
      <div className='user-activity-container' id='domain-tab'>
        <div className='top-container'>
          <div className='title'>Cookie Checker Tool for Websites</div>
          <div className='desc'>
            Identifying cookies being used and understanding their purpose is a critical step in your
            website’s privacy compliance. Enter the URL of your website and we’ll scan it for cookies.
          </div>
          <div className='url-input-container' onKeyDown={handleKeyDown}>
            <div className='url-input' id='domain-url'>
              <InputBox
                type='text'
                placeholder='https://www.example.com'
                name='domain-url'
                value={url}
                iconPosition='left'
                onChange={handleInputChange}
              />
            </div>
            <button type='submit' id='btn-add-domain' className='scan-btn' onClick={handleFormSubmit}>
              Add Domain
            </button>
          </div>
        </div>
        <div className='table-container bg-white p-4'>
          <h3>Domain List</h3>
          <CustomTable
            type='domains'
            data={paginatedDomains}
            onRowClick={handleRowClick}
            pageSize={pageSize}
            setPageSize={setPageSize}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalCount={totalCount}
          />
        </div>
      </div>
    </div>
  )
}

export default DomainAddition
