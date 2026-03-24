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

import { useRef, useState } from 'react'
import { handleOutsideClick } from 'utils/helperUtils'
import { DropdownIcon } from './SvgComponents'

const CustomDropdown = ({ label, placeholder, options, selectedOption, onOptionSelect, alloptionsclassName, showLabel = true, containerClassName = '', disabled = false }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropDownRef = useRef(null)

  const toggleDropdown = () => {
    if (disabled) return
    setIsDropdownOpen((prev) => !prev)
  }

  const closeDropdown = () => setIsDropdownOpen(false)

  handleOutsideClick(dropDownRef, closeDropdown)

  return (
    <div className='relative'>
      {showLabel && label && (
        <h3 className='text-sm font-[600] text-left'>{label}</h3>
      )}
      <div
        className={`custom-dropdown-container relative ${containerClassName} ${disabled ? 'dropdown-disabled' : 'cursor-pointer'}`}
        onClick={toggleDropdown}
        ref={dropDownRef}
      >
        <h3 className='selected-domain text-sm m-0 font-normal'>
          {selectedOption?.label || placeholder}
        </h3>
        <DropdownIcon
          height={24}
          width={24}
          className={`ml-4 ${isDropdownOpen ? 'rotate-icon' : ''} ${disabled ? 'disabled-icon' : 'cursor-pointer'}`}
        />
      </div>
      {isDropdownOpen && (
        <div className={`all-options ${alloptionsclassName || 'absolute'}`}>
          {options.map((option, index) => (
            <p
              key={index}
              className={`${selectedOption?.value === option.value ? 'active' : ''} cursor-pointer m-0 mb-1 p-2 text-sm`}
              onClick={() => {
                onOptionSelect(option)
                setIsDropdownOpen(false)
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

export default CustomDropdown
