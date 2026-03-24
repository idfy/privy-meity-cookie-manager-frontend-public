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
import UploadIcon from 'assets/upload-csv.svg'
import Frame from 'assets/Frame.svg'
import 'styles/AddCookieCsv.css'
import UploadFile from 'assets/upload-csv-icon.svg'
import CrossIcon from 'assets/cross.svg'
import ExclamationMark from 'assets/exclamation-triangle.svg'
import {
  extractCSVFromDrop,
  validateCSVFile,
  downloadCSVTemplate
} from 'utils/addCookieUtils'

const AddCSVUpload = ({ onAddCookie, onSaveRef }) => {
  const inputRef = useRef(null)

  const [csvFile, setCsvFile] = useState(null)
  const [csvError, setCsvError] = useState('')

  useEffect(() => {
    onSaveRef.current = handleSave
  })

  const handleDrop = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    const file = await extractCSVFromDrop(e)
    if (!file) return

    const error = validateCSVFile(file)
    if (error) {
      setCsvError(error)
      return
    }

    setCsvFile(file)
    setCsvError('')
  }

  const handleSave = () => {
    if (!csvFile) {
      setCsvError('Please select a CSV file before saving.')
      return
    }
    onAddCookie(csvFile, 'csv')
  }

  const handleRemoveFile = (e) => {
    e.stopPropagation()
    setCsvFile(null)
    setCsvError('')
    if (inputRef.current) inputRef.current.value = ''
  }

  const formatFileSize = (size) => {
    const mb = size / (1024 * 1024)
    return mb < 0.01 ? `${mb.toFixed(4)} MB` : `${mb.toFixed(2)} MB`
  }

  return (
    <div className='csv-wrapper flex flex-col w-[27.5rem] h-full mx-auto'>
      <div className='flex flex-col flex-grow'>
        <p className='csv-label'>Upload File below</p>

        <div
          className={`csv-upload-container upload-dash-border csv-upload-box ${csvFile ? 'has-file' : ''}`}
          onClick={() => { !csvFile && inputRef.current?.click() }}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type='file'
            accept='.csv'
            className='hidden'
            onChange={(e) => {
              const file = e.target.files[0]
              if (!file) {
                setCsvError('No file selected')
                return
              }

              const error = validateCSVFile(file)
              if (error) {
                setCsvError(error)
                return
              }

              setCsvFile(file)
              setCsvError('')
            }}
          />

          {csvFile
            ? (
              <div className='csv-file-display'>
                <img src={UploadFile} className='csv-file-icon' alt='file' />
                <div className='csv-file-info'>
                  <p className='csv-file-name'>{csvFile.name}</p>
                  <p className='csv-file-size'>{formatFileSize(csvFile.size)}</p>
                </div>
                <button className='csv-file-remove' onClick={handleRemoveFile}>
                  <img src={CrossIcon} alt='remove' className='w-4 h-4' />
                </button>
              </div>
            )
            : (
              <>
                <div className='csv-frame'>
                  <img src={Frame} className='w-full h-full' alt='frame' />
                  <img src={UploadIcon} className='csv-frame-icon' alt='upload' />
                </div>

                <div className='csv-upload-texts'>
                  <p className='csv-upload-title'>
                    <span className='csv-blue'>Upload a File</span> or drag and drop
                  </p>
                  <p className='csv-upload-subtitle'>.csv upto 10MB</p>
                </div>
              </>
            )}
        </div>

        {csvError && (
          <p className='csv-error flex items-center gap-2'>
            <img src={ExclamationMark} alt='error' className='w-4 h-4' />
            {csvError}
          </p>
        )}

        {csvFile && (
          <p className='csv-selected'>
            Selected File: <strong>{csvFile.name}</strong>
          </p>
        )}
      </div>

      <div className='csv-instructions'>
        <p className='csv-instructions-title'>Please follow the below steps</p>
        <ol className='csv-instructions-list'>
          <li>
            Download the{' '}
            <span className='csv-link' onClick={downloadCSVTemplate}>
              template .csv file from here.
            </span>
          </li>
          <li>Enter cookie details carefully in each column.</li>
          <li>Upload CSV file above.</li>
        </ol>
      </div>
    </div>
  )
}

export default AddCSVUpload
