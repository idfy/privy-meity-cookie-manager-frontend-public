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

import { useEffect, useRef } from 'react'
import CustomDropdown from './CustomDropdown'
import SelectedOptions from './SelectedOptions'

const FilterBox = ({
  categories,
  hosts,
  selectedCategories,
  setSelectedCategories,
  selectedHosts,
  setSelectedHosts,
  handleApplyFilters,
  closeDropdown
}) => {
  const filterBoxRef = useRef(null)

  const handleOptionSelect = (setterFunction) => (selectedItem) => {
    setterFunction((prev) => {
      if (prev.includes(selectedItem.value)) {
        return prev
      }
      return [...prev, selectedItem.value]
    })
  }

  const handleClear = () => {
    setSelectedCategories([])
    setSelectedHosts([])
  }

  useEffect(() => {
    if (!filterBoxRef.current) return

    const stopPropagation = (event) => {
      event.stopPropagation()
    }
    filterBoxRef.current.addEventListener('mousedown', stopPropagation)
    document.addEventListener('mousedown', closeDropdown)

    return () => {
      document.removeEventListener('mousedown', closeDropdown)
      if (filterBoxRef.current) {
        filterBoxRef.current.removeEventListener('mousedown', stopPropagation)
      }
    }
  }, [])

  return (
    <div className='filter-box-container' ref={filterBoxRef}>
      <p className='font-[600] text-lg'>Filters</p>
      <CustomDropdown
        label='Category'
        placeholder='Choose Category'
        options={categories}
        onOptionSelect={handleOptionSelect(setSelectedCategories)}
      />
      <SelectedOptions setterFunction={setSelectedCategories} options={selectedCategories} />

      <CustomDropdown
        label='Host'
        placeholder='Choose Host'
        options={hosts}
        onOptionSelect={handleOptionSelect(setSelectedHosts)}
      />
      <SelectedOptions setterFunction={setSelectedHosts} options={selectedHosts} />

      <div className='filter-footer flex mt-3 justify-end'>
        <button className='filter-btn' onClick={handleClear}>
          Clear
        </button>
        <button className='scan-btn' onClick={handleApplyFilters}>
          Apply
        </button>
      </div>
    </div>
  )
}

export default FilterBox
