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

import { useState, useEffect } from 'react'
import InputBox from 'components/Common/InputBox'
import CustomDropdown from 'components/Common/CustomDropdown'
import PlusIcon from 'assets/plus-icon.svg'
import CrossIcon from 'assets/cross.svg'
import { COOKIE_CATEGORIES, MAX_SOURCES, SOURCE_TYPE_OPTION } from 'static/staticVariables'
import ExclamationMarkError from 'assets/exclamation-circle.svg'
import 'styles/AddCookieManually.css'

import {
  resetAddCookieForm,
  toggleDurationSession,
  validateAddCookieForm,
  isValidSource,
  buildAddCookiePayload,
  handleNumericDurationChange
} from 'utils/addCookieUtils'

const cookieTypeOptions = COOKIE_CATEGORIES.map((item) => ({
  label: item[0] + item.slice(1).toLowerCase(),
  value: item
}))

const AddManualcookie = ({ existingCookies, onAddCookie, onClose, onSaveRef, domainId }) => {
  const [form, setForm] = useState(resetAddCookieForm())
  const [sourceInput, setSourceInput] = useState('')
  const [sourceError, setSourceError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const addNewSource = (rawInput, currentSources) => {
    const url = rawInput.trim()
    if (!url) return { errors: { sourceError: 'Enter a URL' } }
    if (!isValidSource(url)) return { errors: { sourceError: 'Please enter a valid URL' } }
    if (currentSources.includes(url)) return { errors: { sourceError: 'This source is already added' } }
    if (currentSources.length >= MAX_SOURCES) { return { errors: { sourceError: `You can add up to ${MAX_SOURCES} sources only` } } }

    return { newSources: [...currentSources, url], errors: null }
  }

  const handleAddSource = () => {
    const { newSources, errors } = addNewSource(sourceInput, form.sources)
    if (errors) {
      setSourceError(errors.sourceError)
      return
    }

    setForm((prev) => ({ ...prev, sources: newSources }))
    setSourceInput('')
    setSourceError('')
    setFieldErrors((prev) => ({ ...prev, sources: '' }))
  }

  const handleRemoveSource = (i) => {
    setForm((prev) => ({
      ...prev,
      sources: prev.sources.filter((_, idx) => idx !== i)
    }))
  }

  const handleSave = (e) => {
    const finalSources = [...form.sources]

    if (sourceInput.trim()) {
      if (!isValidSource(sourceInput)) {
        setSourceError('Please enter a valid Source before saving')
        return
      }
      finalSources.push(sourceInput.trim())
    }

    const errors = validateAddCookieForm(form, finalSources, existingCookies, domainId)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    const payload = buildAddCookiePayload(form, finalSources, domainId)
    onAddCookie(payload)
    onClose()
  }

  useEffect(() => {
    onSaveRef.current = handleSave
  })

  return (
    <form className='manual-wrapper flex flex-col gap-1 w-full'>

      {/* COOKIE ID */}
      <div className='flex w-full gap-3'>

        {/* Cookie ID */}
        <div className='flex flex-col gap-1 w-1/2'>
          <label className='manual-label'>Cookie Name</label>
          <InputBox
            placeholder='Eg: CookieMonster-v1'
            value={form.cookieId}
            onChange={(e) => setForm({ ...form, cookieId: e.target.value })}
            className={`manual-input ${fieldErrors.cookieId ? 'manual-input-error' : ''}`}
          />
          {fieldErrors.cookieId && <p className='manual-error'>{fieldErrors.cookieId}</p>}
        </div>

        {/* Cookie Domain */}
        <div className='flex flex-col gap-1 w-1/2'>
          <label className='manual-label'>Cookie Domain</label>
          <InputBox
            placeholder='Eg: xyz.com'
            value={form.domain}
            onChange={(e) => setForm({ ...form, domain: e.target.value })}
            className={`manual-input ${fieldErrors.domain ? 'manual-input-error' : ''}`}
          />
          {fieldErrors.domain && <p className='manual-error'>{fieldErrors.domain}</p>}
        </div>
      </div>

      {/* DURATION */}
      <div className='flex flex-col gap-1'>
        <label className='manual-label'>Duration</label>

        <div className='flex items-center gap-3'>

          <label className='manual-session-box'>
            <input
              type='checkbox'
              checked={form.untilSession}
              onChange={(e) => setForm(toggleDurationSession(form, e.target.checked))}
              className='manual-checkbox'
            />
            <span className='manual-session-label'>Until Session</span>
          </label>

          <span className='manual-or-text'>Or</span>

          <div className={`manual-duration-box ${form.untilSession ? 'manual-disabled' : ''}`}>
            <div className='manual-duration-item'>
              <input
                value={form.years}
                onChange={(e) =>
                  setForm(handleNumericDurationChange(form, 'years', e.target.value))}
                placeholder='00'
                maxLength={2}
                disabled={form.untilSession}
                className='manual-duration-input'
              />
              <span className='manual-duration-unit'>Years</span>
            </div>

            <div className='manual-duration-item'>
              <input
                value={form.months}
                onChange={(e) =>
                  setForm(handleNumericDurationChange(form, 'months', e.target.value))}
                placeholder='00'
                maxLength={2}
                disabled={form.untilSession}
                className='manual-duration-input'
              />
              <span className='manual-duration-unit'>Months</span>
            </div>

            {/* DAYS */}
            <div className='manual-duration-item'>
              <input
                value={form.days}
                onChange={(e) =>
                  setForm(handleNumericDurationChange(form, 'days', e.target.value))}
                placeholder='00'
                maxLength={2}
                disabled={form.untilSession}
                className='manual-duration-input'
              />
              <span className='manual-duration-unit'>Days</span>
            </div>
          </div>
        </div>

        {fieldErrors.duration && <p className='manual-error'>{fieldErrors.duration}</p>}
      </div>

      {/* COOKIE TYPE */}
      <div className='flex w-full gap-3'>

        {/* Cookie Category */}
        <div className='flex flex-col gap-1 w-1/2'>
          <label className='manual-label'>Cookie Category</label>

          <CustomDropdown
            placeholder='Choose Cookie Category'
            options={cookieTypeOptions}
            selectedOption={cookieTypeOptions.find((o) => o.value === form.cookieType)}
            onOptionSelect={(opt) => setForm({ ...form, cookieType: opt.value })}
            containerClassName='manual-dropdown'
            alloptionsclassName='w-full left-0'
          />

          {fieldErrors.cookieType && (
            <p className='manual-error'>{fieldErrors.cookieType}</p>
          )}
        </div>

        {/* Source Type */}
        <div className='flex flex-col gap-1 w-[46%]'>

          <label className='manual-label'>Source Type</label>

          <CustomDropdown
            placeholder='Choose Source Type'
            options={SOURCE_TYPE_OPTION}
            selectedOption={SOURCE_TYPE_OPTION.find((o) => o.value === form.sourceType)}
            onOptionSelect={(opt) => setForm({ ...form, sourceType: opt.value })}
            containerClassName='manual-dropdown'
            alloptionsclassName='w-full left-0'
          />

          {fieldErrors.sourceType && (
            <p className='manual-error'>{fieldErrors.sourceType}</p>
          )}
        </div>

      </div>

      {/* SOURCES */}
      <div className='flex flex-col gap-1'>
        <label className='manual-label'>Source</label>

        <div className='relative'>
          <InputBox
            placeholder='https://analytics.google.com'
            value={sourceInput}
            onChange={(e) => setSourceInput(e.target.value)}
            className={`manual-input ${sourceError || fieldErrors.sources ? 'manual-input-error manual-input-has-error' : ''
              }`}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAddSource()
              }
            }}
          />

          {sourceError && (
            <div className='manual-error-icon-container'>
              <div className='manual-error-tooltip'>
                {sourceError}
                <div className='manual-error-tooltip-arrow' />
              </div>
              <img src={ExclamationMarkError} alt='Error' className='manual-error-icon' />
            </div>
          )}
        </div>

        {fieldErrors.sources && <p className='manual-error'>{fieldErrors.sources}</p>}

        {/* Add More */}
        <button type='button' onClick={handleAddSource} className='manual-add-more'>
          <img src={PlusIcon} className='w-3 h-3' alt='Add' /> Add More
        </button>

        {/* Added Sources */}
        {form.sources.map((src, i) => (
          <div key={i} className='manual-source-box'>
            <input value={src} disabled className='manual-source-input' />
            <button type='button' onClick={() => handleRemoveSource(i)}>
              <img src={CrossIcon} className='manual-remove-icon' alt='Remove' />
            </button>
          </div>
        ))}
      </div>

      {/* DESCRIPTION */}
      <div className='manual-description-wrapper'>
        <label className='manual-label'>Description</label>

        <InputBox
          type='textarea'
          rows={4}
          value={form.description}
          onChange={(e) => {
            const value = e.target.value
            if (value.length <= 500) {
              setForm({ ...form, description: value })
            }
          }}
          className={`manual-textarea ${fieldErrors.description ? 'manual-input-error' : ''
            }`}
          placeholder='Text area input box'
        />
        <div className='manual-description-footer'>
          <p className='manual-error'>
            {fieldErrors.description || ''}
          </p>

          <span className={`manual-char-counter ${fieldErrors.description ? 'error' : ''}`}>
            {form.description.length}/500
          </span>
        </div>
      </div>

    </form>
  )
}

export default AddManualcookie
