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

import { useContext } from 'react'
import PropTypes from 'prop-types'
import Table from 'react-bootstrap/Table'
import { DomainInfoContext } from 'contexts/DomainInfoContext'
import ConsentTooltip from './ConsentTooltip'
import CustomPagination from './CustomPagination'
import CategoryDropdown from './CategoryDropdown'
import { formatDate, getConsentInfo, getStatusStyle } from 'utils/helperUtils'
import { TableConfig } from 'configs/TableConfig'
import InfoCircle from 'assets/info-circle.svg'
import PreviewIcon from 'assets/preview-icon.svg'
import EditIcon from 'assets/edit-icon.svg'
import CopyIcon from 'assets/copy.svg'
import PenIconBlack from 'assets/pen-black.svg'
import { DeleteIcon, UndoIcon } from './SvgComponents'
import 'styles/CustomTable.css'

const CustomTable = ({ type, data, onRowClick, pageSize, setPageSize, currentPage, setCurrentPage, totalCount, selectedRows = [], onSelectRow, onSelectAll, onFieldChange, categoryOptions = [], showingArchived = false }) => {
  const { selectedDomain } = useContext(DomainInfoContext)
  const tableConfig = TableConfig[type]
  const { columnNames, archivedColumnNames, paginationEnabled } = tableConfig
  const currentColumnNames = showingArchived && archivedColumnNames ? archivedColumnNames : columnNames
  const handleManualDelete = (data, onRowClick) => {
    if (data.addedBySource !== 'MANUAL') return
    if (!data.id) return

    onRowClick('archiveCookie', data)
  }
  const RowRenderer = ({ type, data, index, onRowClick, showingArchived }) => {
    switch (type) {
      case 'consentLogs': {
        const consentInfo = getConsentInfo(data.submitted_data)

        return (
          <tr key={data.id}>
            <td className='w-[35%]'>{data.data_principal_id}</td>
            <td className=''>{data.metadata.ip}</td>
            <td className='overflow-visible'>
              <div className={`tooltip-container ${consentInfo.cssClass}`}>
                <div className='flex flex-row gap-2 items-center'>
                  <p className='my-0.5 text-xs'>{consentInfo.displayName}</p>
                  <div className='info-circle-wrapper'>
                    <img src={InfoCircle} alt='Info' className='info-circle' />
                    <ConsentTooltip data={data.submitted_data} />
                  </div>
                </div>
              </div>
            </td>
            <td>{formatDate(data.created_at)}</td>
          </tr>
        )
      }

      case 'domains':
        return (
          <tr key={index} onClick={() => onRowClick(data)} className='cursor-pointer'>
            <td>{index}</td>
            <td>{data.url}</td>
            <td>{formatDate(data.created_at)}</td>
          </tr>
        )
      case 'scanHistory':
        return (
          <tr key={index} onClick={!showingArchived ? () => onRowClick('viewScan', data) : undefined} className={!showingArchived ? 'cursor-pointer' : ''}>
            <td className='w-[5%]'>{index}</td>
            <td className='w-[20%]'>{data.scan_id}</td>
            <td className='w-[20%]'>{selectedDomain.url}</td>
            <td className='w-[10%]'>{formatDate(showingArchived && data.archived_at ? data.archived_at : data.created_at)}</td>
            <td className='w-[10%]'>
              <div className={`status-label ${getStatusStyle(data.status)}`}>{data.status}</div>
            </td>
            <td className='w-[5%]'>
              <div className='flex justify-center'>
                {data.archived_at
                  ? (
                    <UndoIcon
                      className='cursor-pointer'
                      onClick={(e) => {
                        e.stopPropagation()
                        onRowClick?.('unArchiveScan', data)
                      }}
                    />
                  )
                  : (
                    <DeleteIcon
                      className='cursor-pointer'
                      onClick={(e) => {
                        e.stopPropagation()
                        onRowClick?.('archiveScan', data)
                      }}
                    />
                  )}
              </div>
            </td>
          </tr>
        )
      case 'individualScanResult':
        return (
          <tr
            key={index}
            className='hover:bg-gray-50 transition-colors'
          >
            <td className='w-[5%]'>
              <input
                type='checkbox'
                checked={selectedRows.includes(data.id)}
                onChange={() => onSelectRow && onSelectRow(data.id)}
              />
            </td>

            <td className='w-[5%]'>{index + 1}</td>

            <td className='w-[10%]'>{data.name}</td>

            <td className='w-[15%] overflow-visible align-middle'>
              <CategoryDropdown
                options={categoryOptions}
                selectedOption={data?.category || null}
                onSelect={(option) =>
                  onFieldChange?.({ ...data, category: option.value })}
              />
            </td>

            <td className='w-[30%]'>{data.description}</td>

            <td className='w-[20%]'>{data.host}</td>

            <td className='w-[10%]'>
              <div className='whitespace-normal break-words leading-[1.3]'>
                {data.expiry}
              </div>
            </td>

            <td className='w-[8%] px-3 py-2 text-center vertical-middle'>
              <div className='flex justify-center items-center gap-3 h-full'>
                <button
                  type='button'
                  onClick={() => onRowClick('edit', data)}
                  className='cursor-pointer w-5 h-5 flex justify-center items-center hover:scale-110 transition-transform duration-150'
                >
                  <img
                    src={PenIconBlack}
                    alt='edit-option'
                    className='w-5 h-5 object-contain'
                  />
                </button>

                <button
                  type='button'
                  disabled={data.addedBySource !== 'MANUAL'}
                  onClick={() => handleManualDelete(data, onRowClick)}
                  className={`w-5 h-5 flex justify-center items-center transition-transform duration-150
                  ${data.addedBySource !== 'MANUAL'
                      ? 'opacity-40 cursor-not-allowed hover:scale-100'
                      : 'cursor-pointer hover:scale-110'
                    }`}
                >
                  <DeleteIcon />
                </button>
              </div>
            </td>

          </tr>
        )

      case 'templates':
        return (
          <tr key={index}>
            <td className='w-[5%]'>{index}</td>
            <td className='w-[30%]'>{data.template_id}</td>
            <td className='w-[20%]'>{data.name}</td>
            <td>{data.status === true ? 'Saved' : 'Draft'}</td>
            <td className='w-[20%]'>{formatDate(showingArchived && data.archived_at ? data.archived_at : data.created_at)}</td>
            <td className='w-[10%]'>
              <p className='flex gap-3 m-0'>
                {!showingArchived && (
                  <>
                    <img
                      src={PreviewIcon}
                      alt='preview'
                      onClick={() => onRowClick?.('preview', data)}
                      className='cursor-pointer'
                    />
                    <img
                      src={EditIcon}
                      alt='edit-icon'
                      onClick={() => onRowClick?.('edit', data)}
                      className='cursor-pointer'
                    />
                  </>
                )}
                {data.archived_at
                  ? (
                    <UndoIcon
                      className='cursor-pointer'
                      onClick={(e) => {
                        e.stopPropagation()
                        onRowClick?.('unArchiveTemplate', data)
                      }}
                    />
                  )
                  : (
                    <DeleteIcon
                      className='cursor-pointer'
                      onClick={(e) => {
                        e.stopPropagation()
                        onRowClick?.('archiveTemplate', data)
                      }}
                    />
                  )}
              </p>
            </td>
          </tr>
        )
      case 'banners':
        return (
          <tr key={index}>
            <td className='w-[5%]'>{index}</td>
            <td className='w-[20%]'>{data.banner_id}</td>
            <td className='w-[15%]'>{data.name}</td>
            <td className='w-[20%]'>{data.scan_id}</td>
            <td className='w-[20%]'>{data.template_id}</td>
            <td className='w-[10%]'>{formatDate(showingArchived && data.archived_at ? data.archived_at : data.created_at)}</td>
            <td className='activation-toggle w-[10%]'>
              <div className='flex gap-3 m-0'>
                {!showingArchived && (
                  <>
                    <div className='form-check form-switch large-toggle'>
                      <input
                        className='form-check-input p-0 cursor-pointer disabled:!opacity-100'
                        type='checkbox'
                        role='switch'
                        checked={data.status === 'active'}
                        onChange={() => onRowClick?.('toggleBannerStatus', data.banner_id, data.name, data.status)}
                      />
                    </div>
                    <img
                      src={CopyIcon}
                      alt='copy'
                      className='cursor-pointer copy-btn'
                      onClick={() => onRowClick?.('copyScriptTag', data.banner_id)}
                    />
                  </>
                )}
                {data.archived_at
                  ? (
                    <UndoIcon
                      className='cursor-pointer'
                      onClick={(e) => {
                        e.stopPropagation()
                        onRowClick?.('unArchiveBanner', data.banner_id, data.name)
                      }}
                    />
                  )
                  : (
                    <DeleteIcon
                      className='cursor-pointer'
                      onClick={(e) => {
                        e.stopPropagation()
                        onRowClick?.('archiveBanner', data.banner_id, data.name)
                      }}
                    />
                  )}
              </div>
            </td>
          </tr>
        )
      default:
        return null
    }
  }

  const handleItemsPerpage = (itemCount) => {
    setPageSize(itemCount)
    setCurrentPage(1)
  }

  return (
    <div className='table-outer-container'>
      <Table hover className={`custom-table ${type === 'consentLogs' ? 'overflow-visible' : ''}`}>
        <thead className='table-head'>
          <tr>
            {type === 'individualScanResult' && (
              <th>
                <input
                  type='checkbox'
                  checked={Array.isArray(data) && data.length > 0 && selectedRows.length === data.length}
                  onChange={onSelectAll}
                />
              </th>
            )}
            {currentColumnNames.slice(type === 'individualScanResult' ? 1 : 0).map((columnName) => (
              <th key={columnName}>{columnName}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data) && data.length > 0
            ? (
              data.map((item, idx) => (
                <RowRenderer
                  key={idx}
                  type={type}
                  data={item}
                  index={paginationEnabled ? (currentPage - 1) * pageSize + (idx + 1) : idx}
                  onRowClick={onRowClick}
                  showingArchived={showingArchived}
                />
              ))
            )
            : (
              <tr>
                <td colSpan={currentColumnNames.length} className='empty-data'>
                  No Data Available
                </td>
              </tr>
            )}
        </tbody>
      </Table>

      {paginationEnabled && data && data.length > 0 && (
        <div className='pagination'>
          <CustomPagination
            pageSize={pageSize}
            totalCount={totalCount}
            handleItemsPerpage={handleItemsPerpage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      )}
    </div>
  )
}

CustomTable.propTypes = {
  type: PropTypes.string,
  data: PropTypes.array
}

export default CustomTable
