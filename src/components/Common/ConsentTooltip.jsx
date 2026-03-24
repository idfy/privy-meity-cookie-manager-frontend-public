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
import { toSentenceCase } from 'utils/helperUtils'
import Tick from 'assets/empty-green-tick.svg'
import Cross from 'assets/red-cross.svg'
import 'styles/Common.css'

const ConsentTooltip = ({ data }) => {
  const sortedConsents = []
  for (const [key, value] of Object.entries(data)) {
    if (key.toLowerCase() === 'update' || key.toLowerCase() === 'necessary') continue

    // Insert true values at the beginning, false at the end
    if (value) {
      sortedConsents.unshift([key, value])
    } else {
      sortedConsents.push([key, value])
    }
  }
  sortedConsents.unshift(['necessary', 'true'])

  return (
    <div className='tooltip-content'>
      {sortedConsents.map(([key, value]) => (
        <div key={key} className='tooltip-data'>
          <p className='mb-0 mr-4 text-xs'>{toSentenceCase(key)}</p>
          {value
            ? (
              <img src={Tick} className='text-right h-4' alt='tick' />
            )
            : (
              <img src={Cross} className='text-right h-4' alt='cross' />
            )}
        </div>
      ))}
    </div>
  )
}

ConsentTooltip.propTypes = {
  data: PropTypes.object.isRequired
}

export default ConsentTooltip
