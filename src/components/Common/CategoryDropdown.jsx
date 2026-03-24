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

import { useState, useEffect, useRef } from 'react'
import { DropdownIcon } from './SvgComponents'

/**
 * CategoryDropdown - A dropdown for selecting categories, styled as a chip.
 * @param {Array} options - Array of {label, value} for dropdown.
 * @param {String} selectedOption - The currently selected option.
 * @param {Function} onSelect - Callback when an option is selected.
 */
const CategoryDropdown = ({ options, selectedOption, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const isUncategorized = selectedOption && ['uncategorized', 'other'].includes(selectedOption.toLowerCase())

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClick)
    } else {
      document.removeEventListener('mousedown', handleClick)
    }
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen])

  return (
    <div className='relative' ref={dropdownRef}>
      <div
        className={`cursor-pointer category-dropdown-container ${isUncategorized ? 'uncategorized-chip' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className='flex-1'>{selectedOption || 'Select'}</span>
        <DropdownIcon
          className={`category-dropdown-icon ${isOpen ? 'rotate-icon' : ''}`}
          fillColor={isUncategorized ? '#131A25' : '#006294'}
        />
      </div>
      {isOpen && (
        <div className='all-options absolute mt-1 category-dropdown-menu'>
          {options.map((option) => (
            <p
              key={option.value}
              className={'chip-option chip-text' + (selectedOption === option.value ? ' chip-option-selected' : '')}
              onClick={() => {
                onSelect(option)
                setIsOpen(false)
              }}
            >
              {option.label}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

export default CategoryDropdown
