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
import CommonModal from 'components/Common/ModalContainer'
import AddManualcookie from './AddManualcookie'
import AddCSVUpload from './AddCSVUpload'
import AddManualIcon from 'assets/Add-circle.svg'
import UploadIcon from 'assets/upload-file-icon.svg'
import 'styles/AddCookieModal.css'

const AddCookieModal = ({ isOpen, onClose, onAddCookie, existingCookies, scanId, domainId }) => {
  const [activeTab, setActiveTab] = useState('manual')
  const saveRef = useRef(() => { })

  useEffect(() => {
    if (isOpen) {
      setActiveTab('manual')
    }
  }, [isOpen])

  return (
    <CommonModal
      show={isOpen}
      handleClose={onClose}
      title='Add Cookies'
      width={480}
      height={657}
      titleClass='modal-title'
    >
      <div className='px-4 pt-0 flex flex-col overflow-x-hidden modal-body'>

        {/* Tabs */}
        <div className='modal-section mt-[0.5rem]'>
          <div className='w-full flex rounded-lg tab-container'>
            <button
              type='button'
              onClick={() => setActiveTab('manual')}
              className={`flex items-center justify-center gap-2 flex-1 tab-btn ${activeTab === 'manual' ? 'tab-active' : ''
                }`}
            >
              <img
                src={AddManualIcon}
                className='tab-icon'
                data-active={activeTab === 'manual'}
                alt='Add Manually'
              />
              <span className='text-sm font-medium'>Add Manually</span>
            </button>

            <button
              type='button'
              onClick={() => setActiveTab('csv')}
              className={`flex items-center justify-center gap-2 flex-1 tab-btn ${activeTab === 'csv' ? 'tab-active' : ''
                }`}
            >
              <img
                src={UploadIcon}
                className='tab-icon'
                data-active={activeTab === 'csv'}
                alt='Upload CSV'
              />
              <span className='text-sm font-medium'>Upload CSV</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className='modal-section flex-1 mt-2 flex flex-col gap-4 overflow-y-auto hide-scrollbar'>
          {activeTab === 'manual'
            ? (
              <AddManualcookie
                existingCookies={existingCookies}
                onAddCookie={onAddCookie}
                onClose={onClose}
                onSaveRef={saveRef}
                scanId={scanId}
                domainId={domainId}
              />
            )
            : (
              <AddCSVUpload
                onAddCookie={onAddCookie}
                onSaveRef={saveRef}
                scanId={scanId}
                domainId={domainId}
              />
            )}
        </div>
      </div>

      {/* Footer */}
      <div className='modal-footer px-4'>
        <button
          type='button'
          onClick={onClose}
          className='h-[40px] px-6 rounded-lg border border-[#D1D5DB] bg-white text-[#131A25]'
        >
          Close
        </button>

        <button
          type='button'
          onClick={() => saveRef.current()}
          className='h-[40px] px-6 rounded-lg bg-[#214698] text-white font-medium'
        >
          Save
        </button>
      </div>
    </CommonModal>
  )
}

export default AddCookieModal
