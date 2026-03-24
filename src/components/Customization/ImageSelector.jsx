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

import Greentick from 'assets/green-tick.svg'

const ImageSelector = ({ id, value, label, checked, onChange, imgSrc, isMobile = false }) => {
  return (
    <div className={`${isMobile ? 'centre-items' : ''}`}>
      <div className='inside-container'>
        <label htmlFor={id} className='element'>
          <div className='element-inside'>
            <img src={imgSrc} alt={label} className={`img-width ${checked ? 'selected' : ''}`} />
            <input
              type='radio'
              id={id}
              value={value}
              checked={checked}
              onChange={onChange}
              className='hide-radio'
            />
            <img src={Greentick} alt='selected' className={`green-tick ${checked ? 'show-tick' : ''}`} />
          </div>
          <h4 className='label'>{label}</h4>
        </label>
      </div>
    </div>
  )
}

export default ImageSelector
