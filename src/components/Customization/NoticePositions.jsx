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

import { DESKTOP_COOKIE_NOTICE_POSITIONS } from 'static/staticVariables'

const NoticePositions = ({ bannerType, positionDesktop, handleChange }) => {
  return (
    <div className='grid-elements'>
      {DESKTOP_COOKIE_NOTICE_POSITIONS[bannerType]?.map(({ position, label }) => (
        <label htmlFor={position} className='flex cursor-pointer' key={position}>
          <input
            type='radio'
            id={position}
            name='positionDesktop'
            value={position}
            checked={positionDesktop === position}
            onChange={() => handleChange({ positionDesktop: position }, 'cookie-banner')}
          />
          <p className='my-0 ml-2'>{label}</p>
        </label>
      ))}
    </div>
  )
}

export default NoticePositions
