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

import DrawerContainer from 'components/Common/DrawerContainer'
import CategoryDropdown from 'components/Common/CategoryDropdown'
import { useAlert } from 'contexts/AlertContext'
import { buildManualCookieUpdatePayload } from 'utils/cookieUtils'
import { useCookieEdit } from 'hooks/useCookieEdit'
import { validateEditedCookie } from 'utils/cookieEditUtils'
import { SOURCE_TYPE_OPTION } from 'static/staticVariables'
import InputBox from 'components/Common/InputBox'

const CookieEditDrawer = ({ show, handleClose, cookieData, allCategories, onSave }) => {
  const { showAlertMessage } = useAlert()

  const {
    editedData,
    setEditedData,
    sourceInput,
    setSourceInput,
    isManual,
    hasChanges
  } = useCookieEdit(cookieData)

  const handleSave = () => {
    const error = validateEditedCookie(editedData)
    if (error) {
      showAlertMessage(error, 'error')
      return
    }

    if (!hasChanges) {
      handleClose()
      return
    }

    if (isManual) {
      const payload = buildManualCookieUpdatePayload(cookieData, editedData)
      onSave(payload, 'manual-update')
    } else {
      onSave(
        {
          cookieMasterId: cookieData.cookieMasterId,
          languageId: cookieData.languageId,
          category: editedData.category,
          description: editedData.description
        },
        'scan-update'
      )
    }

    handleClose()
  }

  return (
    <DrawerContainer
      show={show}
      handleClose={handleClose}
      title='COOKIE DETAILS'
      headerClass='px-3 py-3 text-sm'
      className='cookie-edit-drawer'
      backdrop={false}
    >
      <div className='flex flex-col justify-between h-full'>
        <div>

          {/* NAME */}
          <div className='mb-4'>
            <p className='drawer-label'>Cookie Name</p>
            {isManual
              ? (
                <InputBox
                  name='cookieName'
                  className='w-full'
                  value={editedData.name || ''}
                  onChange={(e) =>
                    setEditedData({ ...editedData, name: e.target.value })}
                />
              )
              : (
                <p className='m-0 text-sm font-bold'>{editedData.name}</p>
              )}
          </div>

          {/* CATEGORY */}
          <div className='mb-4'>
            <p className='drawer-label'>Category</p>
            <CategoryDropdown
              options={allCategories}
              selectedOption={editedData.category}
              onSelect={(opt) =>
                setEditedData((prev) => ({ ...prev, category: opt.value }))}
            />
          </div>

          {/* DESCRIPTION */}
          <div className='input-box-container mb-4'>
            <label htmlFor='description' className='drawer-label'>
              Description
            </label>

            <div className='input-wrapper'>
              <textarea
                id='description'
                name='description'
                placeholder='Description'
                value={editedData?.description || ''}
                onChange={(e) =>
                  setEditedData((prev) => ({
                    ...prev,
                    description: e.target.value
                  }))}
                className='field'
                rows={4}
              />
            </div>
          </div>

          {/* SCAN COOKIE UI */}
          {!isManual && (
            <>
              <div className='mb-4'>
                <p className='drawer-label'>Domain</p>
                <p className='m-0 text-sm font-bold'>{editedData.host}</p>
              </div>

              <div className='mb-4'>
                <p className='drawer-label'>Expiry</p>
                <p className='m-0 text-sm font-bold'>
                  {editedData?.expiry?.years ?? 0} year(s),{' '}
                  {editedData?.expiry?.months ?? 0} month(s),{' '}
                  {editedData?.expiry?.days ?? 0} day(s)
                </p>
              </div>
            </>
          )}

          {/* MANUAL COOKIE UI */}
          {isManual && (
            <>
              {/* DOMAIN */}
              <div className='mb-4'>
                <p className='drawer-label'>Host</p>

                <InputBox
                  name='domain'
                  className='w-full'
                  value={editedData.domain || ''}
                  onChange={(e) =>
                    setEditedData((prev) => ({ ...prev, domain: e.target.value }))}
                />
              </div>
              {/* Source type */}
              <div className='mb-4'>
                <p className='drawer-label'>Script Tag</p>

                <CategoryDropdown
                  options={SOURCE_TYPE_OPTION}
                  selectedOption={editedData.sourceType}
                  onSelect={(opt) =>
                    setEditedData((prev) => ({
                      ...prev,
                      sourceType: opt.value.toLowerCase()
                    }))}
                />
              </div>

              {/* SOURCES */}
              <div className='mb-4'>
                <p className='drawer-label'>Sources</p>

                <InputBox
                  name='sources'
                  className='w-full'
                  value={sourceInput}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\n/g, '')
                    setSourceInput(val)
                    setEditedData((prev) => ({
                      ...prev,
                      sources: val
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean)
                    }))
                  }}
                />
              </div>

              {/* EXPIRY */}
              <p className='drawer-label mb-1'>Expiry</p>
              <div className='flex gap-4 items-center mb-4'>
                {['years', 'months', 'days'].map((unit) => (
                  <div key={unit} className='flex items-center gap-1'>
                    <input
                      type='text'
                      className='w-14 border border-gray-300 rounded-md px-2 py-1 text-sm'
                      value={editedData?.expiry?.[unit] ?? 0}
                      onChange={(e) =>
                        setEditedData((prev) => ({
                          ...prev,
                          expiry: {
                            ...prev.expiry,
                            [unit]: Number(e.target.value.replace(/\D/g, '')) || 0
                          }
                        }))}
                    />
                    <span className='text-sm text-gray-600'>{unit}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className='flex justify-end gap-2'>
          {hasChanges && (
            <button
              className='blue-outline-button text-sm px-4 py-2 rounded-[8px]'
              onClick={() => setEditedData(cookieData)}
            >
              Cancel
            </button>
          )}

          <button
            className='blue-button text-sm px-4 py-2 rounded-[8px]'
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </DrawerContainer>
  )
}

export default CookieEditDrawer
