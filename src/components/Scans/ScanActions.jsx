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

import CustomDropdown from 'components/Common/CustomDropdown'
import FilterIconBlack from 'assets/filter-icon-black.svg'
import ExportIcon from 'assets/export.svg'
import AddManualIcon from 'assets/Add-circle.svg'

const ScanActions = ({
  bulkCategory,
  onBulkCategoryChange,
  selectedRows,
  onAddCookie,
  onExport,
  onToggleFilter
}) => {
  return (
    <>
      <hr className='divider' />

      <CustomDropdown
        label='Category'
        placeholder='Set Category'
        options={bulkCategory.options}
        selectedOption={bulkCategory.selected}
        onOptionSelect={onBulkCategoryChange}
        disabled={selectedRows.length === 0}
        showLabel={false}
        containerClassName={`h-[2.3rem] ${selectedRows.length === 0 ? 'dropdown-disabled' : 'dropdown-black-theme'}`}
      />

      <hr className='divider' />

      <button
        className={`black-btn ${selectedRows.length > 0 ? 'black-btn-disabled' : ''}`}
        onClick={onAddCookie}
        disabled={selectedRows.length > 0}
      >
        <img
          src={AddManualIcon}
          alt='add'
          className='h-[18px] w-[18px] mr-2'
        />
        Add Cookie
      </button>

      <hr className='divider' />

      <button
        className={`black-btn ${selectedRows.length > 0 ? 'black-btn-disabled' : ''}`}
        id='btn-scan-filters'
        onClick={onToggleFilter}
        disabled={selectedRows.length > 0}
      >
        Filters
        <img
          src={FilterIconBlack}
          alt='filter-icon'
          className={`ml-1 h-4 ${selectedRows.length > 0 ? 'disabled-icon' : ''}`}
        />
      </button>

      <button
        className={`black-btn ${selectedRows.length > 0 ? 'black-btn-disabled' : ''}`}
        id='btn-scan-export'
        onClick={onExport}
        disabled={selectedRows.length > 0}
      >
        <img
          src={ExportIcon}
          alt='export-icon'
          className={`ml-1 h-4 ${selectedRows.length > 0 ? 'disabled-icon' : ''}`}
        />
      </button>
    </>
  )
}

export default ScanActions
