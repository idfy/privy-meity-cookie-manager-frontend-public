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

import { useState, useRef } from 'react'
import { VerticalDotsIcon } from './SvgComponents'
import { handleOutsideClick } from 'utils/helperUtils'

const TableOptionsDropdown = ({ onViewDeleted, onViewAll, showingArchived = false }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const toggleDropdown = () => {
    setIsOpen(prev => !prev)
  }

  const handleOptionClick = () => {
    showingArchived ? onViewAll() : onViewDeleted()
    setIsOpen(false)
  }

  handleOutsideClick(dropdownRef, () => setIsOpen(false))

  return (
    <div className='table-options-dropdown position-relative' ref={dropdownRef}>
      <div
        className='vertical-dots-container'
        onClick={toggleDropdown}
      >
        <VerticalDotsIcon className='vertical-dots-icon' />
      </div>

      {isOpen && (
        <div className='vertical-dots-menu'>
          <div
            className='vertical-dots-menu-item'
            id={showingArchived ? 'btn-all-items' : 'btn-recently-deleted'}
            onClick={handleOptionClick}
          >
            {showingArchived ? 'All Items' : 'Recently Deleted'}
          </div>
        </div>
      )}
    </div>
  )
}

export default TableOptionsDropdown
