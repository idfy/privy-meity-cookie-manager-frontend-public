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

import PropTypes from 'prop-types'
import 'styles/Common.css'

const InputBox = ({
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  icon,
  iconPosition = 'left',
  name,
  required = false,
  labelClassName = '',
  className = '',
  disabled = false,
  rows
}) => {
  const InputElement = type === 'textarea' ? 'textarea' : 'input'

  return (
    <div className='input-box-container'>
      {label && (
        <label htmlFor={name} className={`${labelClassName} input-label `}>
          {label}
        </label>
      )}
      <div className={`input-wrapper ${iconPosition} ${className}`}>
        {icon && iconPosition === 'left' && <div className='input-icon'>{icon}</div>}
        <InputElement
          type={type}
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className='field'
          disabled={disabled}
          rows={rows}
        />
        {icon && iconPosition === 'right' && <div className='input-icon'>{icon}</div>}
      </div>
    </div>
  )
}

InputBox.propTypes = {
  label: PropTypes.string,
  type: PropTypes.oneOf(['text', 'email', 'password', 'number', 'date', 'time', 'url', 'textarea']),
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  icon: PropTypes.node, // Icon can be a React component (like an SVG)
  iconPosition: PropTypes.oneOf(['left', 'right']),
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
  className: PropTypes.string
}

export default InputBox
