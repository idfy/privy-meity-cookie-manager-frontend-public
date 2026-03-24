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

import { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { DropdownIcon } from './SvgComponents'
import { DomainInfoContext } from 'contexts/DomainInfoContext'
import { useAlert } from 'contexts/AlertContext'
import { fetchAllDomains } from 'services/domain'
import { handleOutsideClick, isSuccessfulResponse } from 'utils/helperUtils'
import plusIcon from 'assets/plus-icon.svg'

const DomainSelector = () => {
  const { allDomains, setAllDomains, selectedDomain, setSelectedDomain } = useContext(DomainInfoContext)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropDownRef = useRef(null) // Ref for dropdown container
  // eslint-disable-next-line no-unused-vars
  const [currentPage, setCurrentPage] = useState(1)
  // eslint-disable-next-line no-unused-vars
  const [pageSize, setPageSize] = useState(100)
  const { showAlertMessage } = useAlert()
  const navigate = useNavigate()
  const { domainId } = useParams()

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const response = await fetchAllDomains({ currentPage, pageSize })
        const domains = response.data.domains
        if (isSuccessfulResponse(response)) {
          setAllDomains(domains)
          const selectedDomainData = domains.find((domain) => domain.domain_id === domainId)
          setSelectedDomain(selectedDomainData)
        } else {
          showAlertMessage(response.data.message || 'No domains found', 'notice')
        }
      } catch (error) {
        showAlertMessage('Failed to fetch domains', 'error')
      }
    }

    if (!allDomains || !allDomains.length) fetchDomains()
  }, [domainId])

  const toggleDropdown = (event) => {
    event.stopPropagation() // Prevent immediate closure when toggling
    setIsDropdownOpen((prev) => !prev)
  }

  const handleDomainChange = (domain) => {
    const currentPath = window.location.pathname
    const updatedPath = currentPath.replace(domainId, domain.domain_id)
    navigate(updatedPath) // Updates the URL without reloading the page
    setSelectedDomain(domain)
    setIsDropdownOpen(false)
  }

  const handleAddDomainClick = () => {
    navigate('/cms/cookie-manager/dashboard/')
    setIsDropdownOpen(false)
  }

  const closeDropdown = () => setIsDropdownOpen(false)

  handleOutsideClick(dropDownRef, closeDropdown)

  return (
    <div className='domain-select-container' ref={dropDownRef}>
      <h3 className='text-lg mr-3 font-bold mb-0'>Domain:</h3>
      <div className='cursor-pointer custom-dropdown-container w-[21rem]' onClick={toggleDropdown}>
        <h3 className='selected-domain text-base m-0 font-normal'>{selectedDomain?.url || ''}</h3>
        <DropdownIcon className={`cursor-pointer ml-4 ${isDropdownOpen ? 'rotate-icon' : ''}`} width={24} height={24} fillColor='#131A25' />
      </div>
      {isDropdownOpen && (
        <div className='all-domains'>
          <div className='overflow-y-auto max-h-[150px]'>
            {allDomains.map((domain, index) => (
              <p
                key={index}
                className={`${selectedDomain === domain ? 'active' : ''} cursor-pointer m-0 mb-1 p-2 `}
                onClick={() => handleDomainChange(domain)}
              >
                {domain.url}
              </p>
            ))}
          </div>
          <div className='add-domain flex mt-2 py-2 cursor-pointer' id='btn-add-new-domain' onClick={handleAddDomainClick}>
            <img src={plusIcon} alt='plus-icon' className='cursor-pointer mr-2' /> Add New Domain
          </div>
        </div>
      )}
    </div>
  )
}

export default DomainSelector
